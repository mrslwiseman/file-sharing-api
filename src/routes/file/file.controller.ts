import { Request, Response } from "express";
import busboy from "busboy";
import StorageContext from "../../storage/storageContext";
import LocalDiskFileStorageStrategy from "../../storage/providers/localFileSystem";
import KeyGen from "../../storage/keygen";
import crypto from 'node:crypto'

const keyGen = new KeyGen(crypto);

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

export const fileDownloadHandler = (req: Request, res: Response) => {
    const { publicKey } = req.params;
    const storageContext = createStorageContext();
    const stream = storageContext.getReadStream(publicKey);

    if (!stream) {
        return res.sendStatus(404);
    }

    stream.pipe(res);
};

export const fileUploadHandler = async (req: Request, res: Response) => {
    const storageContext = createStorageContext();
    const keys = await keyGen.generateKeyPair();

    const bb = busboy({ headers: req.headers });

    bb.on("file", (_name, file, _info) => {
        file.pipe(storageContext.getWriteStream(keys.publicKey));
    });

    bb.on("close", () => {
        res.json(keys);
    });

    req.pipe(bb);
};

export const fileDeleteHandler = async (req: Request, res: Response) => {
    const { privateKey } = req.params;
    const storageContext = createStorageContext();
    const fileName = keyGen.getFileName(privateKey);
    const result = await storageContext.delete(fileName);

    if (!result) {
        return res.sendStatus(404);
    }

    res.sendStatus(200);
};
