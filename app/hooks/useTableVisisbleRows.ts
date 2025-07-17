import { TableRef } from "antd/es/table";
import {  useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export const useTableVisibleRows = (defaultVisibleRows: number = 10, delay: number = 100) => {
  const tableRef = useRef<TableRef>(null);
  const [visibleRows, setVisibleRows] = useState(defaultVisibleRows);
  const [shouldSliceData, setShouldSliceData] = useState(false);

  const calculateVisibleRows = useDebouncedCallback(() => {
    const tableWrapper = tableRef.current?.nativeElement;
    if (!tableWrapper) return;

    const tBody = tableWrapper.querySelector("tbody");
    if (!tBody) return;

    // Skip if empty
    if (tableWrapper.querySelector(".ant-empty")) {
      setShouldSliceData(false);
      return;
    }

    // Calculate available space (account for table headers, margins, etc.)
    const { top: tBodyTop } = tBody.getBoundingClientRect();
    const availableHeight = window.innerHeight - tBodyTop - 32; // 32px buffer

    // Measure row height
    const firstRow = tBody.querySelector("tr:not(.ant-table-measure-row)");
    if (!firstRow) return;

    const rowHeight = firstRow.getBoundingClientRect().height;
    if (rowHeight > 0) {
      const newVisibleRows = Math.max(1, Math.floor(availableHeight / rowHeight));
      setVisibleRows(newVisibleRows);
      setShouldSliceData(true);
    }
  }, delay);

  // Set up resize observer
  useEffect(() => {
    calculateVisibleRows();
    window.addEventListener("resize", calculateVisibleRows);
    return () => window.removeEventListener("resize", calculateVisibleRows);
  }, [calculateVisibleRows]);

  // Observe table changes
  useLayoutEffect(() => {
    const tableWrapper = tableRef.current?.nativeElement;
    if (!tableWrapper) return;

    const observer = new MutationObserver(calculateVisibleRows);
    observer.observe(tableWrapper, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    return () => observer.disconnect();
  }, [calculateVisibleRows]);

  return { tableRef, visibleRows, shouldSliceData };
};