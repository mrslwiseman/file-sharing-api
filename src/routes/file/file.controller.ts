import { Request, Response } from "express";
import busboy from "busboy";
import StorageContext from "../../storage/storageContext";
import LocalDiskFileStorageStrategy from "../../storage/providers/localFileSystem";
import KeyGen from "../../storage/keygen";
import crypto from 'node:crypto'
import { FileInfo } from "./file.types";
import FileService from './file.service'
import getSizeTransform from 'stream-size';
const { pipeline, finished } = require('stream/promises');

const keyGen = new KeyGen(crypto);
const fileService = new FileService()

function createStorageContext() {
    switch (process.env.PROVIDER) {
        case "local":
            return new StorageContext(new LocalDiskFileStorageStrategy());
        case "google":
            throw new Error("not implemented");
        default:
            return new StorageContext(new LocalDiskFileStorageStrategy());
    }
}

export const fileDownloadHandler = async (req: Request, res: Response) => {
    const { publicKey } = req.params;
    console.log({ publicKey }, 'file download')

    // todo: retrieve this IPs current limit remaining and create meter based on that
    const meterStream = getSizeTransform(Number(process.env.DOWNLOAD_LIMIT_BYTES || 1e32));

    const storageContext = createStorageContext();
    const stream = await storageContext.getReadStream(publicKey);

    const file = await fileService.getFile(publicKey);

    if (!file || !stream) {
        console.log('file not found')
        return res.sendStatus(404);
    }

    res.on('error', () => {
        console.log('caught')
        res.end();
    })

    meterStream.on('error', () => {
        console.log({ ip: req.ip }, 'download limit exceeded')
        res.send('limit exceeded')
    })

    // todo: update download limit for ip

    await pipeline(stream, meterStream, res).catch((err: any) => {
        console.log(err, 'error downloading file')
    })


};

export const fileUploadHandler = async (req: Request, res: Response) => {
    console.log('file upload')
    const storageContext = createStorageContext();
    const keys = await keyGen.generateKeyPair();


    const bb = busboy({ headers: req.headers });

    let fileInfo: FileInfo | undefined = undefined;

    bb.on("file", (name, file, info) => {
        console.log(name, info)

        fileInfo = {
            fileName: info.filename,
            mimeType: info.mimeType,
            encoding: info.encoding
        };

        file.pipe(storageContext.getWriteStream(keys.publicKey));
    });

    const meterStream = getSizeTransform(Number(process.env.UPLOAD_LIMIT_BYTES || 1e32));

    meterStream.on('error', () => {
        console.log({ ip: req.ip }, 'upload limit exceeded')
        res.send('limit exceeded')
    })

    await finished(req.pipe(meterStream).pipe(bb))

    if (!fileInfo) {
        throw new Error('file never read');
    }

    await fileService.createFile({
        keys,
        info: fileInfo
    })

    res.json(keys);

};

export const fileDeleteHandler = async (req: Request, res: Response) => {
    const { privateKey } = req.params;
    console.log({}, 'file delete')

    const storageContext = createStorageContext();
    const fileName = keyGen.getFileName(privateKey);

    if (!fileName) {
        console.log({}, 'invalid file name')
        return res.sendStatus(400);
    }

    const result = await storageContext.delete(fileName);

    if (!result) {
        console.log({}, 'file not found')
        return res.sendStatus(404);
    }

    res.sendStatus(200);
};

export const fileInactiveFilesHandler = async (req: Request, res: Response) => {
    console.log({}, 'inactive file cleanup handler')

    const storageContext = createStorageContext();

    const deleteCount = await fileService.cleanupInactiveFiles(storageContext.delete.bind(storageContext));

    res.send({ deleteCount });
};
