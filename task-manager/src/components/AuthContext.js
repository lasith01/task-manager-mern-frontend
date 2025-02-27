import React, {createContext, useContext, useState, useEffect, Children} from 'react';
import url from '../API/ApiService';

const AuthContext = createContext();

export const useAuth =() =>{
    return useContext(AuthContext);
};

export const AuthProvider = ({children}) => {
    const [user,setUser] =useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token){
            url.get('/auth/me').then((response)=> { 
                setUser(response.data);
            }).catch(()=>{
                localStorage.removeItem('token');
                setUser(null);
            });
        }
    },[]);

    const login = (userData, token) => {
        localStorage.setItem('token',token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return(
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};