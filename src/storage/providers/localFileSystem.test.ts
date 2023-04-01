import fs from "fs";
import fsPromise from 'fs/promises'
import path from "path";
import sinon from "sinon";
import LocalDiskFileStorageStrategy from './localFileSystem'

describe("LocalDiskFileStorageStrategy", () => {
    let strategy: LocalDiskFileStorageStrategy;
    let fsCreateWriteStreamStub: any;
    let fsCreateReadStreamStub: any;
    let fsPromiseStatStub: any;
    let fsPromiseRmStub: any;

    const fileName = "example.txt";

    beforeAll(() => {
        strategy = new LocalDiskFileStorageStrategy();
        fsCreateWriteStreamStub = sinon.stub(fs, "createWriteStream");
        fsCreateReadStreamStub = sinon.stub(fs, "createReadStream");
        fsPromiseStatStub = sinon.stub(fsPromise, "stat");
        fsPromiseRmStub = sinon.stub(fsPromise, "rm");
    });

    afterAll(() => {
        fsCreateWriteStreamStub.restore();
        fsCreateReadStreamStub.restore();
        fsPromiseStatStub.restore();
        fsPromiseRmStub.restore();
    });

    afterEach(() => {
        sinon.reset();
    });

    describe("getWriteStream", () => {
        it("should call fs.createWriteStream with correct path", () => {
            strategy.getWriteStream(fileName);
            sinon.assert.calledOnceWithExactly(
                fsCreateWriteStreamStub,
                path.join(fileName)
            );
        });
    });

    describe("getReadStream", () => {
        it("should call fs.createReadStream with correct path", async () => {
            await strategy.getReadStream(fileName);
            sinon.assert.calledOnceWithExactly(
                fsCreateReadStreamStub,
                fileName,
                "utf8"
            );
        });

        it("should return undefined if file does not exist", async () => {
            fsPromiseStatStub.rejects({ code: "ENOENT" });
            const result = await strategy.getReadStream(fileName);
            expect(result).toBeUndefined();
        });

        it("should throw error if there's an error accessing the file", async () => {
            fsPromiseStatStub.rejects(new Error("Unexpected error"));
            await expect(strategy.getReadStream(fileName)).rejects.toThrow(
                "Unexpected error"
            );
        });
    });

    describe("delete", () => {
        it("should call fsPromise.rm with correct path", async () => {
            await strategy.delete(fileName);
            sinon.assert.calledOnceWithExactly(
                fsPromiseRmStub,
                path.join(fileName)
            );
        });

        it("should return undefined if file does not exist", async () => {
            fsPromiseRmStub.rejects({ code: "ENOENT" });
            const result = await strategy.delete(fileName);
            expect(result).toBeUndefined();
        });

        it("should throw error if there's an error deleting the file", async () => {
            fsPromiseRmStub.rejects(new Error("Unexpected error"));
            await expect(strategy.delete(fileName)).rejects.toThrow(
                "Unexpected error"
            );
        });
    });
});