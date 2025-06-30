import React, { createContext, useContext, useState, useEffect, Dispatch, SetStateAction } from 'react';
import { loginUser, registerUser, User as ApiUser } from '../api';

interface AuthContextType {
  user: ApiUser | null;
  setUser: Dispatch<SetStateAction<ApiUser | null>>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  register: (email: string, name: string, department: string, password: string) => Promise<{success: boolean, message: string}>;
  registrationEnabled: boolean;
  setRegistrationEnabled: (enabled: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [registrationEnabled, setRegistrationEnabled] = useState<boolean>(() => {
    const stored = localStorage.getItem('registrationEnabled');
    return stored === null ? true : stored === 'true';
  });

  useEffect(() => {
    // Check for stored user
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const result = await loginUser(email, password);
      // Backend mengembalikan user di field 'user'
      const loggedInUser = result.user;
      setUser(loggedInUser);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (email: string, name: string, department: string, password: string): Promise<{success: boolean, message: string}> => {
    setIsLoading(true);
    try {
      const result = await registerUser(email, name, department, password);
      setIsLoading(false);
      return { success: true, message: result.message };
    } catch (err) {
      setIsLoading(false);
      if (err instanceof Error) {
        return { success: false, message: err.message };
      }
      return { success: false, message: 'An unknown error occurred' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const setRegistration = (enabled: boolean) => {
    setRegistrationEnabled(enabled);
    localStorage.setItem('registrationEnabled', String(enabled));
  };

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      login,
      logout,
      isLoading,
      register,
      registrationEnabled,
      setRegistrationEnabled: setRegistration
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};