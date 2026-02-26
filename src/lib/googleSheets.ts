import { google } from 'googleapis';
import { serviceAccountConfig, validateServiceAccountConfig } from '../config/users';

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
  properties: {
    title: string;
    sheetId: number;
    gridProperties: {
      rowCount: number;
      columnCount: number;
    };
  };
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
    } catch (error) {
      console.error('Error getting spreadsheet info:', error);
      throw new Error('Failed to get spreadsheet information');
    }
  }

  // Read data from a specific sheet
  async readSheetData(spreadsheetId: string, sheetName: string = 'Sheet1', range?: string): Promise<SheetData> {
    try {
      const fullRange = range ? `${sheetName}!${range}` : sheetName;
      
      // Get values
      const valuesResponse = await this.sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: fullRange,
      });

      // Get sheet properties
      const spreadsheetResponse = await this.sheets.spreadsheets.get({
        spreadsheetId: spreadsheetId,
      });

      const sheet = spreadsheetResponse.data.sheets?.find(s => s.properties?.title === sheetName);
      
      return {
        values: valuesResponse.data.values || [],
        properties: {
          title: sheet?.properties?.title || sheetName,
          sheetId: sheet?.properties?.sheetId || 0,
          gridProperties: {
            rowCount: sheet?.properties?.gridProperties?.rowCount || 1000,
            columnCount: sheet?.properties?.gridProperties?.columnCount || 26,
          }
        }
      };
    } catch (error) {
      console.error('Error reading sheet data:', error);
      throw new Error('Failed to read sheet data');
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
    } catch (error) {
      console.error('Error updating values:', error);
      throw new Error('Failed to update values');
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
    } catch (error) {
      console.error('Error merging cells:', error);
      throw new Error('Failed to merge cells');
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
    } catch (error) {
      console.error('Error unmerging cells:', error);
      throw new Error('Failed to unmerge cells');
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
    } catch (error) {
      console.error('Error getting spreadsheets list:', error);
      throw new Error('Failed to get spreadsheets list');
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
    const celldata: any[] = [];
    const values = sheetData.values;
    
    if (values) {
      values.forEach((row, rowIndex) => {
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
    
    return {
      name: sheetData.properties.title,
      index: sheetData.properties.sheetId,
      order: 0,
      status: 1,
      row: sheetData.properties.gridProperties.rowCount,
      column: sheetData.properties.gridProperties.columnCount,
      celldata: celldata,
      config: {},
      scrollLeft: 0,
      scrollTop: 0,
      luckysheet_select_save: [],
      calcChain: [],
      isPivotTable: false,
      pivotTable: {}
    };
  }
}