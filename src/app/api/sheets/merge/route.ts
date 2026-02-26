import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import * as cookie from 'cookie';
import { GoogleSheetsService } from '../../../../lib/googleSheets';
import { getUserConfig } from '../../../../config/users';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, spreadsheetId, operation, mergeRequest } = body;

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

    if (!operation || (operation !== 'merge' && operation !== 'unmerge')) {
      return NextResponse.json({ error: 'Valid operation (merge/unmerge) is required' }, { status: 400 });
    }

    if (!mergeRequest) {
      return NextResponse.json({ error: 'Merge request data is required' }, { status: 400 });
    }

    const sheetsService = new GoogleSheetsService();
    
    if (operation === 'merge') {
      await sheetsService.mergeCells(spreadsheetId, mergeRequest);
    } else {
      await sheetsService.unmergeCells(
        spreadsheetId,
        mergeRequest.sheetId,
        mergeRequest.startRowIndex,
        mergeRequest.endRowIndex,
        mergeRequest.startColumnIndex,
        mergeRequest.endColumnIndex
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error with merge operation:', error);
    return NextResponse.json({ error: 'Failed to perform merge operation' }, { status: 500 });
  }
}