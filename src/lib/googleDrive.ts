import { google } from 'googleapis';
import { serviceAccountConfig, validateServiceAccountConfig } from '../config/users';

// Initialize Google Drive API with service account
function getDriveService() {
  if (!validateServiceAccountConfig()) {
    throw new Error('Google Service Account configuration is incomplete. Please check your environment variables.');
  }

  const auth = new google.auth.GoogleAuth({
    credentials: serviceAccountConfig,
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  });

  return google.drive({ version: 'v3', auth });
}

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  modifiedTime: string;
  webViewLink: string;
  webContentLink: string;
}

export class GoogleDriveService {
  private drive;

  constructor() {
    this.drive = getDriveService();
  }

  async listFiles(folderId: string): Promise<DriveFile[]> {
    try {
      const response = await this.drive.files.list({
        q: `'${folderId}' in parents and trashed = false`,
        fields: 'files(id,name,mimeType,size,modifiedTime,webViewLink,webContentLink)',
        orderBy: 'modifiedTime desc',
        pageSize: 100,
      });

      const files = response.data.files || [];
      
      return files.map(file => ({
        id: file.id!,
        name: file.name!,
        mimeType: file.mimeType!,
        size: parseInt(file.size || '0'),
        modifiedTime: file.modifiedTime!,
        webViewLink: file.webViewLink!,
        webContentLink: file.webContentLink!,
      }));
    } catch (error) {
      console.error('Error listing Drive files:', error);
      throw new Error('Failed to list files from Google Drive');
    }
  }

  async getFileContent(fileId: string): Promise<{ data: Buffer; mimeType: string; name: string }> {
    try {
      // First get file metadata
      const fileMetadata = await this.drive.files.get({
        fileId,
        fields: 'name,mimeType',
      });

      const fileName = fileMetadata.data.name!;
      const mimeType = fileMetadata.data.mimeType!;

      // Download file content
      const response = await this.drive.files.get({
        fileId,
        alt: 'media',
      }, { responseType: 'arraybuffer' });

      return {
        data: Buffer.from(response.data as ArrayBuffer),
        mimeType,
        name: fileName,
      };
    } catch (error) {
      console.error('Error downloading file from Drive:', error);
      throw new Error('Failed to download file from Google Drive');
    }
  }

  async exportGoogleFile(fileId: string, mimeType: string): Promise<{ data: Buffer; mimeType: string; name: string }> {
    try {
      // Get file metadata
      const fileMetadata = await this.drive.files.get({
        fileId,
        fields: 'name,mimeType',
      });

      const fileName = fileMetadata.data.name!;
      let exportMimeType = mimeType;

      // Determine export format for Google Workspace files
      const googleMimeTypes: { [key: string]: string } = {
        'application/vnd.google-apps.document': 'application/pdf',
        'application/vnd.google-apps.spreadsheet': 'application/pdf', 
        'application/vnd.google-apps.presentation': 'application/pdf',
        'application/vnd.google-apps.drawing': 'image/png',
      };

      if (fileMetadata.data.mimeType && googleMimeTypes[fileMetadata.data.mimeType]) {
        exportMimeType = googleMimeTypes[fileMetadata.data.mimeType];
      }

      // Export the file
      const response = await this.drive.files.export({
        fileId,
        mimeType: exportMimeType,
      }, { responseType: 'arraybuffer' });

      return {
        data: Buffer.from(response.data as ArrayBuffer),
        mimeType: exportMimeType,
        name: fileName,
      };
    } catch (error) {
      console.error('Error exporting Google file:', error);
      throw new Error('Failed to export Google file');
    }
  }

  async getFile(fileId: string): Promise<{ data: Buffer; mimeType: string; name: string }> {
    try {
      // First get file metadata to determine if it's a Google Workspace file
      const fileMetadata = await this.drive.files.get({
        fileId,
        fields: 'name,mimeType',
      });

      const mimeType = fileMetadata.data.mimeType!;

      // Check if it's a Google Workspace file that needs to be exported
      const googleWorkspaceTypes = [
        'application/vnd.google-apps.document',
        'application/vnd.google-apps.spreadsheet',
        'application/vnd.google-apps.presentation',
        'application/vnd.google-apps.drawing',
      ];

      if (googleWorkspaceTypes.includes(mimeType)) {
        return await this.exportGoogleFile(fileId, mimeType);
      } else {
        return await this.getFileContent(fileId);
      }
    } catch (error) {
      console.error('Error getting file:', error);
      throw new Error('Failed to get file from Google Drive');
    }
  }

  // Verify folder access
  async verifyFolderAccess(folderId: string): Promise<boolean> {
    try {
      await this.drive.files.get({
        fileId: folderId,
        fields: 'id,name,mimeType',
      });
      return true;
    } catch (error) {
      console.error('Error verifying folder access:', error);
      return false;
    }
  }
}

// Utility function to get MIME type for file downloads
export function getDownloadMimeType(originalMimeType: string): string {
  const mimeTypeMap: { [key: string]: string } = {
    'application/vnd.google-apps.document': 'application/pdf',
    'application/vnd.google-apps.spreadsheet': 'application/pdf',
    'application/vnd.google-apps.presentation': 'application/pdf',
    'application/vnd.google-apps.drawing': 'image/png',
  };

  return mimeTypeMap[originalMimeType] || originalMimeType;
}

// Utility function to get file extension
export function getFileExtension(mimeType: string, originalName: string): string {
  // Try to get extension from original filename first
  const match = originalName.match(/\.([^.]+)$/);
  if (match) {
    return match[1];
  }

  // Fallback to MIME type mapping
  const extensionMap: { [key: string]: string } = {
    'application/pdf': 'pdf',
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/msword': 'doc',
    'text/plain': 'txt',
  };

  return extensionMap[mimeType] || 'bin';
}