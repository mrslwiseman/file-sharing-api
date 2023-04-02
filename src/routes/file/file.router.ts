import express from "express";
import {
  fileDeleteHandler,
  fileDownloadHandler,
  fileInactiveFilesHandler,
  fileUploadHandler,
} from "./file.controller";

const fileRouter = express.Router();

fileRouter.post("/", fileUploadHandler);

fileRouter.post("/cleanup", fileInactiveFilesHandler);

fileRouter.get("/:publicKey", fileDownloadHandler);

fileRouter.delete("/:privateKey", fileDeleteHandler);


export default fileRouter;
