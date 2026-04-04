import { google } from 'googleapis';
import { serviceAccountConfig, validateServiceAccountConfig } from '../config/users';

function toGoogleApiError(error: any, fallbackMessage: string): Error {
  const apiMessage = error?.response?.data?.error?.message;
  const apiStatus = error?.response?.status ?? error?.status;
  const apiCode = error?.code;
  const serviceName = error?.response?.data?.error?.details?.find(
    (detail: any) => detail?.['@type'] === 'type.googleapis.com/google.rpc.ErrorInfo'
  )?.metadata?.serviceTitle;

  let message = apiMessage || error?.message || fallbackMessage;

  if (apiCode === 403 && /SERVICE_DISABLED|accessNotConfigured/i.test(String(message))) {
    message = `${serviceName || 'Google API'} is disabled for this service account project. Enable it in Google Cloud Console and retry.`;
  }

  const wrapped = new Error(message) as Error & { code?: number | string; status_code?: number };
  wrapped.code = apiCode;
  wrapped.status_code = apiStatus;

  return wrapped;
}

// Initialize Google Sheets API with service account
function getSheetsService() {
  if (!validateServiceAccountConfig()) {
    throw new Error('Google Service Account configuration is incomplete. Please check your environment variables.');
  }

  const auth = new google.auth.GoogleAuth({
    credentials: serviceAccountConfig,
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive.readonly',
    ],
  });

  return google.sheets({ version: 'v4', auth });
}

export interface SheetData {
  values: any[][];
  celldata?: any[];
  properties: {
    title: string;
    sheetId: number;
    gridProperties: {
      rowCount: number;
      columnCount: number;
    };
    rowlen?: Record<string, number>;
    columnlen?: Record<string, number>;
    customHeight?: Record<string, 1>;
    customWidth?: Record<string, 1>;
    borderInfo?: any[];
    merges?: Array<{
      startRowIndex: number;
      endRowIndex: number;
      startColumnIndex: number;
      endColumnIndex: number;
    }>;
  };
}

function colorToHex(color?: { red?: number | null; green?: number | null; blue?: number | null; alpha?: number | null }): string | undefined {
  if (!color) return undefined;

  const r = Math.round((color.red ?? 0) * 255);
  const g = Math.round((color.green ?? 0) * 255);
  const b = Math.round((color.blue ?? 0) * 255);
  const a = color.alpha ?? 1;

  if (a <= 0) return undefined;

  return `#${[r, g, b]
    .map((value) => Math.max(0, Math.min(255, value)).toString(16).padStart(2, '0'))
    .join('')}`;
}

function colorToRgbString(color?: { red?: number | null; green?: number | null; blue?: number | null; alpha?: number | null }): string | undefined {
  if (!color) return undefined;

  const r = Math.round((color.red ?? 0) * 255);
  const g = Math.round((color.green ?? 0) * 255);
  const b = Math.round((color.blue ?? 0) * 255);
  const a = color.alpha ?? 1;

  if (a <= 0) return undefined;

  return `rgb(${Math.max(0, Math.min(255, r))}, ${Math.max(0, Math.min(255, g))}, ${Math.max(0, Math.min(255, b))})`;
}

function normalizeCellValue(effectiveValue: any, formattedValue?: string | null): string | number | boolean {
  if (effectiveValue?.stringValue !== undefined) return effectiveValue.stringValue;
  if (effectiveValue?.numberValue !== undefined) return effectiveValue.numberValue;
  if (effectiveValue?.boolValue !== undefined) return effectiveValue.boolValue;
  if (effectiveValue?.formulaValue !== undefined) return effectiveValue.formulaValue;
  return formattedValue || '';
}

function toLuckysheetBorderStyle(style?: string | null): number {
  switch (style) {
    case 'DOTTED':
      return 2;
    case 'DASHED':
      return 3;
    case 'DOUBLE':
      return 4;
    case 'SOLID_THICK':
      return 13;
    case 'SOLID_MEDIUM':
      return 10;
    case 'SOLID':
    default:
      return 1;
  }
}

export interface CellFormat {
  backgroundColor?: {
    red?: number;
    green?: number;
    blue?: number;
    alpha?: number;
  };
  textFormat?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    fontSize?: number;
    fontFamily?: string;
    foregroundColor?: {
      red?: number;
      green?: number;
      blue?: number;
      alpha?: number;
    };
  };
  horizontalAlignment?: string;
  verticalAlignment?: string;
  borders?: any;
}

