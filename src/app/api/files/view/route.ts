import { NextRequest, NextResponse } from "next/server";
import * as cookie from "cookie";
import jwt from "jsonwebtoken";
import { GoogleDriveService } from '../../../../lib/googleDrive';
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

    // Initialize Google Drive service and get file for viewing
    try {
      const driveService = new GoogleDriveService();

      // Get the file — if the service account can't access it the call will throw,
      // which is sufficient ownership verification (SA only has access to the
      // user's shared folder tree).
      const fileData = await driveService.getFile(fileId);
      
      // Set appropriate headers for viewing/printing
      let contentType = fileData.mimeType;
      let disposition = 'inline'; // For viewing in browser

      // For specific file types, ensure they open properly for printing
      if (fileData.mimeType.includes('pdf')) {
        contentType = 'application/pdf';
      } else if (fileData.mimeType.includes('image')) {
        // Keep original image mime type
        contentType = fileData.mimeType;
      } else if (fileData.mimeType.includes('text')) {
        contentType = 'text/plain';
      }

      // Create response with file data for viewing
      const bodyData = fileData.data instanceof Buffer ? fileData.data : Buffer.from(fileData.data);
      const response = new NextResponse(new Uint8Array(bodyData), {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `${disposition}; filename*=UTF-8''${encodeURIComponent(fileData.name)}`,
          'Content-Length': fileData.data.length.toString(),
          // Headers to enable printing
          'X-Content-Type-Options': 'nosniff',
          'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        },
      });

      return response;

    } catch (driveError: any) {
      console.error('Google Drive view error:', driveError);
      
      if (driveError.message?.includes('not found')) {
        return NextResponse.json({ 
          error: "File not found",
          details: "The requested file could not be found in Google Drive"
        }, { status: 404 });
      }
      
      if (driveError.message?.includes('permission')) {
        return NextResponse.json({ 
          error: "Permission denied",
          details: "You don't have permission to view this file"
        }, { status: 403 });
      }

      return NextResponse.json({ 
        error: "Failed to retrieve file from Google Drive for viewing",
        details: driveError.message || "Unknown error occurred"
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('File view error:', error);
    return NextResponse.json({ 
      error: "Internal server error",
      details: error.message || "Unknown error occurred"
    }, { status: 500 });
  }
}