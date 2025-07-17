"use client"

import { ApiResponse, ServiceFeedbackProps, AppFeedback } from 'app/types/common';

// Define a type for environment keys
type EnvironmentKey = 'dev' | 'uat' | 'prod';

export interface RatingsResponse {
  serviceFeedback: {
    averageRating: number;
    total1s: number;
    total2s: number;
    total3s: number;
    total4s: number;
    total5s: number;
    totalCount: number;
  };
  appFeedback: {
    averageRating: number;
    total1s: number;
    total2s: number;
    total3s: number;
    total4s: number;
    total5s: number;
    totalCount: number;
  };
}

 
const API_ENDPOINTS: Record<EnvironmentKey, string> = {
  dev: process.env.NEXT_PUBLIC_API_DEV_ENDPOINT!, 
  uat: process.env.NEXT_PUBLIC_API_UAT_ENDPOINT!,  
  prod: process.env.NEXT_PUBLIC_API_PROD_ENDPOINT!,
};


export async function fetchServiceFeedback(
  environment: EnvironmentKey,
  search: string = '',
  page: number = 1,
  limit: number = 10
): Promise<ApiResponse<ServiceFeedbackProps>> {
  try {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    

    const baseUrl = API_ENDPOINTS[environment];
    const queryString = `?${params.toString()}`;
    

    const response = await fetch(
      `${baseUrl}/api/v1/feedback/dashboard/service${queryString}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      throw new Error(`Service feedback API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching service feedback:', error);
    // Return empty data structure on error
    return {
      data: [],
      pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
    };
  }
}

// Function to fetch app feedback
export async function fetchAppFeedback(
  environment: EnvironmentKey,
  search: string = '',
  page: number = 1,
  limit: number = 10
): Promise<ApiResponse<AppFeedback>> {
  try {
    const params = new URLSearchParams();
    
    if (search) params.append('search', search);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const baseUrl = API_ENDPOINTS[environment];
    const queryString = `?${params.toString()}`;
    
    
    const response = await fetch(
      `${baseUrl}/api/v1/feedback/dashboard/app${queryString}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      throw new Error(`App feedback API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching app feedback:', error);
    // Return empty data structure on error
    return {
      data: [],
      pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
    };
  }
}

export async function fetchFeedbackRatings(
  environment: EnvironmentKey
): Promise<ApiResponse<RatingsResponse>> {
  try {
    const baseUrl = API_ENDPOINTS[environment];
    const res = await fetch(`${baseUrl}/api/v1/feedback/dashboard/overall-feedback-ratings`, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`Ratings API request failed with status ${res.status}`);
    }

    const result = await res.json();
    console.log("Ratings API result:", result);
    return result; 
  } catch (error) {
    console.error('Error fetching feedback ratings:', error);
    return { data: [] };
  }
}