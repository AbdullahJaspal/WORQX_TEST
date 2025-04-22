import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  checkConnection,
  setShowNetworkError,
} from '../redux/features/networkSlice';
import NetworkManager from '../services/NetworkManager';

interface NetworkContextType {
  isRetrying: boolean;
  checkConnection: () => Promise<void>;
}

const NetworkContext = createContext<NetworkContextType | null>(null);

export const useNetwork = () => useContext(NetworkContext);

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isRetrying, setIsRetrying] = useState<boolean>(false);
  const dispatch = useDispatch();
  const networkManager = NetworkManager.getInstance();

  const handleConnectionChange = (isConnected: boolean) => {
    dispatch(checkConnection(isConnected));
    dispatch(setShowNetworkError(!isConnected));
  };

  const checkNetworkConnection = async () => {
    setIsRetrying(true);
    try {
      const isConnected = await networkManager.checkConnection();
      dispatch(checkConnection(isConnected));
      dispatch(setShowNetworkError(!isConnected));
    } finally {
      setIsRetrying(false);
    }
  };

  useEffect(() => {
    const unsubscribe = networkManager.addListener(handleConnectionChange);
    const initialState = networkManager.getCurrentStatus();
    dispatch(checkConnection(initialState));
    dispatch(setShowNetworkError(!initialState));

    return () => {
      unsubscribe();
    };
  }, [dispatch, handleConnectionChange, networkManager]);

  return (
    <NetworkContext.Provider
      value={{
        isRetrying,
        checkConnection: checkNetworkConnection,
      }}>
      {children}
    </NetworkContext.Provider>
  );
};
