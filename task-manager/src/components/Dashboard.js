import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import url from '../API/ApiService';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [tasks, setTasks] = useState([]);

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

    return (
        <div>
            {user ? (
                <>
                    <h2>Welcome, {user.name}</h2>
                    <button onClick={handleLogout}>Logout</button>
                    <h3>Your Tasks</h3>
                    <ul>
                        {tasks.map(task => (
                            <li key={task._id}>{task.title}</li>
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
