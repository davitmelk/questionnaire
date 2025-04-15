import http from 'http';
import { Application } from 'express';
import SocketIO from 'socket.io';
import mongoose from 'mongoose';

import Answer from './models/answer';

interface AnswerID {
    id: string | number | mongoose.Types.ObjectId;
}

const socketServer = (server: http.Server, app: Application): void => {
    const io: SocketIO.Server = SocketIO(server);

    io.on('connection', (socket: SocketIO.Socket) => {
        console.log(`[${socket.id}] Client connection on socket.`);

        socket.on('joinroom', (id: string) => {
            console.log(`[${socket.id}] Client join to room ${id}.`);
            socket.join(id);
        });

        socket.on('leaveroom', (id: string) => {
            console.log(`[${socket.id}] Client leave room ${id}.`);
            socket.leave(id);
        });

        socket.on('updatedataroom', (id: string) => {
            if (mongoose.Types.ObjectId(id)) {
                Answer.find({question_id: id}, (error, answers) => {
                    if (error) {
                        console.log(`Error: ${error.message}`);
                    } else {
                        io.sockets.to(id).emit('updateroom', answers);
                    }
                });
            }
        });
    });

    app.set('socketio', io);
};

export default socketServer;