import express from 'express';
import fileRouter from './routes/file.router';

const server = express();

server.use('/files', fileRouter)

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => console.log('listening on port', PORT))