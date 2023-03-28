import fileStorage from '../service/storage.service';
import { Request, Response } from 'express'

export const fileDownloadHandler = (req: Request, res: Response) => {
    // todo: fix mime type stuff, extension, filename
    const file = `${process.cwd()}/data/example.txt`;

    const stream = fileStorage.getReadStream(file)
    res.set('Content-Disposition', `attachment; filename=${file}`);
    stream.pipe(res);

}

export const fileUploadHandler = (req: Request, res: Response) => {
    throw new Error('to implement')
}

export const fileDeleteHandler = (req: Request, res: Response) => {
    throw new Error('to implement')
}