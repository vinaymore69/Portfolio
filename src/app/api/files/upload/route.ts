import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { getUserConfig } from '../../../../config/users';
import { Readable } from 'stream';

export const runtime = 'nodejs';

async function getDriveClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    },
    keyFile: process.env.GOOGLE_CLIENT_EMAIL
      ? undefined
      : 'vinaymore69-portfolio-a009c477bec9.json',
    scopes: ['https://www.googleapis.com/auth/drive.file'],
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

    const userConfig = getUserConfig(username);
    if (!userConfig) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const finalFolderId =
      folderId && typeof folderId === 'string' ? folderId : userConfig.folderId;

    if (!finalFolderId) {
      return NextResponse.json({ error: 'No folder ID configured for this user.' }, { status: 400 });
    }

    const drive = await getDriveClient();
    const buffer = Buffer.from(await file.arrayBuffer());
    const stream = Readable.from(buffer);

    console.log('Uploading', file.name, 'to folder:', finalFolderId);

    const uploadRes = await drive.files.create({
      requestBody: {
        name: file.name,
        parents: [finalFolderId],
      },
      media: {
        mimeType: file.type || 'application/octet-stream',
        body: stream,
      },
      supportsAllDrives: true,
      fields: 'id,name',
    });

    return NextResponse.json({ success: true, file: uploadRes.data });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    const errorStack = err instanceof Error ? (err.stack || '') : '';
    return NextResponse.json(
      { error: 'Upload failed', details: errorMessage, stack: errorStack },
      { status: 500 }
    );
  }
}
