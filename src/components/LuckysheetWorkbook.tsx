'use client'

import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

declare global {
  interface Window {
    luckysheet: any;
  }
}

interface LuckysheetWorkbookProps {
  data: any;
  options?: {
    container: string;
    title?: string;
    lang?: string;
  };
}

export interface LuckysheetWorkbookRef {
  getLuckysheetData: () => any;
  refreshData: () => void;
}

const LuckysheetWorkbook = forwardRef<LuckysheetWorkbookRef, LuckysheetWorkbookProps>(
  ({ data, options }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const luckysheetInstance = useRef<any>(null);
    const isInitialized = useRef(false);

    useImperativeHandle(ref, () => ({
      getLuckysheetData: () => {
        if (window.luckysheet) {
          return window.luckysheet.getluckysheetfile();
        }
        return null;
      },
      refreshData: () => {
        if (window.luckysheet && data) {
          window.luckysheet.destroy();
          initializeLuckysheet();
        }
      }
    }));

    const loadLuckysheetAssets = () => {
      return new Promise<void>((resolve, reject) => {
        // Check if already loaded
        if (window.luckysheet) {
          resolve();
          return;
        }

        // Load CSS
        if (!document.querySelector('link[href*="luckysheet"]')) {
          const cssLink = document.createElement('link');
          cssLink.rel = 'stylesheet';
          cssLink.href = '/luckysheet/css/luckysheet.css';
          document.head.appendChild(cssLink);

          const pluginsCSS = document.createElement('link');
          pluginsCSS.rel = 'stylesheet';
          pluginsCSS.href = '/luckysheet/plugins/css/pluginsCss.css';
          document.head.appendChild(pluginsCSS);

          const iconCSS = document.createElement('link');
          iconCSS.rel = 'stylesheet';
          iconCSS.href = '/luckysheet/plugins/plugins.css';
          document.head.appendChild(iconCSS);
        }

        // Load JS
        if (!document.querySelector('script[src*="luckysheet"]')) {
          const script = document.createElement('script');
          script.src = '/luckysheet/luckysheet.umd.js';
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load Luckysheet'));
          document.head.appendChild(script);
        } else {
          resolve();
        }
      });
    };

    const initializeLuckysheet = () => {
      if (!containerRef.current || isInitialized.current) return;

      const container = containerRef.current;
      container.innerHTML = ''; // Clear container

      const config = {
        container: container,
        title: options?.title || 'Spreadsheet',
        lang: options?.lang || 'en',
        data: [data],
        
        // Configuration options
        showtoolbar: true,
        showinfobar: true,
        showsheetbar: true,
        showstatisticBar: true,
        allowCopy: true,
        allowEdit: true,
        allowUpdate: true,
        
        // Disable some features we don't need
        enableAddRow: true,
        enableAddCol: true,
        enableAddSheet: false, // We'll handle sheets separately
        
        // Hook functions for capturing changes
        cellEditBefore: function(range: any) {
          console.log('Cell edit before:', range);
        },
        
        cellEditEnd: function(range: any, value: any) {
          console.log('Cell edit end:', range, value);
        },
        
        cellUpdateBefore: function(r: number, c: number, value: any, isRefresh: boolean) {
          console.log('Cell update before:', r, c, value, isRefresh);
        },
        
        cellUpdateAfter: function(r: number, c: number, oldValue: any, newValue: any, isRefresh: boolean) {
          console.log('Cell update after:', r, c, oldValue, newValue, isRefresh);
        },

        // Formatting hooks
        cellMousedown: function(cell: any, postion: any, sheetFile: any, ctx: any) {
          // Handle cell selection
        },

        cellMouseup: function(cell: any, postion: any, sheetFile: any, ctx: any) {
          // Handle cell selection end
        },

        // Row/Column operations
        rowTitleClick: function(index: number, dbclick: boolean) {
          console.log('Row title click:', index, dbclick);
        },

        columnTitleClick: function(index: number, dbclick: boolean) {
          console.log('Column title click:', index, dbclick);
        }
      };

      try {
        if (window.luckysheet) {
          window.luckysheet.create(config);
          luckysheetInstance.current = window.luckysheet;
          isInitialized.current = true;
          console.log('Luckysheet initialized successfully');
        }
      } catch (error) {
        console.error('Error initializing Luckysheet:', error);
      }
    };

    useEffect(() => {
      const initialize = async () => {
        try {
          await loadLuckysheetAssets();
          // Small delay to ensure DOM is ready
          setTimeout(() => {
            initializeLuckysheet();
          }, 100);
        } catch (error) {
          console.error('Error loading Luckysheet:', error);
        }
      };

      initialize();

      // Cleanup function
      return () => {
        if (window.luckysheet && isInitialized.current) {
          try {
            window.luckysheet.destroy();
            isInitialized.current = false;
          } catch (error) {
            console.error('Error destroying Luckysheet:', error);
          }
        }
      };
    }, []);

    // Update data when it changes
    useEffect(() => {
      if (data && isInitialized.current && window.luckysheet) {
        try {
          // Update the sheet data
          window.luckysheet.setluckysheetfile([data]);
          window.luckysheet.refresh();
        } catch (error) {
          console.error('Error updating Luckysheet data:', error);
        }
      }
    }, [data]);

    return (
      <div 
        ref={containerRef}
        style={{ 
          width: '100%', 
          height: '100%',
          position: 'relative',
          overflow: 'hidden'
        }}
      />
    );
  }
);

LuckysheetWorkbook.displayName = 'LuckysheetWorkbook';

export default LuckysheetWorkbook;