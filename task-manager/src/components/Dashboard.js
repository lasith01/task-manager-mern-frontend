import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import url from '../API/ApiService';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            const response = await url.get('/tasks');
            setTasks(response.data);
        };

        fetchTasks();
    }, []);

    const handleLogout = () => {
        logout();
    };

    return (
        <div>
            <h2>Welcome, {user.name}</h2>
            <button onClick={handleLogout}>Logout</button>
            <h3>Your Tasks</h3>
            <ul>
                {tasks.map(task => (
                    <li key={task._id}>{task.title}</li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