export interface UpdateRequest {
  range: string;
  values?: any[][];
  format?: CellFormat;
}

export interface MergeRequest {
  sheetId: number;
  startRowIndex: number;
  endRowIndex: number;
  startColumnIndex: number;
  endColumnIndex: number;
  mergeType: 'MERGE_ALL' | 'MERGE_COLUMNS' | 'MERGE_ROWS';
}

export class GoogleSheetsService {
  private sheets;
  private drive;

  constructor() {
    this.sheets = getSheetsService();
    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccountConfig,
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });
    this.drive = google.drive({ version: 'v3', auth });
  }

  // Get spreadsheet metadata
  async getSpreadsheetInfo(spreadsheetId: string) {
    try {
      const response = await this.sheets.spreadsheets.get({
        spreadsheetId: spreadsheetId,
      });
      
      return {
        title: response.data.properties?.title,
        sheets: response.data.sheets?.map(sheet => ({
          sheetId: sheet.properties?.sheetId,
          title: sheet.properties?.title,
          rowCount: sheet.properties?.gridProperties?.rowCount,
          columnCount: sheet.properties?.gridProperties?.columnCount,
        })),
      };
    } catch (error: any) {
      console.error('Error getting spreadsheet info:', error);
      throw toGoogleApiError(error, 'Failed to get spreadsheet information');
    }
  }

  // Read data from a specific sheet
  async readSheetData(spreadsheetId: string, sheetName: string = 'Sheet1', range?: string): Promise<SheetData> {
    try {
      const escapedSheetName = `'${sheetName.replace(/'/g, "''")}'`;
      const requestedRange = range ? `${escapedSheetName}!${range}` : escapedSheetName;

      const spreadsheetResponse = await this.sheets.spreadsheets.get({
        spreadsheetId: spreadsheetId,
        ranges: [requestedRange],
        includeGridData: true,
        fields: 'sheets(properties(sheetId,title,gridProperties(rowCount,columnCount)),merges,data(startRow,startColumn,rowData(values(effectiveValue,formattedValue,userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment,numberFormat,borders),effectiveFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment,numberFormat,borders,wrapStrategy))),rowMetadata(pixelSize),columnMetadata(pixelSize)))',
      });

      const sheet = spreadsheetResponse.data.sheets?.find(s => s.properties?.title === sheetName);
      const gridData = sheet?.data?.[0];
      const rowOffset = gridData?.startRow || 0;
      const columnOffset = gridData?.startColumn || 0;
      const rowData = gridData?.rowData || [];

      const values: any[][] = [];
      const celldata: any[] = [];
      const borderInfo: any[] = [];

      rowData.forEach((row, rowIndex) => {
        if (!row?.values) return;

        const absoluteRow = rowOffset + rowIndex;

        row.values.forEach((cell, colIndex) => {
          if (!cell) return;

          const absoluteCol = columnOffset + colIndex;
          const normalizedValue = normalizeCellValue(cell.effectiveValue, cell.formattedValue);
          const format = cell.effectiveFormat || cell.userEnteredFormat || {};
          const textFormat = format.textFormat || {};
          const cellBorders = format.borders || {};
          const hasBorder = Boolean(
            cellBorders.top?.style ||
            cellBorders.bottom?.style ||
            cellBorders.left?.style ||
            cellBorders.right?.style
          );

          const backgroundHex = colorToHex(format.backgroundColor || undefined);
          const foregroundHex = colorToHex(textFormat.foregroundColor || undefined);

          const hasVisibleStyle = Boolean(
            backgroundHex ||
            foregroundHex ||
            textFormat.bold ||
            textFormat.italic ||
            textFormat.underline ||
            textFormat.fontSize ||
            format.horizontalAlignment ||
            format.verticalAlignment ||
            hasBorder
          );

          const hasValue = normalizedValue !== '' && normalizedValue !== null && normalizedValue !== undefined;

          if (!hasValue && !hasVisibleStyle) {
            return;
          }

          if (!values[absoluteRow]) values[absoluteRow] = [];
          values[absoluteRow][absoluteCol] = normalizedValue;

          const v: any = {
            v: normalizedValue,
            m: cell.formattedValue ?? String(normalizedValue),
            ct: {
              fa: format.numberFormat?.pattern || 'General',
              t: typeof normalizedValue === 'number' ? 'n' : (typeof normalizedValue === 'boolean' ? 'b' : 'g'),
            },
            vt: 0,
          };

          if (backgroundHex) v.bg = backgroundHex;
          if (foregroundHex) v.fc = foregroundHex;
          if (textFormat.bold) v.bl = 1;
          if (textFormat.italic) v.it = 1;
          if (textFormat.underline) v.un = 1;
          if (typeof textFormat.fontSize === 'number') v.fs = textFormat.fontSize;

          if (format.horizontalAlignment === 'LEFT') v.ht = 1;
          if (format.horizontalAlignment === 'CENTER') v.ht = 0;
          if (format.horizontalAlignment === 'RIGHT') v.ht = 2;
          if (format.verticalAlignment === 'TOP') v.vt = 1;
          if (format.verticalAlignment === 'MIDDLE') v.vt = 0;
          if (format.verticalAlignment === 'BOTTOM') v.vt = 2;
          if (textFormat.fontFamily) v.ff = textFormat.fontFamily;

          if (format.wrapStrategy === 'WRAP') v.tb = 2;
          if (format.wrapStrategy === 'CLIP') v.tb = 0;
          if (format.wrapStrategy === 'OVERFLOW_CELL') v.tb = 1;

          const borderValue: any = { row_index: absoluteRow, col_index: absoluteCol };

          if (cellBorders.top?.style) {
            borderValue.t = {
              style: toLuckysheetBorderStyle(cellBorders.top.style),
              color: colorToRgbString(cellBorders.top.color || undefined) || 'rgb(0, 0, 0)'
            };
          }

          if (cellBorders.bottom?.style) {
            borderValue.b = {
              style: toLuckysheetBorderStyle(cellBorders.bottom.style),
              color: colorToRgbString(cellBorders.bottom.color || undefined) || 'rgb(0, 0, 0)'
            };
          }

          if (cellBorders.left?.style) {
            borderValue.l = {
              style: toLuckysheetBorderStyle(cellBorders.left.style),
              color: colorToRgbString(cellBorders.left.color || undefined) || 'rgb(0, 0, 0)'
            };
          }

          if (cellBorders.right?.style) {
            borderValue.r = {
              style: toLuckysheetBorderStyle(cellBorders.right.style),
              color: colorToRgbString(cellBorders.right.color || undefined) || 'rgb(0, 0, 0)'
            };
          }

          if (borderValue.t || borderValue.b || borderValue.l || borderValue.r) {
            borderInfo.push({ rangeType: 'cell', value: borderValue });
          }

          celldata.push({
            r: absoluteRow,
            c: absoluteCol,
            v,
          });
        });
      });

      const rowlen: Record<string, number> = {};
      const columnlen: Record<string, number> = {};
      const customHeight: Record<string, 1> = {};
      const customWidth: Record<string, 1> = {};

      (gridData?.rowMetadata || []).forEach((metadata, index) => {
        if (typeof metadata?.pixelSize === 'number' && metadata.pixelSize > 0 && metadata.pixelSize !== 21) {
          const rowKey = String(rowOffset + index);
          rowlen[rowKey] = Math.max(10, metadata.pixelSize - 2);
          customHeight[rowKey] = 1;
        }
      });

      (gridData?.columnMetadata || []).forEach((metadata, index) => {
        if (typeof metadata?.pixelSize === 'number' && metadata.pixelSize > 0 && metadata.pixelSize !== 100) {
          const colKey = String(columnOffset + index);
          columnlen[colKey] = Math.max(50, metadata.pixelSize - 2);
          customWidth[colKey] = 1;
        }
      });

      if (borderInfo.length < 10) {
        const rowCellMap = new Map<number, number[]>();

        celldata.forEach((cell) => {
          if (cell?.v?.v === '' || cell?.v?.v === undefined || cell?.v?.v === null) return;
          const current = rowCellMap.get(cell.r) || [];
          current.push(cell.c);
          rowCellMap.set(cell.r, current);
        });

        rowCellMap.forEach((cols, row) => {
          const uniqueCols = Array.from(new Set(cols)).sort((a, b) => a - b);

          // Only draw fallback borders on dense rows that look like table rows.
          if (uniqueCols.length < 3) return;

          const minCol = uniqueCols[0];
          const maxCol = uniqueCols[uniqueCols.length - 1];

          borderInfo.push({
            rangeType: 'range',
            borderType: 'border-all',
            style: 1,
            color: 'rgb(198, 206, 214)',
            range: [{
              row: [row, row],
              column: [minCol, maxCol],
            }],
          });
        });
      }
      
      return {
        values,
        celldata,
        properties: {
          title: sheet?.properties?.title || sheetName,
          sheetId: sheet?.properties?.sheetId || 0,
          gridProperties: {
            rowCount: sheet?.properties?.gridProperties?.rowCount || 1000,
            columnCount: sheet?.properties?.gridProperties?.columnCount || 26,
          },
          rowlen,
          columnlen,
          customHeight,
          customWidth,
          borderInfo,
          merges: (sheet?.merges || []).map(merge => ({
            startRowIndex: merge.startRowIndex || 0,
            endRowIndex: merge.endRowIndex || 0,
            startColumnIndex: merge.startColumnIndex || 0,
            endColumnIndex: merge.endColumnIndex || 0,
          }))
        }
      };
    } catch (error: any) {
      console.error('Error reading sheet data:', error);
      throw toGoogleApiError(error, 'Failed to read sheet data');
    }
  }

  // Update cell values
  async updateValues(spreadsheetId: string, updates: UpdateRequest[]): Promise<void> {
    try {
      const requests = [];

      for (const update of updates) {
        // Update values if provided
        if (update.values) {
          requests.push({
            updateCells: {
              range: this.parseRange(update.range),
              rows: update.values.map(row => ({
                values: row.map(value => ({ userEnteredValue: { stringValue: String(value) } }))
              })),
              fields: 'userEnteredValue'
            }
          });
        }

        // Update formatting if provided
        if (update.format) {
          requests.push({
            updateCells: {
              range: this.parseRange(update.range),
              rows: [{
                values: [{
                  userEnteredFormat: update.format
                }]
              }],
              fields: 'userEnteredFormat'
            }
          });
        }
      }

      if (requests.length > 0) {
        await this.sheets.spreadsheets.batchUpdate({
          spreadsheetId: spreadsheetId,
          requestBody: {
            requests: requests
          }
        });
      }
    } catch (error: any) {
      console.error('Error updating values:', error);
      throw toGoogleApiError(error, 'Failed to update values');
    }
  }

  // Merge cells
  async mergeCells(spreadsheetId: string, mergeRequest: MergeRequest): Promise<void> {
    try {
      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: spreadsheetId,
        requestBody: {
          requests: [{
            mergeCells: {
              range: {
                sheetId: mergeRequest.sheetId,
                startRowIndex: mergeRequest.startRowIndex,
                endRowIndex: mergeRequest.endRowIndex,
                startColumnIndex: mergeRequest.startColumnIndex,
                endColumnIndex: mergeRequest.endColumnIndex,
              },
              mergeType: mergeRequest.mergeType
            }
          }]
        }
      });
    } catch (error: any) {
      console.error('Error merging cells:', error);
      throw toGoogleApiError(error, 'Failed to merge cells');
    }
  }

  // Unmerge cells
  async unmergeCells(spreadsheetId: string, sheetId: number, startRowIndex: number, endRowIndex: number, startColumnIndex: number, endColumnIndex: number): Promise<void> {
    try {
      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: spreadsheetId,
        requestBody: {
          requests: [{
            unmergeCells: {
              range: {
                sheetId: sheetId,
                startRowIndex: startRowIndex,
                endRowIndex: endRowIndex,
                startColumnIndex: startColumnIndex,
                endColumnIndex: endColumnIndex,
              }
            }
          }]
        }
      });
    } catch (error: any) {
      console.error('Error unmerging cells:', error);
      throw toGoogleApiError(error, 'Failed to unmerge cells');
    }
  }

  // Get list of spreadsheets from a specific folder
  async getSpreadsheetsList(folderId: string): Promise<Array<{id: string, name: string, modifiedTime: string}>> {
    try {
      const response = await this.drive.files.list({
        q: `'${folderId}' in parents and mimeType='application/vnd.google-apps.spreadsheet' and trashed = false`,
        fields: 'files(id,name,modifiedTime)',
        orderBy: 'modifiedTime desc',
      });

      return response.data.files?.map(file => ({
        id: file.id!,
        name: file.name!,
        modifiedTime: file.modifiedTime!,
      })) || [];
    } catch (error: any) {
      console.error('Error getting spreadsheets list:', error);
      throw toGoogleApiError(error, 'Failed to get spreadsheets list');
    }
  }

  // Helper function to parse range string
  private parseRange(range: string) {
    // Convert A1 notation to grid range
    const parts = range.split(':');
    if (parts.length === 2) {
      const start = this.parseCell(parts[0]);
      const end = this.parseCell(parts[1]);
      return {
        startRowIndex: start.row,
        endRowIndex: end.row + 1,
        startColumnIndex: start.column,
        endColumnIndex: end.column + 1,
      };
    } else {
      const cell = this.parseCell(range);
      return {
        startRowIndex: cell.row,
        endRowIndex: cell.row + 1,
        startColumnIndex: cell.column,
        endColumnIndex: cell.column + 1,
      };
    }
  }

  // Helper function to parse cell reference like A1
  private parseCell(cellRef: string): { row: number; column: number } {
    const match = cellRef.match(/^([A-Z]+)(\d+)$/);
    if (!match) throw new Error(`Invalid cell reference: ${cellRef}`);
    
    const columnStr = match[1];
    const rowStr = match[2];
    
    let column = 0;
    for (let i = 0; i < columnStr.length; i++) {
      column = column * 26 + (columnStr.charCodeAt(i) - 65 + 1);
    }
    column -= 1; // Convert to 0-based index
    
    const row = parseInt(rowStr) - 1; // Convert to 0-based index
    
    return { row, column };
  }

  // Convert Luckysheet data format to Google Sheets format
  convertLuckysheetToSheetsData(luckysheetData: any): any[][] {
    const celldata = luckysheetData.celldata || [];
    const maxRow = Math.max(...celldata.map((cell: any) => cell.r), 0);
    const maxCol = Math.max(...celldata.map((cell: any) => cell.c), 0);
    
    const sheetData: any[][] = [];
    
    // Initialize with empty values
    for (let r = 0; r <= maxRow; r++) {
      sheetData[r] = new Array(maxCol + 1).fill('');
    }
    
    // Fill in actual values
    celldata.forEach((cell: any) => {
      if (cell.v && cell.v.v !== undefined) {
        sheetData[cell.r][cell.c] = cell.v.v;
      }
    });
    
    return sheetData;
  }

  // Convert Google Sheets data to Luckysheet format
  convertSheetsToLuckysheetData(sheetData: SheetData): any {
    const celldata: any[] = sheetData.celldata ? [...sheetData.celldata] : [];
    const mergeConfig: Record<string, { r: number; c: number; rs: number; cs: number }> = {};
    const values = sheetData.values;
    
    if (!sheetData.celldata && values) {
      values.forEach((row, rowIndex) => {
        if (!row) return;
        row.forEach((cellValue, colIndex) => {
          if (cellValue !== null && cellValue !== undefined && cellValue !== '') {
            celldata.push({
              r: rowIndex,
              c: colIndex,
              v: {
                v: cellValue,
                ct: { fa: "General", t: "g" },
                m: String(cellValue),
              }
            });
          }
        });
      });
    }

    (sheetData.properties.merges || []).forEach((merge) => {
      const r = merge.startRowIndex;
      const c = merge.startColumnIndex;
      const rs = Math.max(merge.endRowIndex - merge.startRowIndex, 1);
      const cs = Math.max(merge.endColumnIndex - merge.startColumnIndex, 1);

      mergeConfig[`${r}_${c}`] = { r, c, rs, cs };
    });
    
    return {
      name: sheetData.properties.title,
      index: sheetData.properties.sheetId,
      order: 0,
      status: 1,
      row: sheetData.properties.gridProperties.rowCount,
      column: sheetData.properties.gridProperties.columnCount,
      celldata: celldata,
      config: {
        merge: mergeConfig,
        rowlen: sheetData.properties.rowlen || {},
        columnlen: sheetData.properties.columnlen || {},
        customHeight: sheetData.properties.customHeight || {},
        customWidth: sheetData.properties.customWidth || {},
        borderInfo: sheetData.properties.borderInfo || [],
      },
      scrollLeft: 0,
      scrollTop: 0,
      luckysheet_select_save: [],
      calcChain: [],
      isPivotTable: false,
      pivotTable: {}
    };
  }
}