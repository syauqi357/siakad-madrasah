export default {
  transform: {}, // Disable code transformation (use native ES modules)
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts', '.tsx'], // If you use TS later
};

// "test": "node --experimental-vm-modules node_modules/jest/bin/jest.js",