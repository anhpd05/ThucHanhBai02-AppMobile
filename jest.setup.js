jest.mock('@react-native-community/geolocation', () => ({
  getCurrentPosition: jest.fn(),
  setRNConfiguration: jest.fn(),
  requestAuthorization: jest.fn(),
}));
jest.mock('react-native-safe-area-context', () => require('react-native-safe-area-context/jest/mock'));
