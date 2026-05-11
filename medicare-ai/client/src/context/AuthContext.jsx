import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios'; // Import api

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for token on load
        try {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');
            if (token && storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Auth hydration failed:", error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        } finally {
            setLoading(false);
        }
    }, []);

    const login = async (email, password, role) => {
        try {
            const res = await api.post('/auth/login', { email, password, role }); // Optional role for demo
            const { token, user } = res.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
            return { success: true };
        } catch (err) {
            console.error("Login failed", err);
            return { success: false, error: err.response?.data?.msg || "Login failed" };
        }
    };

    const updateRole = (newRole) => {
        const updatedUser = { ...user, role: newRole };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, updateRole }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
