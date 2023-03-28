import { Stream } from "node:stream"
import fs from 'fs';

const FOLDER = process.env.FOLDER || `${process.cwd()}/data/example.txt`

interface StorageProvider {
    getReadStream(file: string): Stream,
    getWriteStream(file: string): void
}

class FileStorage implements StorageProvider {
    getWriteStream(filePath: string): void {
        throw new Error('to implement')
    }

    getReadStream(filePath: string): Stream {
        const stream = fs.createReadStream(filePath);
        return stream;
    }

}

const storageService = new FileStorage();
export default storageService;