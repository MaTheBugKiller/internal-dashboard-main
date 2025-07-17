import { Breakpoint } from "antd";
import {  ReactNode } from "react";

export enum Environment {
  Dev = 'dev',
  Uat = 'uat',
  Prod = 'prod'
}


export type MerchantType = 'toyota' | 'lexus' | null;
export type PlatformType = 'ios' | 'android' | null;
export type FeedbackType = 'service' | 'app';

 
export interface BaseFeedback  {
  id: string;
  userId: string;
  rating: number;
  feedbackText: string | null;
  createdAt: string;
  updatedAt: string;
  merchant: MerchantType;
  platform: PlatformType;
  firstName: string | null;
  lastName: string | null;
  appVersion: string | null;
}

 
export interface ServiceFeedbackProps extends BaseFeedback {
  sfAppointmentId: string;
  vbeln: string | null;
  sfServiceTerritoryId: string | null;
  modelName?: string | null;
  modelYear?: string | null;
  serviceCenterName?: string | null;
}

export type ServiceFeedback = BaseFeedback & ServiceFeedbackProps;

export type AppFeedback = BaseFeedback;
 
export type CombinedFeedback = 
  | (ServiceFeedback & { type: 'service' })
  | (AppFeedback & { type: 'app' });
 
// API Response interfaces
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T[];
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface FeedbackColumnType {
  title: string;
  dataIndex: string;
  key: string;
  width?: string | number;
  responsive?: Breakpoint[];
  ellipsis?: boolean;
  fixed?: 'left' | 'right'; 
  render?: (text: number | string, record: BaseFeedback) => ReactNode;
}


export type CommonColumnType = FeedbackColumnType;
export type ServiceColumnType = FeedbackColumnType;
export type AppColumnType = FeedbackColumnType;