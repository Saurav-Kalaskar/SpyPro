import {Server as HTTPServer} from 'http';
import {Server as IOServer} from 'socket.io';

let io:IOServer;

export const initSocket = (server: HTTPServer) => {
    if(!io){
        io = new IOServer(server, {
            cors:{
                origin: '*',
            },
        });

        io.on('connection', (socket) => {
            console.log('New client connected:', socket.id);

            socket.on('location-update', (data) => {
                io.emit('location-update', data);
            });

            socket.on('disconnect', () => {
                console.log('Client diconnected:', socket.id);
            });
        });
    }
    return io;
}

