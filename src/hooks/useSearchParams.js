import { useState, useEffect, useCallback } from 'react';

export const useSearchParams = () => {
  const [searchParams, setSearchParams] = useState(new URLSearchParams(window.location.search));
  
  // Update URL when searchParams changes
  useEffect(() => {
    const newUrl = searchParams.toString() 
      ? `${window.location.pathname}?${searchParams.toString()}`
      : window.location.pathname;
    
    window.history.pushState({}, '', newUrl);
  }, [searchParams]);
  
  // Listen for popstate event (when browser back/forward buttons are clicked)
  useEffect(() => {
    const handlePopState = () => {
      setSearchParams(new URLSearchParams(window.location.search));
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);
  
  const setSearchParam = useCallback((name, value) => {
    setSearchParams(prevParams => {
      const newParams = new URLSearchParams(prevParams.toString());
      newParams.set(name, value);
      return newParams;
    });
  }, []);
  
  const removeSearchParam = useCallback((name) => {
    setSearchParams(prevParams => {
      const newParams = new URLSearchParams(prevParams.toString());
      newParams.delete(name);
      return newParams;
    });
  }, []);
  
  const getSearchParam = useCallback((name) => {
    return searchParams.get(name);
  }, [searchParams]);
  
  return {
    searchParams,
    setSearchParam,
    removeSearchParam,
    getSearchParam
  };
};