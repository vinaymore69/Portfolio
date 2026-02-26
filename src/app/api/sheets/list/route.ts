import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import * as cookie from 'cookie';
import { GoogleSheetsService } from '../../../../lib/googleSheets';
import { getUserConfig } from '../../../../config/users';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username } = body;

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

    const sheetsService = new GoogleSheetsService();
    
    // Get spreadsheets from user's folder
    const folderSpreadsheets = await sheetsService.getSpreadsheetsList(userConfig.folderId);
    
    // Get user-specific spreadsheets if configured
    const userSpreadsheets = [];
    if (userConfig.spreadsheetIds && userConfig.spreadsheetIds.length > 0) {
      for (const spreadsheetId of userConfig.spreadsheetIds) {
        try {
          const info = await sheetsService.getSpreadsheetInfo(spreadsheetId);
          userSpreadsheets.push({
            id: spreadsheetId,
            name: info.title || 'Untitled Spreadsheet',
            modifiedTime: new Date().toISOString(), // We don't have modification time from Sheets API
            source: 'direct' // Mark as directly configured
          });
        } catch (error) {
          console.error(`Error getting info for spreadsheet ${spreadsheetId}:`, error);
        }
      }
    }
    
    // Combine and deduplicate spreadsheets
    const allSpreadsheets = [
      ...userSpreadsheets,
      ...folderSpreadsheets.map(sheet => ({ ...sheet, source: 'folder' }))
    ];
    
    // Remove duplicates based on ID
    const uniqueSpreadsheets = allSpreadsheets.filter((sheet, index, self) => 
      index === self.findIndex(s => s.id === sheet.id)
    );
    
    return NextResponse.json({ spreadsheets: uniqueSpreadsheets });
  } catch (error) {
    console.error('Error listing spreadsheets:', error);
    return NextResponse.json({ error: 'Failed to list spreadsheets' }, { status: 500 });
  }
}