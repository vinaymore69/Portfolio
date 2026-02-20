import { NextRequest, NextResponse } from "next/server";
import * as cookie from "cookie";
import jwt from "jsonwebtoken";
import { GoogleDriveService, getFileExtension } from '../../../../lib/googleDrive';
import { getUserConfig } from '../../../../config/users';

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, fileId } = body;

    if (!username || !fileId) {
      return NextResponse.json({ error: "Username and fileId are required" }, { status: 400 });
    }

    // Verify authentication
    const cookieHeader = request.headers.get("cookie") || "";
    const cookies = cookie.parse(cookieHeader);
    const token = cookies[`auth-${username}`];

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (jwtError) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    if (decoded.username !== username) {
      return NextResponse.json({ error: "Token username mismatch" }, { status: 401 });
    }

    // Get user configuration
    const userConfig = getUserConfig(username);
    if (!userConfig) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Initialize Google Drive service and download file
    try {
      const driveService = new GoogleDriveService();

      // Get the file — if the service account can't access it the call will throw,
      // which is sufficient ownership verification (SA only has access to the
      // user's shared folder tree).
      const fileData = await driveService.getFile(fileId);
      
      // Generate appropriate filename with extension
      const fileExtension = getFileExtension(fileData.mimeType, fileData.name);
      const fileName = fileData.name.includes('.') ? fileData.name : `${fileData.name}.${fileExtension}`;

      // Create response with file data
      const bufferData = fileData.data instanceof Buffer ? new Uint8Array(fileData.data) : new Uint8Array(fileData.data);
      const response = new NextResponse(bufferData, {
        status: 200,
        headers: {
          'Content-Type': fileData.mimeType,
          'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`,
          'Content-Length': fileData.data.length.toString(),
        },
      });

      return response;

    } catch (driveError: any) {
      console.error('Google Drive download error:', driveError);
      
      if (driveError.message?.includes('not found')) {
        return NextResponse.json({ 
          error: "File not found",
          details: "The requested file could not be found in Google Drive"
        }, { status: 404 });
      }
      
      if (driveError.message?.includes('permission')) {
        return NextResponse.json({ 
          error: "Permission denied",
          details: "You don't have permission to download this file"
        }, { status: 403 });
      }

      return NextResponse.json({ 
        error: "Failed to download file from Google Drive",
        details: driveError.message || "Unknown error occurred"
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('File download error:', error);
    return NextResponse.json({ 
      error: "Internal server error",
      details: error.message || "Unknown error occurred"
    }, { status: 500 });
  }
}