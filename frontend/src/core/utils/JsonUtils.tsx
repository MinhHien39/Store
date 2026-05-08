class JsonUtils {
    // Parse JSON with error handling
    static parse<T>(value: string | null): T | null {
      try {
        return value ? JSON.parse(value) : null;
      } catch (error) {
        console.error('Failed to parse JSON:', error);
        return null;
      }
    }
  
    // Stringify JSON with error handling
    static stringify<T>(value: T): string | null {
      try {
        return JSON.stringify(value);
      } catch (error) {
        console.error('Failed to stringify JSON:', error);
        return null;
      }
    }
  }
  
  export default JsonUtils;
  