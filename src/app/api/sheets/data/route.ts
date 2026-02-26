import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import * as cookie from 'cookie';
import { GoogleSheetsService } from '../../../../lib/googleSheets';
import { getUserConfig } from '../../../../config/users';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, spreadsheetId, sheetName, range } = body;

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    // Use the same authentication logic as check-auth
    const cookieHeader = request.headers.get("cookie") || "";
    const cookies = cookie.parse(cookieHeader);
    const token = cookies[`auth-${username}`];

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as any;
      
      // Check if token is for the correct user
      if (decoded.username !== username) {
        return NextResponse.json({ error: 'Invalid token for user' }, { status: 401 });
      }
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const userConfig = getUserConfig(decoded.username);
    if (!userConfig) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!spreadsheetId) {
      return NextResponse.json({ error: 'Spreadsheet ID is required' }, { status: 400 });
    }

    const sheetsService = new GoogleSheetsService();
    
    // Get spreadsheet info first to verify access
    const spreadsheetInfo = await sheetsService.getSpreadsheetInfo(spreadsheetId);
    
    // Get sheet data
    const sheetData = await sheetsService.readSheetData(
      spreadsheetId, 
      sheetName || 'Sheet1', 
      range
    );
    
    // Convert to Luckysheet format
    const luckysheetData = sheetsService.convertSheetsToLuckysheetData(sheetData);
    
    return NextResponse.json({ 
      spreadsheetInfo,
      sheetData: luckysheetData 
    });
  } catch (error: any) {
    console.error('Error getting sheet data:', error);
    return NextResponse.json({ 
      error: 'Failed to get sheet data', 
      details: error?.message,
      code: error?.code,
      status_code: error?.response?.status
    }, { status: 500 });
  }
}