import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  adminEmail: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = () => {
      const authStatus = localStorage.getItem('admin_authenticated');
      const email = localStorage.getItem('admin_email');
      const loginTime = localStorage.getItem('admin_login_time');

      if (authStatus === 'true' && email && loginTime) {
        // Check if login is not older than 24 hours
        const loginDate = new Date(loginTime);
        const now = new Date();
        const hoursDiff = (now.getTime() - loginDate.getTime()) / (1000 * 60 * 60);

        if (hoursDiff < 24) {
          setIsAuthenticated(true);
          setAdminEmail(email);
        } else {
          // Session expired
          localStorage.removeItem('admin_authenticated');
          localStorage.removeItem('admin_email');
          localStorage.removeItem('admin_login_time');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Frontend-only authentication
    if (email === 'admin@eloska.com' && password === 'admin123') {
      localStorage.setItem('admin_authenticated', 'true');
      localStorage.setItem('admin_email', email);
      localStorage.setItem('admin_login_time', new Date().toISOString());
      
      setIsAuthenticated(true);
      setAdminEmail(email);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_email');
    localStorage.removeItem('admin_login_time');
    setIsAuthenticated(false);
    setAdminEmail(null);
  };

  const value = {
    isAuthenticated,
    adminEmail,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
