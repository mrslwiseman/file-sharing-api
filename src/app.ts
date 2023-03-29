import express from 'express';
import fileRouter from './routes/file/file.router';

const app = express();

app.use('/files', fileRouter)

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => console.log('listening on port', PORT))

if (process.env.NODE_ENV === 'dev') {
    process.once('SIGUSR2', function () {
        console.log('Shutting down');
        server.close()
    })
}

process.once('SIGINT', function () {
    console.log('Shutting down');
    server.close()
})
