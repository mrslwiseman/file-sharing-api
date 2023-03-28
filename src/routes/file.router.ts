
import express from 'express';
import { fileDeleteHandler, fileDownloadHandler, fileUploadHandler } from './file.controller';

const fileRouter = express.Router();

fileRouter.post('/', fileUploadHandler)

fileRouter.get('/:publicKey', fileDownloadHandler)

fileRouter.delete('/:privateKey',
    fileDeleteHandler
)

export default fileRouter