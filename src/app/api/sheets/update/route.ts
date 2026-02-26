import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import * as cookie from 'cookie';
import { GoogleSheetsService } from '../../../../lib/googleSheets';
import { getUserConfig } from '../../../../config/users';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, spreadsheetId, updates } = body;

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

    if (!updates || !Array.isArray(updates)) {
      return NextResponse.json({ error: 'Updates array is required' }, { status: 400 });
    }

    const sheetsService = new GoogleSheetsService();
    
    // Process updates
    await sheetsService.updateValues(spreadsheetId, updates);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating sheet:', error);
    return NextResponse.json({ error: 'Failed to update sheet' }, { status: 500 });
  }
}