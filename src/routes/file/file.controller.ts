import fileStorage from '../../storage/localDiskFileStorageStrategy';
import { NextFunction, Request, Response } from 'express'
import fs from 'fs'
import os from 'node:os'
import path from 'path';
import busboy from 'busboy'
import StorageContext from '../../storage/storageContext';
import LocalDiskFileStorageStrategy from '../../storage/localDiskFileStorageStrategy';
import { IncomingHttpHeaders } from 'node:http';
import KeyGen from '../../storage/keygen';

function createStorageContext(storageHeaders: any) {
    switch (storageHeaders['x-storage-type']) {
        case 'localFs':
            console.log('localRs');
            return new StorageContext(new LocalDiskFileStorageStrategy())
        case 'gcp':
            throw new Error('not implemented');
        case 's3':
            throw new Error('not implemented');
        default:
            return new StorageContext(new LocalDiskFileStorageStrategy())
    }
}

export const fileDownloadHandler = (req: Request, res: Response) => {
    // todo: fix mime type stuff, extension, filename
    const { publicKey } = req.params;
    // const file = `${process.cwd()}/data/example.txt`;

    // // const stream = fileStorage.getReadStream(file)
    // stream.pipe(res);
    const storageContext = createStorageContext(req.headers);
    // res.set('Content-Disposition', `attachment; filename=${publicKey}`);
    const stream = storageContext.getReadStream(publicKey);

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

export const fileDeleteHandler = (req: Request, res: Response) => {
    throw new Error('to implement')
}