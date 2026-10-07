import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WeatherProvider } from './src/context/WeatherContext';
import { HomeScreen } from './src/screens/HomeScreen';
import { DetailScreen } from './src/screens/DetailScreen';
import { useReducedMotion } from './src/components/common/useReducedMotion';
import { colors } from './src/theme/tokens';
import type { RootStackParamList } from './src/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();
const navigationTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, primary: colors.accent, background: colors.bg, card: colors.surface, text: colors.text, border: colors.border, notification: colors.danger },
};
function App() {
  const reducedMotion = useReducedMotion();
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <WeatherProvider>
        <NavigationContainer theme={navigationTheme}>
          <Stack.Navigator screenOptions={{ headerShown: false, animation: reducedMotion ? 'fade' : 'slide_from_right' }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Detail" component={DetailScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </WeatherProvider>
    </SafeAreaProvider>
  );
}
export default App;
