'use client'

import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

declare global {
  interface Window {
    x_spreadsheet: any;
  }
}

interface LuckysheetWorkbookProps {
  data: any[] | any;
  options?: {
    container: string;
    title?: string;
    lang?: string;
  };
}

export interface LuckysheetWorkbookRef {
  getLuckysheetData: () => any;
  refreshData: () => void;
  setZoom: (zoomRatio: number) => void;
}

const LuckysheetWorkbook = forwardRef<LuckysheetWorkbookRef, LuckysheetWorkbookProps>(
  ({ data, options }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const spreadsheetInstance = useRef<any>(null);
    const isInitialized = useRef(false);
    const containerIdRef = useRef(`luckysheet-${Math.random().toString(36).slice(2, 10)}`);
    const zoomRatioRef = useRef(1);

    const columnIndexToLetter = (index: number): string => {
      let result = '';
      let current = index;

      while (current >= 0) {
        result = String.fromCharCode(65 + (current % 26)) + result;
        current = Math.floor(current / 26) - 1;
      }

      return result;
    };

    const mergeToA1Range = (r: number, c: number, rs: number, cs: number): string => {
      const start = `${columnIndexToLetter(c)}${r + 1}`;
      const endRow = r + Math.max(1, rs) - 1;
      const endCol = c + Math.max(1, cs) - 1;
      const end = `${columnIndexToLetter(endCol)}${endRow + 1}`;

      return `${start}:${end}`;
    };

    const applyZoom = (zoomRatio: number) => {
      zoomRatioRef.current = zoomRatio;
      const root = containerRef.current?.querySelector('.x-spreadsheet') as HTMLElement | null;
      if (!root) return;

      root.style.transform = `scale(${zoomRatio})`;
      root.style.transformOrigin = 'top left';
      root.style.width = `${100 / zoomRatio}%`;
      root.style.height = `${100 / zoomRatio}%`;
    };

    const convertLuckysheetToXData = (rawData: any[] | any) => {
      const sheets = Array.isArray(rawData) ? rawData : [rawData];

      return sheets.map((sheet, sheetIndex) => {
        const defaultRowHeight = 25;
        const defaultColWidth = 100;
        const rowCount = Number(sheet?.row || 100);
        const colCount = Number(sheet?.column || 26);
        const rows: Record<string, any> = { len: rowCount };
        const cols: Record<string, any> = { len: colCount };
        const styles: any[] = [];
        const styleIndexMap = new Map<string, number>();
        const merges: string[] = [];

        const estimateWrappedLines = (text: string, colWidth: number): number => {
          const safeWidth = Number.isFinite(colWidth) ? colWidth : defaultColWidth;
          const charsPerLine = Math.max(8, Math.floor((safeWidth - 12) / 7.2));

          return text
            .split(/\r?\n/)
            .reduce((total, part) => total + Math.max(1, Math.ceil(part.length / charsPerLine)), 0);
        };

        const addStyle = (styleObject: any): number | undefined => {
          if (!styleObject || Object.keys(styleObject).length === 0) return undefined;
          const key = JSON.stringify(styleObject);
          if (styleIndexMap.has(key)) return styleIndexMap.get(key);
          const index = styles.length;
          styles.push(styleObject);
          styleIndexMap.set(key, index);
          return index;
        };

        const getCellStyle = (cellValue: any) => {
          const style: any = {};
          const font: any = {};

          if (cellValue?.bg) style.bgcolor = cellValue.bg;
          if (cellValue?.fc) style.color = cellValue.fc;
          if (cellValue?.bl) font.bold = true;
          if (cellValue?.it) font.italic = true;
          if (cellValue?.fs) font.size = Number(cellValue.fs);
          if (cellValue?.ff) font.name = String(cellValue.ff);
          if (cellValue?.un) style.underline = true;

          if (Object.keys(font).length > 0) style.font = font;

          if (cellValue?.ht === 1) style.align = 'left';
          else if (cellValue?.ht === 0) style.align = 'center';
          else if (cellValue?.ht === 2) style.align = 'right';

          if (cellValue?.vt === 1) style.valign = 'top';
          else if (cellValue?.vt === 0) style.valign = 'middle';
          else if (cellValue?.vt === 2) style.valign = 'bottom';

          if (cellValue?.tb === 2) style.textwrap = true;

          return style;
        };

        const rowlen = sheet?.config?.rowlen || {};
        Object.entries(rowlen).forEach(([rowKey, rowHeight]) => {
          rows[rowKey] = {
            ...(rows[rowKey] || {}),
            height: Number(rowHeight),
          };
        });

        const columnlen = sheet?.config?.columnlen || {};
        Object.entries(columnlen).forEach(([colKey, colWidth]) => {
          cols[colKey] = {
            ...(cols[colKey] || {}),
            width: Number(colWidth),
          };
        });

        const celldata = sheet?.celldata || [];
        celldata.forEach((cell: any) => {
          const r = String(cell.r);
          const c = String(cell.c);
          const cellValue = cell?.v || {};
          const textValue = cellValue.m ?? cellValue.v ?? '';

          rows[r] = rows[r] || { cells: {} };
          rows[r].cells = rows[r].cells || {};

          const styleIndex = addStyle(getCellStyle(cellValue));
          const nextCell: any = {
            text: textValue === null || textValue === undefined ? '' : String(textValue),
          };

          if (styleIndex !== undefined) nextCell.style = styleIndex;
          rows[r].cells[c] = nextCell;

          if (nextCell.text) {
            const colWidth = Number(cols[c]?.width || defaultColWidth);
            const wrappedLines = estimateWrappedLines(nextCell.text, colWidth);
            const suggestedHeight = Math.min(240, Math.max(defaultRowHeight, wrappedLines * 20 + 8));
            const currentHeight = Number(rows[r]?.height || defaultRowHeight);

            if (suggestedHeight > currentHeight) {
              rows[r].height = suggestedHeight;
            }
          }
        });

        const mergeConfig = sheet?.config?.merge || {};
        Object.values(mergeConfig).forEach((merge: any) => {
          const r = Number(merge.r || 0);
          const c = Number(merge.c || 0);
          const rs = Math.max(1, Number(merge.rs || 1));
          const cs = Math.max(1, Number(merge.cs || 1));

          const rowKey = String(r);
          const colKey = String(c);

          rows[rowKey] = rows[rowKey] || { cells: {} };
          rows[rowKey].cells = rows[rowKey].cells || {};
          rows[rowKey].cells[colKey] = rows[rowKey].cells[colKey] || { text: '' };
          rows[rowKey].cells[colKey].merge = [rs - 1, cs - 1];

          merges.push(mergeToA1Range(r, c, rs, cs));
        });

        return {
          name: sheet?.name || `Sheet${sheetIndex + 1}`,
          freeze: 'A1',
          styles,
          merges,
          rows,
          cols,
        };
      });
    };

    const convertXDataToLuckysheetLike = () => {
      const workbookData = spreadsheetInstance.current?.getData?.();
      if (!Array.isArray(workbookData)) return null;

      return workbookData.map((sheet: any) => {
        const celldata: any[] = [];
        const rows = sheet?.rows || {};

        Object.entries(rows).forEach(([rowKey, rowValue]: [string, any]) => {
          if (rowKey === 'len') return;
          const rowIndex = Number(rowKey);
          if (Number.isNaN(rowIndex)) return;

          const cells = rowValue?.cells || {};
          Object.entries(cells).forEach(([colKey, cellValue]: [string, any]) => {
            const colIndex = Number(colKey);
            if (Number.isNaN(colIndex)) return;

            const text = cellValue?.text ?? '';
            if (text === '') return;

            celldata.push({
              r: rowIndex,
              c: colIndex,
              v: {
                v: text,
                m: String(text),
                ct: { fa: 'General', t: 'g' },
              },
            });
          });
        });

        return {
          name: sheet?.name || 'Sheet1',
          celldata,
        };
      });
    };

    useImperativeHandle(ref, () => ({
      getLuckysheetData: () => {
        return convertXDataToLuckysheetLike();
      },
      refreshData: () => {
        if (spreadsheetInstance.current && data) {
          spreadsheetInstance.current.loadData(convertLuckysheetToXData(data));
          if (typeof spreadsheetInstance.current.reRender === 'function') {
            spreadsheetInstance.current.reRender();
          }
        }
      },
      setZoom: (zoomRatio: number) => {
        applyZoom(zoomRatio);
      }
    }));

    const loadSpreadsheetAssets = () => {
      return new Promise<void>((resolve, reject) => {
        const loadScript = (src: string) => {
          return new Promise<void>((scriptResolve, scriptReject) => {
            const existingScript = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement | null;

            if (existingScript) {
              if (existingScript.getAttribute('data-loaded') === 'true') {
                scriptResolve();
                return;
              }

              existingScript.addEventListener('load', () => scriptResolve(), { once: true });
              existingScript.addEventListener('error', () => scriptReject(new Error(`Failed to load script: ${src}`)), { once: true });
              return;
            }

            const script = document.createElement('script');
            script.src = src;
            script.async = false;
            script.onload = () => {
              script.setAttribute('data-loaded', 'true');
              scriptResolve();
            };
            script.onerror = () => scriptReject(new Error(`Failed to load script: ${src}`));
            document.head.appendChild(script);
          });
        };

        if (!document.querySelector('link[href="/vendor/x-data-spreadsheet/xspreadsheet.css"]')) {
          const cssLink = document.createElement('link');
          cssLink.rel = 'stylesheet';
          cssLink.href = '/vendor/x-data-spreadsheet/xspreadsheet.css';
          document.head.appendChild(cssLink);
        }

        if (window.x_spreadsheet) {
          resolve();
          return;
        }

        loadScript('/vendor/x-data-spreadsheet/xspreadsheet.js')
          .then(() => {
            if (!window.x_spreadsheet) {
              reject(new Error('Failed to load x-data-spreadsheet runtime'));
              return;
            }
            resolve();
          })
          .catch(reject);
      });
    };

    const initializeSpreadsheet = () => {
      if (!containerRef.current || isInitialized.current) return;

      const container = containerRef.current;
      const containerId = options?.container || containerIdRef.current;
      container.id = containerId;
      container.innerHTML = '';

      const runtimeData = convertLuckysheetToXData(data);

      try {
        const instance = window.x_spreadsheet(`#${containerId}`, {
          mode: 'edit',
          showToolbar: false,
          showContextmenu: true,
          showBottomBar: true,
          row: { len: 100, height: 25 },
          col: { len: 26, width: 100, indexWidth: 60, minWidth: 60 },
          view: {
            width: () => container.clientWidth,
            height: () => container.clientHeight,
          },
        });

        instance.loadData(runtimeData);
        spreadsheetInstance.current = instance;
        isInitialized.current = true;
        applyZoom(zoomRatioRef.current);

        if (typeof ResizeObserver !== 'undefined') {
          const observer = new ResizeObserver(() => {
            spreadsheetInstance.current?.reRender?.();
            applyZoom(zoomRatioRef.current);
          });
          observer.observe(container);
          (container as any).__sheetResizeObserver = observer;
        }
      } catch (error) {
        console.error('Error initializing x-data-spreadsheet:', error);
      }
    };

    useEffect(() => {
      const initialize = async () => {
        try {
          await loadSpreadsheetAssets();
          setTimeout(() => {
            initializeSpreadsheet();
          }, 100);
        } catch (error) {
          console.error('Error loading x-data-spreadsheet:', error);
        }
      };

      initialize();

      return () => {
        const container = containerRef.current as (HTMLDivElement & { __sheetResizeObserver?: ResizeObserver }) | null;
        if (container?.__sheetResizeObserver) {
          container.__sheetResizeObserver.disconnect();
          delete container.__sheetResizeObserver;
        }

        if (container) {
          container.innerHTML = '';
        }

        spreadsheetInstance.current = null;
        isInitialized.current = false;
      };
    }, []);

    useEffect(() => {
      if (data && isInitialized.current && spreadsheetInstance.current) {
        try {
          spreadsheetInstance.current.loadData(convertLuckysheetToXData(data));
          if (typeof spreadsheetInstance.current.reRender === 'function') {
            spreadsheetInstance.current.reRender();
          }
          applyZoom(zoomRatioRef.current);
        } catch (error) {
          console.error('Error updating spreadsheet data:', error);
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