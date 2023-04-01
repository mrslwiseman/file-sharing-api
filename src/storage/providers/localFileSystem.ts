import fsPromise from "fs/promises";
import fs from "fs";
import { StorageStrategy } from "../storageContext";
import path from "node:path";

const FOLDER = process.env.FOLDER || `${process.cwd()}/data`;

const isErrnoException = (e: unknown): e is NodeJS.ErrnoException =>
  "code" in (e as any) ? true : false;

class LocalDiskFileStorageStrategy implements StorageStrategy {
  getWriteStream(fileName: string) {
    return fs.createWriteStream(path.join(FOLDER, fileName));
  }

  async getReadStream(fileName: string) {
    try {
      await fsPromise.stat(path.join(FOLDER, fileName));
    } catch (err) {
      if (isErrnoException(err) && err.code === "ENOENT") {
        return;
      }
      throw err;
    }
    return fs.createReadStream(path.join(FOLDER, fileName), "utf8");
  }

  async delete(fileName: string) {
    try {
      await fsPromise.rm(path.join(FOLDER, fileName));
    } catch (err) {
      if (isErrnoException(err) && err.code === "ENOENT") {
        return;
      }
      throw err;
    }
  }
}

export default LocalDiskFileStorageStrategy;
