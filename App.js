import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import ShopHomeScreen from './src/app/shop-home';
import HomeInfoScreen from './src/screens/HomeInfoScreen';
import AuthScreen from './src/screens/AuthScreen';

const AUTH_STORAGE_KEY = 'shop_auth_v1';

const App = () => {
  const [screen, setScreen] = useState('home'); // 'home' | 'shop'
  const [auth, setAuth] = useState(null);
  const [isRestoringAuth, setIsRestoringAuth] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(AUTH_STORAGE_KEY)
      .then((saved) => saved && setAuth(JSON.parse(saved)))
      .catch(() => {})
      .finally(() => setIsRestoringAuth(false));
  }, []);

  const handleAuthenticated = async (nextAuth) => {
    setAuth(nextAuth);
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextAuth));
  };

  const handleLogout = async () => {
    setAuth(null);
    setScreen('home');
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <SafeAreaProvider>
      {isRestoringAuth ? null : !auth ? (
        <AuthScreen onAuthenticated={handleAuthenticated} />
      ) : screen === 'home' ? (
        <HomeInfoScreen onEnterShop={() => setScreen('shop')} />
      ) : (
        <ShopHomeScreen auth={auth} onGoHome={() => setScreen('home')} onLogout={handleLogout} />
      )}
    </SafeAreaProvider>
  );
};

export default App;
