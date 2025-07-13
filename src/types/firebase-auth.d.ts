declare module 'firebase/auth' {
  export * from '@firebase/auth';
  export const getReactNativePersistence: any;   // adds the missing type
}
