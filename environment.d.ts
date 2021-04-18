declare global {
  namespace NodeJS {
    // This will allow TypeScript to recognize process variables.
    interface ProcessEnv {
      NODE_ENV: 'development' | 'test';
    }
  }
}

export {};
