import React, { createContext, useContext, useState, type ReactNode } from 'react';

import type { User } from '../types/models';
import { mockService } from '../services/mockService';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string) => Promise<void>;
    logout: () => void;
    updateProfile: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    const login = async (email: string) => {
        try {
            const userProfile = await mockService.getUserProfile(email);
            setUser(userProfile);
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    const logout = () => {
        setUser(null);
    };

    const updateProfile = (updatedUser: User) => {
        setUser(updatedUser);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
