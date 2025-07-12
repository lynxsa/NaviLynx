import { useState, useCallback } from 'react';
import { router } from 'expo-router';

export interface NavigationHistoryItem {
  route: string;
  params?: Record<string, any>;
  timestamp: number;
  title?: string;
}

export interface Breadcrumb {
  title: string;
  route: string;
  params?: Record<string, any>;
}

export function useNavigationState() {
  const [history, setHistory] = useState<NavigationHistoryItem[]>([]);
  const [currentRoute, setCurrentRoute] = useState<string>('/');
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
  const [canGoBack, setCanGoBack] = useState(false);

  const pushToHistory = useCallback((route: string, params?: Record<string, any>, title?: string) => {
    const historyItem: NavigationHistoryItem = {
      route,
      params,
      timestamp: Date.now(),
      title,
    };
    
    setHistory(prev => {
      const newHistory = [...prev, historyItem];
      // Keep only last 50 items
      return newHistory.slice(-50);
    });
    
    setCurrentRoute(route);
    setCanGoBack(true);
  }, []);

  const navigateTo = useCallback((route: string, params?: Record<string, any>, title?: string) => {
    try {
      router.push({ pathname: route as any, params });
      pushToHistory(route, params, title);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  }, [pushToHistory]);

  const navigateReplace = useCallback((route: string, params?: Record<string, any>, title?: string) => {
    try {
      router.replace({ pathname: route as any, params });
      setCurrentRoute(route);
      
      // Update last history item instead of adding new one
      setHistory(prev => {
        const newHistory = [...prev];
        if (newHistory.length > 0) {
          newHistory[newHistory.length - 1] = {
            route,
            params,
            timestamp: Date.now(),
            title,
          };
        } else {
          newHistory.push({
            route,
            params,
            timestamp: Date.now(),
            title,
          });
        }
        return newHistory;
      });
    } catch (error) {
      console.error('Navigation replace error:', error);
    }
  }, []);

  const goBack = useCallback(() => {
    try {
      if (history.length > 1) {
        router.back();
        setHistory(prev => prev.slice(0, -1));
        
        const previousRoute = history[history.length - 2];
        if (previousRoute) {
          setCurrentRoute(previousRoute.route);
        }
        
        setCanGoBack(history.length > 2);
      } else {
        // If no history, go to home
        navigateTo('/', undefined, 'Home');
      }
    } catch (error) {
      console.error('Go back error:', error);
      navigateTo('/', undefined, 'Home');
    }
  }, [history, navigateTo]);

  const goToHome = useCallback(() => {
    navigateTo('/', undefined, 'Home');
  }, [navigateTo]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    setCanGoBack(false);
  }, []);

  const updateBreadcrumbs = useCallback((crumbs: Breadcrumb[]) => {
    setBreadcrumbs(crumbs);
  }, []);

  const addBreadcrumb = useCallback((crumb: Breadcrumb) => {
    setBreadcrumbs(prev => [...prev, crumb]);
  }, []);

  const popBreadcrumb = useCallback(() => {
    setBreadcrumbs(prev => prev.slice(0, -1));
  }, []);

  const navigateToVenue = useCallback((venueId: string, venueName?: string) => {
    const breadcrumbPath: Breadcrumb[] = [
      { title: 'Home', route: '/' },
      { title: 'Explore', route: '/explore' },
      { title: venueName || `Venue ${venueId}`, route: `/venue/${venueId}`, params: { id: venueId } },
    ];
    
    updateBreadcrumbs(breadcrumbPath);
    navigateTo(`/venue/${venueId}`, { id: venueId }, venueName);
  }, [navigateTo, updateBreadcrumbs]);

  const navigateToCategory = useCallback((category: string, categoryName?: string) => {
    const breadcrumbPath: Breadcrumb[] = [
      { title: 'Home', route: '/' },
      { title: 'Explore', route: '/explore' },
      { title: categoryName || category, route: '/explore', params: { category } },
    ];
    
    updateBreadcrumbs(breadcrumbPath);
    navigateTo('/explore', { category }, `${categoryName || category} - Explore`);
  }, [navigateTo, updateBreadcrumbs]);

  const navigateToAR = useCallback((venueId?: string) => {
    const breadcrumbPath: Breadcrumb[] = [
      { title: 'Home', route: '/' },
      { title: 'AR Navigator', route: '/ar-navigator' },
    ];
    
    if (venueId) {
      breadcrumbPath.splice(1, 0, { title: 'Venue', route: `/venue/${venueId}` });
    }
    
    updateBreadcrumbs(breadcrumbPath);
    navigateTo('/ar-navigator', venueId ? { venueId } : undefined, 'AR Navigator');
  }, [navigateTo, updateBreadcrumbs]);

  const navigateToProfile = useCallback(() => {
    const breadcrumbPath: Breadcrumb[] = [
      { title: 'Home', route: '/' },
      { title: 'Profile', route: '/profile' },
    ];
    
    updateBreadcrumbs(breadcrumbPath);
    navigateTo('/profile', undefined, 'Profile');
  }, [navigateTo, updateBreadcrumbs]);

  // Get the last visited venue
  const getLastVisitedVenue = useCallback((): NavigationHistoryItem | null => {
    const venueRoutes = history.filter(item => item.route.startsWith('/venue/'));
    return venueRoutes.length > 0 ? venueRoutes[venueRoutes.length - 1] : null;
  }, [history]);

  // Get frequently visited routes
  const getFrequentRoutes = useCallback((): { route: string; count: number; title?: string }[] => {
    const routeCounts = history.reduce((acc, item) => {
      acc[item.route] = (acc[item.route] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(routeCounts)
      .map(([route, count]) => ({
        route,
        count,
        title: history.find(item => item.route === route)?.title,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [history]);

  return {
    history,
    currentRoute,
    breadcrumbs,
    canGoBack,
    navigateTo,
    navigateReplace,
    goBack,
    goToHome,
    clearHistory,
    updateBreadcrumbs,
    addBreadcrumb,
    popBreadcrumb,
    navigateToVenue,
    navigateToCategory,
    navigateToAR,
    navigateToProfile,
    getLastVisitedVenue,
    getFrequentRoutes,
  };
}
