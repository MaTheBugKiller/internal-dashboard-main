'use client';
import React, { useState } from 'react';
import { Button, Input } from 'antd';
import { LeftOutlined, RightOutlined, ReloadOutlined } from '@ant-design/icons';

type CustomPaginationProps = {
  currentPage: number;
  totalPages: number;
  setPage: (page: number) => void;
  subPageIndex?: number;
  setSubPageIndex?: (index: number) => void;
  totalSubPages?: number;
  shouldSliceData?: boolean;
  onRefresh?: () => void;
};

export const CustomPagination: React.FC<CustomPaginationProps> = ({
  currentPage,
  totalPages,
  setPage,
  subPageIndex = 0,
  setSubPageIndex = () => {},
  totalSubPages = 1,
  shouldSliceData = false,
  onRefresh = () => {},
}) => {
  const [pageInputValue, setPageInputValue] = useState<string>('');
  
  // Calculate overall current page and total pages
  const overallCurrentPage = shouldSliceData 
    ? (currentPage - 1) * totalSubPages + (subPageIndex + 1)
    : currentPage;
    
  const overallTotalPages = shouldSliceData
    ? totalPages * totalSubPages
    : totalPages;
  
  const goToPrevPage = () => {
    if (shouldSliceData && subPageIndex > 0) {
      // Just move to previous sub-page
      setSubPageIndex(subPageIndex - 1);
    } else if (currentPage > 1) {
      // Move to previous server page
      setPage(currentPage - 1);
      // If we're using sub-pages, set to last sub-page of previous server page
      if (shouldSliceData) {
        setSubPageIndex(totalSubPages - 1);
      }
    }
  };
  
  const goToNextPage = () => {
    if (shouldSliceData && subPageIndex < totalSubPages - 1) {
      // Just move to next sub-page
      setSubPageIndex(subPageIndex + 1);
    } else if (currentPage < totalPages) {
      // Move to next server page
      setPage(currentPage + 1);
      // Reset sub-page index
      setSubPageIndex(0);
    }
  };

  // Function to go to a specific page
  const goToSpecificPage = (targetPage: number) => {
    if (targetPage < 1 || targetPage > overallTotalPages) {
      return; // Invalid page number
    }

    if (shouldSliceData) {
      // Calculate server page and sub-page index
      const calculatedServerPage = Math.ceil(targetPage / totalSubPages);
      const calculatedSubPageIndex = (targetPage - 1) % totalSubPages;
      
      setPage(calculatedServerPage);
      setSubPageIndex(calculatedSubPageIndex);
    } else {
      // Simple case, just set the page
      setPage(targetPage);
    }
    
    // Clear input after use
    setPageInputValue('');
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const value = e.target.value.replace(/[^0-9]/g, '');
    setPageInputValue(value);
  };

  const handlePageInputSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && pageInputValue) {
      goToSpecificPage(parseInt(pageInputValue));
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-end mt-4 gap-2">
      <Button
        icon={<LeftOutlined />}
        onClick={goToPrevPage}
        disabled={currentPage === 1 && (!shouldSliceData || subPageIndex === 0)}
      >
        Prev
      </Button>
      
      <div className="flex items-center">
        <span className="hidden sm:inline mx-2">
          Page {overallCurrentPage} of {overallTotalPages}
        </span>
        <span className="sm:hidden mx-2">
          {overallCurrentPage}/{overallTotalPages}
        </span>
        
        
      </div>
      
      <Button
        icon={<RightOutlined />}
        onClick={goToNextPage}
        disabled={currentPage >= totalPages && (!shouldSliceData || subPageIndex >= totalSubPages - 1)}
      >
        Next
      </Button>
      <div className="flex items-center gap-2">
          <Input
            placeholder="Go to"
            value={pageInputValue}
            onChange={handlePageInputChange}
            onKeyDown={handlePageInputSubmit}
            style={{ width: 60 }}
            maxLength={5}
          />
          <Button 
            onClick={() => pageInputValue && goToSpecificPage(parseInt(pageInputValue))}
            size="small" 
            type="primary"
          >
            Go
          </Button>
        </div>
      
      <Button 
        icon={<ReloadOutlined />} 
        onClick={onRefresh}
        className="ml-2"
      >
        Refresh
      </Button>
      
    </div>
  );
};