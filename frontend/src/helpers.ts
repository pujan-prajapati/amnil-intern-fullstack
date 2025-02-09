export const setLocalStore = (key: string, value: unknown): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getLocalStore = (key: string): unknown | null => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
};
