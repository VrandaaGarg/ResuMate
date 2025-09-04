import { useState, useCallback } from 'react';

export const useLoading = (initialState = false) => {
  const [loading, setLoading] = useState(initialState);
  const [error, setError] = useState(null);

  const startLoading = useCallback(() => {
    setLoading(true);
    setError(null);
  }, []);

  const stopLoading = useCallback(() => {
    setLoading(false);
  }, []);

  const setLoadingError = useCallback((errorMessage) => {
    setLoading(false);
    setError(errorMessage);
  }, []);

  const executeWithLoading = useCallback(async (asyncFunction) => {
    try {
      startLoading();
      const result = await asyncFunction();
      stopLoading();
      return result;
    } catch (err) {
      setLoadingError(err.message || 'An error occurred');
      throw err;
    }
  }, [startLoading, stopLoading, setLoadingError]);

  return {
    loading,
    error,
    startLoading,
    stopLoading,
    setLoadingError,
    executeWithLoading,
  };
};