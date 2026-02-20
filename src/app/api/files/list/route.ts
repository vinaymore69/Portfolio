import { NextRequest, NextResponse } from "next/server";
import * as cookie from "cookie";
import jwt from "jsonwebtoken";
import { GoogleDriveService } from '../../../../lib/googleDrive';
import { getUserConfig } from '../../../../config/users';

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, folderId: requestedFolderId } = body;

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
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

    // Initialize Google Drive service and list files
    try {
      const driveService = new GoogleDriveService();

      // Use requested subfolder ID if provided, otherwise use user's root folder ID
      const targetFolderId = requestedFolderId || userConfig.folderId;

      // Only verify root folder access (skip for subfolders — service account access is inherited)
      if (!requestedFolderId) {
        const hasAccess = await driveService.verifyFolderAccess(targetFolderId);
        if (!hasAccess) {
          return NextResponse.json({ 
            error: "Cannot access your Google Drive folder. Please ensure the folder is properly shared with the service account.",
            details: "Folder access verification failed"
          }, { status: 403 });
        }
      }

      const files = await driveService.listFiles(targetFolderId);
      
      return NextResponse.json({ 
        success: true,
        files,
        folderInfo: {
          folderId: targetFolderId,
          username: userConfig.username
        }
      }, { status: 200 });

    } catch (driveError: any) {
      console.error('Google Drive error:', driveError);
      
      if (driveError.message?.includes('not found')) {
        return NextResponse.json({ 
          error: "Google Drive folder not found or not accessible",
          details: "Please check if the folder ID is correct and properly shared with the service account"
        }, { status: 404 });
      }
      
      if (driveError.message?.includes('permission')) {
        return NextResponse.json({ 
          error: "Permission denied to access Google Drive folder",
          details: "Please ensure the folder is shared with the service account email"
        }, { status: 403 });
      }

      return NextResponse.json({ 
        error: "Failed to retrieve files from Google Drive",
        details: driveError.message || "Unknown error occurred"
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('File listing error:', error);
    return NextResponse.json({ 
      error: "Internal server error",
      details: error.message || "Unknown error occurred"
    }, { status: 500 });
  }
}