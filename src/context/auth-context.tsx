import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { initTelegram, getTelegramUser } from '@/lib/telegram';

interface AuthContextType {
  userId: number;
  firstName: string;
  stars: number;
  setStars: (s: number) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  userId: 0,
  firstName: '',
  stars: 0,
  setStars: () => {},
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [stars, setStars] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initTelegram();
    const tgUser = getTelegramUser();

    api
      .auth({
        user_id: tgUser.id,
        first_name: tgUser.first_name,
        username: tgUser.username,
      })
      .then((data) => {
        setUserId(data.user_id);
        setFirstName(data.first_name);
        setStars(data.stars);
      })
      .catch(() => {
        setUserId(tgUser.id);
        setFirstName(tgUser.first_name);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ userId, firstName, stars, setStars, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
