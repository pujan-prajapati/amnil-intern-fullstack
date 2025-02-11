// utils/auth.ts

export const isTokenExpired = (token: string): boolean => {
  try {
    const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode the token payload
    return decodedToken.exp * 1000 < Date.now(); // Check if expired
  } catch (error) {
    console.error("Failed to decode token:", error);
    return true; // Assume token is invalid if decoding fails
  }
};
