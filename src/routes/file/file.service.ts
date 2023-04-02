import { CreateFile } from "./file.types";

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const isErrMetaException = (e: unknown): e is any =>
    "meta" in (e as any) ? true : false;

class FileService {

    async createFile(data: CreateFile) {
        console.log('create file', data);
        const file = await prisma.file.create({
            data: {
                filename: data.info.fileName,
                mime_type: data.info.mimeType,
                public_key: data.keys.publicKey,
                private_key: data.keys.privateKey,

            },
        });
        return file;
    }

    async getFile(fileName: string) {
        console.log('get file', fileName);
        try {

            const file = await prisma.file.update({
                data: {
                    last_accessed: new Date(),
                },
                where: {
                    public_key: fileName,
                },

            });
            return file;
        } catch (err: unknown) {
            if (isErrMetaException(err) && err.meta.cause === 'Record to update not found.') {
                return;
            }
            throw err;
        }
    }

    async cleanupInactiveFiles(_deleteMethod: (file: string) => Promise<string | void>) {
        // get list of files where last_accessed is < INACTIVE_FILE_THRESHOLD_DAYS

        const files = await prisma.file.findMany({
            where: {
                last_accessed: {
                    lte: new Date(Date.now() - Number(process.env.INACTIVE_FILE_THRESHOLD_DAYS || 365) * 1000 * 60 * 60 * 24),
                }
            },
            select: {
                id: true,
                last_accessed: true,
                public_key: true,
            }
        })

        if (!files.length) {
            console.log('no files found')
        }

        for (const file of files) {
            console.log({ file }, 'deleting file')
            // todo: make this a batch operation that the strategy must provide
            await _deleteMethod(file.public_key);
            await prisma.file.delete({
                where: {
                    id: file.id
                }
            })


        }

        return files.length;
    }
}

export default FileService;