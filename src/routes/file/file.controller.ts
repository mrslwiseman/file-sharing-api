import { NextFunction, Request, Response } from 'express'
import fs from 'fs'
import path from 'path';
import busboy from 'busboy'
import StorageContext from '../../storage/storageContext';
import LocalDiskFileStorageStrategy from '../../storage/providers/localFileSystem'
import KeyGen from '../../storage/keygen';

function createStorageContext(storageHeaders: any) {
    switch (process.env.PROVIDER) {
        case 'local':
            return new StorageContext(new LocalDiskFileStorageStrategy())
        case 'google':
            throw new Error('not implemented');
        default:
            return new StorageContext(new LocalDiskFileStorageStrategy())
    }
}

export const fileDownloadHandler = (req: Request, res: Response) => {
    const { publicKey } = req.params;
    const storageContext = createStorageContext(req.headers);
    const stream = storageContext.getReadStream(publicKey);

    if (stream === 'notFound') {
        return res.sendStatus(404);
    }

    stream.pipe(res)

}


export const fileUploadHandler = async (req: Request, res: Response, next: NextFunction) => {
    const storageContext = createStorageContext(req.headers);
    const keys = new KeyGen().generateKeyPair();
    storageContext.getWriteStream(keys.publicKey);

    const bb = busboy({ headers: req.headers });

    bb.on('file', (_name, file, _info) => {
        const saveTo = path.join(`${keys.publicKey}`);
        file.pipe(fs.createWriteStream(saveTo));
    });

    bb.on('close', () => {
        res.json(keys)
    });

    req.pipe(bb);
}

export const fileDeleteHandler = async (req: Request, res: Response) => {
    const { privateKey } = req.params;
    const storageContext = createStorageContext(req.headers);
    const fileName = new KeyGen().getFileName(privateKey);
    const result = await storageContext.delete(fileName)

    if (result === 'notFound') {
        res.sendStatus(404)
        return;
    }

    res.sendStatus(200)

}