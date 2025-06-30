/**
 * Clear browser cache and localStorage
 */
export const clearCache = () => {
  // Clear localStorage
  localStorage.clear();
  
  // Clear sessionStorage
  sessionStorage.clear();
  
  // Force reload page to clear cache
  window.location.reload();
};

/**
 * Clear specific item from localStorage
 */
export const clearItem = (key: string) => {
  localStorage.removeItem(key);
};

/**
 * Get item from localStorage with fallback
 */
export const getItem = (key: string, fallback?: unknown) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

/**
 * Set item to localStorage
 */
export const setItem = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}; 