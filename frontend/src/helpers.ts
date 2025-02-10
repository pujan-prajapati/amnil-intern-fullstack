export const setLocalStore = (key: string, value: unknown): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getLocalStore = (key: string): unknown | null => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
};

export const getRefreshToken = () => {
  const cookies = document.cookie.split("; ");
  const refreshTokenCookie = cookies.find((cookie) =>
    cookie.startsWith("refreshToken=")
  );
  return refreshTokenCookie ? refreshTokenCookie.split("=")[1] : null;
};
