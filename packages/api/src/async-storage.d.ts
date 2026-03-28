// Type stub so the TypeScript compiler doesn't error on the dynamic import in client.ts.
// The real package is installed only in apps/mobile — that's intentional (optional peer).
declare module '@react-native-async-storage/async-storage' {
  const AsyncStorage: {
    getItem(key: string): Promise<string | null>
    setItem(key: string, value: string): Promise<void>
    removeItem(key: string): Promise<void>
    clear(): Promise<void>
  }
  export default AsyncStorage
}
