import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { getUserConfig } from '../../../../config/users';

export const runtime = 'nodejs';

// Helper to authenticate Google Drive
async function getDriveClient() {
  // TODO: Replace with your Google service account credentials logic
  // Example: load credentials from a JSON file or env
  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEYFILE || 'vinaymore69-portfolio-a009c477bec9.json',
    scopes: ['https://www.googleapis.com/auth/drive'],
  });
  return google.drive({ version: 'v3', auth });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const username = formData.get('username');
    const folderId = formData.get('folderId');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!username || typeof username !== 'string') {
      return NextResponse.json({ error: 'Username required' }, { status: 400 });
    }

    // Get user config to find their root folder ID
    let userConfig;
    try {
      userConfig = getUserConfig(username);
      console.log('getUserConfig result:', userConfig);
    } catch (importError) {
      console.error('getUserConfig import error:', importError);
      const details = importError instanceof Error ? importError.message : String(importError);
      return NextResponse.json({ error: 'Config import failed', details }, { status: 500 });
    }
    
    if (!userConfig) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Use provided folderId or fall back to user's root folder
    const targetFolderId = (folderId && typeof folderId === 'string') ? folderId : userConfig.folderId;

    // Debug logging
    console.log('Upload Debug Info:');
    console.log('- Username:', username);
    console.log('- Provided folderId:', folderId);
    console.log('- User root folderId:', userConfig.folderId); 
    console.log('- Target folderId being used:', targetFolderId);
    console.log('- Is targetFolderId valid?:', !!targetFolderId);
    
    // TEMPORARY: Force use specific folder ID for testing
    const TEMP_FOLDER_ID = '1XRyBHfUZEflGd_JsJDPnYUcQutQ3usp3';
    const finalFolderId = TEMP_FOLDER_ID; // Force use the shared folder ID
    console.log('- FORCED folderId for testing:', finalFolderId);

    // Validate folder ID exists
    if (!finalFolderId) {
      return NextResponse.json({ error: 'No folder ID available for upload' }, { status: 400 });
    }

    // Prepare upload
    const drive = await getDriveClient();
    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = file.type || 'application/octet-stream';
    const fileName = file.name || 'uploaded-file';

    // Convert buffer to readable stream
    const { Readable } = require('stream');
    const stream = Readable.from(buffer);

    console.log('About to upload with parents:', [finalFolderId]);

    // Upload to Drive with proper folder ID
    const uploadRes = await drive.files.create({
      requestBody: {
        name: fileName,
        parents: [finalFolderId], // Always use a specific folder ID
      },
      media: {
        mimeType,
        body: stream,
      },
      fields: 'id,name',
    });

    return NextResponse.json({ success: true, file: uploadRes.data });
  } catch (err) {
    let errorMessage = 'Unknown error';
    let errorStack = '';
    if (err instanceof Error) {
      errorMessage = err.message;
      errorStack = err.stack || '';
    } else if (typeof err === 'string') {
      errorMessage = err;
    }
    return NextResponse.json({ error: 'Upload failed', details: errorMessage, stack: errorStack }, { status: 500 });
  }
}
