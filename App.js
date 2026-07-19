import { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import ShopHomeScreen from './src/app/shop-home';
import HomeInfoScreen from './src/screens/HomeInfoScreen';

const App = () => {
  const [screen, setScreen] = useState('home'); // 'home' | 'shop'

  return (
    <SafeAreaProvider>
      {screen === 'home' ? (
        <HomeInfoScreen onEnterShop={() => setScreen('shop')} />
      ) : (
        <ShopHomeScreen onGoHome={() => setScreen('home')} />
      )}
    </SafeAreaProvider>
  );
};

export default App;
