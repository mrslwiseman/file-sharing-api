import fs from 'fs';
import { StorageStrategy } from "./storageContext";
import path from "node:path";

const FOLDER = process.env.FOLDER || ""

class LocalDiskFileStorageStrategy implements StorageStrategy {
    getWriteStream(fileName: string) {
        const stream = fs.createWriteStream(path.join(FOLDER, fileName));
        return stream;
    }

    getReadStream(fileName: string) {
        const stream = fs.createReadStream(path.join(FOLDER, fileName), 'utf8');
        return stream;
    }

}

export default LocalDiskFileStorageStrategy;