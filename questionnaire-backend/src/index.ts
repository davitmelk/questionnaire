// import http from 'http';
// import async from 'async';
// import Express, { Application } from 'express';
// import cookieParser from 'cookie-parser';
// import bodyParser from 'body-parser';
// import { environment } from './environments/environment';
// import db from './libs/db';
// import socketServer from './socket';
// import httpError from './middleware/httpError';
// import cors from './middleware/cors';
// import routes from './routes';

// const app: Application = Express();

// app.use(Express.json());
// app.use(Express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
//     extended: true
// }));

// app.use(httpError);
// app.use(cors);

// routes(app);

// const server = http.createServer(app);
// socketServer(server, app);

// async.series([
//     callback => {
//         // db.connection
//         //     .on('open', _ => callback(null))
//         //     .on('error', (error: Error) => callback(error));
//         db.retryconnect()
//     },
//     callback => {
//         server.listen(environment.http.port, environment.http.host)
//                 .on('error', (error: Error) => callback(error))
//                 .on('listening', () => callback(null));
//     }
// ], (error: Error | null | undefined) => {
//     if (error) {
//         throw error;
//     } else {
//         console.info(`Application listening on http://${environment.http.host}:${environment.http.port}`);
//     }
// });


import http from 'http';
import async from 'async';
import Express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { environment } from './environments/environment';
import db from './libs/db';
import socketServer from './socket';
import httpError from './middleware/httpError';
import cors from './middleware/cors';
import routes from './routes';

const app: Application = Express();

app.use(Express.json());
app.use(Express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(httpError);
app.use(cors);

routes(app);

const server = http.createServer(app);
socketServer(server, app);

async.series(
    [
        (callback) => {
            // Call db.retryconnect and pass callback to notify when done
            db.retryconnect(callback);
        },
        (callback) => {
            server
                .listen(environment.http.port, environment.http.host)
                .on('error', (error: Error) => callback(error))
                .on('listening', () => callback(null));
        }
    ],
    (error) => {
        if (error) {
            console.error('Startup error:', error);
            process.exit(1);
        } else {
            console.info(
                `✅ Application listening on http://${environment.http.host}:${environment.http.port}`
            );
        }
    }
);