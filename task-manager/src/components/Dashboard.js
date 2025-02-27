import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import url from '../API/ApiService';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [editTaskTitle, setEditTaskTitle] = useState('');
    const [taskToEdit, setTaskToEdit] = useState(null);

    useEffect(() => {
        const fetchTasks = async () => {
            if (!user) return; 

            try {
                const response = await url.get('/tasks', {
                    headers: {
                        Authorization: `${user.token}`, 
                    }
                });
                setTasks(response.data);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };

        fetchTasks();
    }, [user]);

    const handleLogout = () => {
        logout();
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        try {
            const response = await url.post(
                '/tasks',
                { title: newTaskTitle },
                {
                    headers: {
                        Authorization: `${user.token}`,
                    }
                }
            );
            setTasks([...tasks, response.data]);
            setNewTaskTitle('');
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await url.delete(`/tasks/${taskId}`, {
                headers: {
                    Authorization: `${user.token}`,
                }
            });
            setTasks(tasks.filter(task => task._id !== taskId));
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    const handleEditTask = async (taskId) => {
        try {
            const response = await url.put(
                `/tasks/${taskId}`,
                { title: editTaskTitle },
                {
                    headers: {
                        Authorization: `${user.token}`,
                    }
                }
            );
            setTasks(tasks.map(task => task._id === taskId ? response.data : task));
            setTaskToEdit(null);
            setEditTaskTitle('');
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    return (
        <div>
            {user ? (
                <>
                    <h2>Welcome, {user.name}</h2>
                    <button onClick={handleLogout}>Logout</button>

                    <h3>Your Tasks</h3>
                    
                    <form onSubmit={handleAddTask}>
                        <input 
                            type="text" 
                            placeholder="New Task" 
                            value={newTaskTitle} 
                            onChange={(e) => setNewTaskTitle(e.target.value)} 
                            required 
                        />
                        <button type="submit">Add Task</button>
                    </form>

                    <ul>
                        {tasks.map(task => (
                            <li key={task._id}>
                                {taskToEdit === task._id ? (
                                    <>
                                        <input 
                                            type="text" 
                                            value={editTaskTitle} 
                                            onChange={(e) => setEditTaskTitle(e.target.value)} 
                                            required 
                                        />
                                        <button onClick={() => handleEditTask(task._id)}>Save</button>
                                    </>
                                ) : (
                                    <>
                                        <span>{task.title}</span>
                                        <button onClick={() => { setTaskToEdit(task._id); setEditTaskTitle(task.title); }}>Edit</button>
                                    </>
                                )}
                                <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                </>
            ) : (
                <h2>Loading...</h2>
            )}
        </div>
    );
};

export default Dashboard;
