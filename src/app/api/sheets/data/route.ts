import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import * as cookie from 'cookie';
import { GoogleSheetsService } from '../../../../lib/googleSheets';
import { canUserAccessSpreadsheet, getUserConfig } from '../../../../config/users';

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

    const userConfig = await getUserConfig(decoded.username);
    if (!userConfig) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!spreadsheetId) {
      return NextResponse.json({ error: 'Spreadsheet ID is required' }, { status: 400 });
    }

    if (!(await canUserAccessSpreadsheet(userConfig, spreadsheetId))) {
      return NextResponse.json({ error: 'Access denied for this spreadsheet' }, { status: 403 });
    }

    const sheetsService = new GoogleSheetsService();
    
    // Get spreadsheet info first to verify access
    const spreadsheetInfo = await sheetsService.getSpreadsheetInfo(spreadsheetId);

    const availableSheetNames = (spreadsheetInfo.sheets || [])
      .map(sheet => sheet.title)
      .filter((title): title is string => Boolean(title));

    if (availableSheetNames.length === 0) {
      return NextResponse.json({ error: 'Spreadsheet has no sheets' }, { status: 400 });
    }

    const requestedSheetName = typeof sheetName === 'string' ? sheetName.trim() : '';
    const effectiveSheetName = requestedSheetName && availableSheetNames.includes(requestedSheetName)
      ? requestedSheetName
      : availableSheetNames[0];
    
    // Load all sheet tabs so multi-sheet workbooks are represented correctly.
    const allSheetsData = await Promise.all(
      availableSheetNames.map((currentSheetName) =>
        sheetsService.readSheetData(spreadsheetId, currentSheetName, range)
      )
    );

    const luckysheetData = allSheetsData.map((singleSheetData, index) => {
      const converted = sheetsService.convertSheetsToLuckysheetData(singleSheetData);
      return {
        ...converted,
        order: index,
        status: singleSheetData.properties.title === effectiveSheetName ? 1 : 0,
      };
    });
    
    return NextResponse.json({ 
      spreadsheetInfo,
      sheetData: luckysheetData,
      activeSheetName: effectiveSheetName
    });
  } catch (error: any) {
    console.error('Error getting sheet data:', error);
    const statusCode = Number(error?.status_code || error?.response?.status || 500);
    return NextResponse.json({ 
      error: 'Failed to get sheet data', 
      details: error?.message,
      code: error?.code,
      status_code: statusCode
    }, { status: statusCode });
  }
}