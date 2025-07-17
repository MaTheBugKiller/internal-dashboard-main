'use client';
import { useState, useEffect, useCallback } from 'react';
import { useEnvironment } from '../(dashboard)/env-provider';
import { fetchServiceFeedback, fetchAppFeedback, RatingsResponse, fetchFeedbackRatings } from '@/lib/api';
import { ApiResponse, ServiceFeedbackProps, AppFeedback } from 'app/types/common';

interface UseFeedbackOptions {
  search?: string;
  initialService?: ApiResponse<ServiceFeedbackProps>;
  initialApp?: ApiResponse<AppFeedback>;
  itemsPerPage?: number;
}



export function useFeedback({
  search = '',
  initialService,
  initialApp,
  itemsPerPage = 10 
}: UseFeedbackOptions = {}) {
  const { environment } = useEnvironment();
  const [service, setService] = useState<ApiResponse<ServiceFeedbackProps> | null>(initialService || null);
  const [app, setApp] = useState<ApiResponse<AppFeedback> | null>(initialApp || null);
  const [loading, setLoading] = useState<boolean>(!initialService || !initialApp);
  const [error, setError] = useState<Error | null>(null);
  const [totalItems, setTotalItems] = useState<number>(
    (initialService?.pagination?.total || 0) + (initialApp?.pagination?.total || 0)
  );
  const [servicePage, setServicePage] = useState(1);
  const [appPage, setAppPage] = useState(1);
  const [ratings, setRatings] = useState<RatingsResponse | null>(null);


  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [serviceData, appData, ratingData] = await Promise.all([
        fetchServiceFeedback(environment, search, servicePage, itemsPerPage),
        fetchAppFeedback(environment, search, appPage, itemsPerPage),
        fetchFeedbackRatings(environment),
      ]);
      
      setService(serviceData);
      setApp(appData);
      
      const total = (serviceData.pagination?.total || 0) + (appData.pagination?.total || 0);
      setTotalItems(total);
      
     
      if (ratingData && ratingData.data) {
        if (Array.isArray(ratingData.data)) {
          setRatings(ratingData.data[0] || null);
        } else {
          setRatings(ratingData.data);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      console.error('Error fetching feedback:', err);
    } finally {
      setLoading(false);
    }
  }, [environment, search, servicePage, appPage, itemsPerPage]);


  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    service,
    app,
    ratings,
    loading,
    error,
    totalItems,
    servicePage,
    appPage,
    setServicePage,
    setAppPage,
    itemsPerPage,
    refetch: fetchData
  };
}