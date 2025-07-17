'use client';
import React, { useEffect, useState} from 'react';
import { Table, Card, Tabs, Breakpoint, Skeleton } from 'antd';
import { useFeedback } from '../hooks/useFeedback';
import { FeedbackRatings } from './overall-rating';
import { StarRating } from '@/components/ui/star-rating';
import { formatDistanceToNow } from 'date-fns';
import { useTableVisibleRows } from 'app/hooks/useTableVisisbleRows';
import { AppColumnType, BaseFeedback, CommonColumnType, FeedbackType, ServiceColumnType } from 'app/types/common';
import { CustomPagination } from './pagination';
import { useEnvironment } from './env-provider'; 

const { TabPane } = Tabs;

export function FeedbacksTable() {
  const [activeTab, setActiveTab] = useState<FeedbackType>("service");
  const [subPageIndex, setSubPageIndex] = useState(0);
  const { tableRef, visibleRows, shouldSliceData } = useTableVisibleRows(10);
  const [tableScroll, setTableScroll] = useState<{ x?: number | string }>();
  const { environment } = useEnvironment();

  const { 
    service, 
    app, 
    ratings,
    loading, 
    error, 
    servicePage, 
    appPage, 
    setServicePage, 
    setAppPage, 
    refetch
  } = useFeedback();

   
  useEffect(() => {
    setSubPageIndex(0);
  }, [activeTab, servicePage, appPage]);

  useEffect(() => {
    setServicePage(1);
    setAppPage(1);
    setSubPageIndex(0);
  }, [environment, setServicePage, setAppPage]);

  useEffect(() => {
    const updateScrollSettings = () => {
      if (window.innerWidth >= 568 && window.innerWidth < 1200) {
        setTableScroll({ x: 1000 });
      } else if (window.innerWidth < 768) {
        setTableScroll(undefined);
      } else {
        setTableScroll({ x: undefined });
      }
    };
  
    updateScrollSettings();
  

    window.addEventListener('resize', updateScrollSettings);
  
    return () => window.removeEventListener('resize', updateScrollSettings);
  }, []);

 

  if (error) {
    return <div className="text-red-500">Error loading feedback: {error.message}</div>;
  }

  const handleTabChange = (key: string) => {
    setActiveTab(key as "service" | "app");
  };

  const currentPagination = activeTab === "service" ? service?.pagination : app?.pagination;


  const currentFullData = activeTab === "service" ? service?.data : app?.data;
  let displayedData = currentFullData || [];

if (shouldSliceData && displayedData.length > 0) {
  const startIndex = subPageIndex * visibleRows;
  const endIndex = startIndex + visibleRows;
  displayedData = displayedData.slice(startIndex, endIndex);
}

const totalItems = (currentFullData || []).length;
const totalSubPages = shouldSliceData ? Math.ceil(totalItems / visibleRows) : 1;

const commonColumns: CommonColumnType[] = [
  {
    title: 'Name',
    dataIndex: 'userId',
    key: 'userId',
    responsive: ['sm' as Breakpoint],
    width: '15%',
    ellipsis: true,
    render: (userId, record: BaseFeedback) => {
      if (record.firstName && record.lastName) {
        return `${record.firstName} ${record.lastName}`;
      } else if (record.firstName) {
        return record.firstName;
      } else if (record.lastName) {
        return record.lastName;
      } else {
        return '-';
      }
    }
  },
  {
    title: 'Rating',
    dataIndex: 'rating',
    key: 'rating',
    width: '12%',
    render: (rating) => {
      return <StarRating rating={Number(rating)} />;
    }
  },
  {
    title: 'App Version',
    dataIndex: 'appVersion',
    key: 'appVersion',
    width: '10%',
    render: (text) => 
      text ? text : "-",
  },
  {
    title: 'Platform',
    dataIndex: 'platform',
    key: 'platform',
    width: '10%',
    render: (text) => 
      typeof text === 'string' 
        ? text.charAt(0).toUpperCase() + text.slice(1) 
        : text ? String(text) : "-",
  },
  {
    title: 'Merchant',
    dataIndex: 'merchant',
    key: 'merchant',
    width: '12%',
    render: (text) => 
      typeof text === 'string' 
        ? text.charAt(0).toUpperCase() + text.slice(1) : "-",
    responsive: ['md' as Breakpoint],
  },
  {
    title: 'Review Text',
    dataIndex: 'feedbackText',
    key: 'reviewText',
    responsive: ['md' as Breakpoint],
    width: '22%',
    ellipsis: false,
    render: (text) => 
      text ? text : "-",
  },
  {
    title: 'Submitted At',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: '10%',
    render: (date) => formatDistanceToNow(new Date(date))
  },
];

const serviceColumns: ServiceColumnType[] = [
  {
    title: 'Model Name',
    dataIndex: 'modelName',
    key: 'modelName',
    width: '12%',
    render: (text) => 
      text ? text : "-",
    responsive: ['sm' as Breakpoint],
  },
  {
    title: 'Model Year',
    dataIndex: 'modelYear',
    key: 'modelYear',
    width: '12%',
    render: (text) => 
      text ? text : "-",
    responsive: ['sm' as Breakpoint],
  },
  {
    title: 'Service Center',
    dataIndex: 'serviceCenterName',
    key: 'serviceCenterName',
    width: '12%',
    render: (text) => 
      text ? text : "-",
    responsive: ['sm' as Breakpoint],
  },

 
];


const appColumns: AppColumnType[] = [

];

const commonColumnsBeforeService = commonColumns.slice(0, 6); 
const commonColumnsAfterService = commonColumns.slice(6)

const columns = activeTab === "service" 
  ? [...commonColumnsBeforeService, ...serviceColumns, ...commonColumnsAfterService]
  : [...commonColumns, ...appColumns];


  return (
    <Card
      title="Customer Feedback"
      style={{ overflow: 'hidden' }}
    >
      <div className='flex justify-start gap-2 xl:gap-20 '>
        {ratings && <FeedbackRatings data={ratings?.serviceFeedback} title='Service' />}
        {ratings && <FeedbackRatings data={ratings?.appFeedback} title='App' />}
      </div>
      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <TabPane tab="Service Feedback" key="service">
        {loading ? (
      <Skeleton
      active
      title={false}
      paragraph={{
        rows: visibleRows,
        width: '100%',
      }}
    />
    ) : (
      activeTab === "service" && (
        <Table
          ref={tableRef}
          columns={columns}
          dataSource={displayedData}
          rowKey="id"
          pagination={false}
          locale={{ emptyText: "No service feedback available" }}
          scroll={tableScroll}
          style={{ width: '100%',  overflowX: tableScroll ? 'auto' : 'hidden'  }}
        />
      )
    )}
        </TabPane>
        <TabPane tab="App Feedback" key="app">
        {loading ? (
      <Skeleton active paragraph={{ rows: visibleRows }} />
    ) : (
      activeTab === "app" && (
        <Table
          ref={tableRef}
          columns={columns}
          dataSource={displayedData}
          rowKey="id"
          pagination={false}
          locale={{ emptyText: "No app feedback available" }}
          scroll={tableScroll}
          style={{ width: '100%',  overflowX: tableScroll ? 'auto' : 'hidden'  }}
        />
      )
    )}
        </TabPane>
      </Tabs>
      <CustomPagination 
        currentPage={activeTab === "service" ? servicePage : appPage}
        totalPages={currentPagination?.totalPages || 1}
        setPage={activeTab === "service" ? setServicePage : setAppPage}
        subPageIndex={subPageIndex}
        setSubPageIndex={setSubPageIndex}
        totalSubPages={totalSubPages}
        shouldSliceData={shouldSliceData}
        onRefresh={refetch}
      />
    </Card>
  );
}