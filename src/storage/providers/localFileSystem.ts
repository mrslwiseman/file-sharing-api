import fs from 'fs';
import { StorageStrategy } from "../storageContext";
import path from "node:path";
import { promisify } from 'node:util';

const FOLDER = process.env.FOLDER || process.cwd()

const rmPromise = promisify(fs.rm)

const isErrnoException = (e: unknown): e is NodeJS.ErrnoException =>
    ('code' in (e as any)) ? true : false


class LocalDiskFileStorageStrategy implements StorageStrategy {
    getWriteStream(fileName: string) {
        return fs.createWriteStream(path.join(FOLDER, fileName));
    }

    getReadStream(fileName: string) {
        try {
            fs.statSync(path.join(FOLDER, fileName))
        } catch (err) {
            if (isErrnoException(err) && err.code === 'ENOENT') {
                return 'notFound'
            }
            throw err;
        }
        return fs.createReadStream(path.join(FOLDER, fileName), 'utf8');
    }

    async delete(fileName: string) {
        try {
            await rmPromise(path.join(FOLDER, fileName))
        } catch (err) {
            if (isErrnoException(err) && err.code === 'ENOENT') {
                return 'notFound'
            }
            throw err;
        }
    }

}

export default LocalDiskFileStorageStrategy;