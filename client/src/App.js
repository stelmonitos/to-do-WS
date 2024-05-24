import io from 'socket.io-client';
import React, { useEffect, useState } from'react';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [socket, setSocket] = useState();
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [editTaskName, setEditTaskName] = useState('');
  
  useEffect(() => {
    const socket = io('ws://localhost:8000', { transports: ['websocket'] });
    setSocket(socket);

    socket.on('addTask', (task) => {
      addTask(task);
    });
    socket.on('removeTask', (id) => {
      removeTask(id);
    });
    socket.on('updateData', (tasks) => {
      updateTasks(tasks);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const removeTask = (id, emitEvent = true) => {
    setTasks(tasks => tasks.filter(task => task.id !== id));
    if (emitEvent) {
      socket.emit('removeTask', id);
    }
  }

  const addTask = (task) => {
    setTasks(tasks => [...tasks, task]);
  }

  const updateTasks = (tasks) => {
    setTasks(tasks);
  }

  const submitForm = (e) => {
    e.preventDefault();
    const taskId = uuidv4();
    addTask({ name: taskName, id: taskId });
    if (socket) { // Check if socket is defined
      socket.emit('addTask', { name: taskName, id: taskId });
    }
    setTaskName('');
  }

  return (
    <div className="App">

      <header>
        ToDoList.app
      </header>

      <section className="task-section" id="task-section">
        <h2>Tasks</h2>
        {/* lista taskow */}
        <ul className="tasks-section__list" id="tasks-list">
          {tasks.map(task => {
            return <li className='task' key={task.id}> 
              {task.name}
              <div>
                <button className="btn btn--red" onClick={() => removeTask(task.id)}>Remove</button>
              </div>
              </li>
          })}
        </ul>
        {/* input do dodawania taskow */}
        <form id="add-task-form" onSubmit={submitForm}>
          <input className="text-input" autoComplete="off" type="text" placeholder="Type your description" id="task-name" value={taskName} onChange={e => setTaskName(e.target.value)}/>
          <button className="btn" type="submit">Add</button>
        </form>

      </section>
    </div>
  );
}

export default App;
