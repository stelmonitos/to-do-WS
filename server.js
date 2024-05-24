const express = require('express');
const socket = require('socket.io')

const app = express();
const server = app.listen(process.env.PORT || 8000, () => {
    console.log('Server is running...');
});

const io = socket(server)

io.on('connection', (socket) => {
    console.log('New client! Its id –'+ socket.id);
    socket.emit('updateData', tasks);

    socket.on('addTask', (task) => {
        tasks.push({ id: task.id, name: task.name });
        socket.broadcast.emit('addTask', task);
    });
    socket.on('removeTask', (id) => {
        const taskIndex = tasks.findIndex(task => task.id === id)
        if(taskIndex !== -1){
            console.log('im working B) on ' + id);
            tasks.splice(taskIndex, 1);
            socket.broadcast.emit('removeTask', id);
        }
    });
});

const tasks = [];

app.use((req, res) => {
    res.status(404).send({ message: 'Not found...' });
  });