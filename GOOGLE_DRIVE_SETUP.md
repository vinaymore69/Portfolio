# Google Drive Portal Setup Guide

## Overview

This system creates individual password-protected portals for users to access files from their own Google Drive folders. Each user gets a unique URL like `https://yourdomain.com/username` where they can login and manage their files.

## 🚀 Quick Start

### 1. Prerequisites

- Node.js 18+ installed
- A Google Cloud project with Drive API enabled
- Google Service Account with credentials
- Users' Google Drive folders shared with the Service Account

### 2. Installation

```bash
# Install dependencies (already done)
npm install

# Copy environment template
cp .env.example .env.local

# Configure your environment variables (see below)
```

### 3. Configure Environment Variables

Edit `.env.local` with your actual values:

```env
JWT_SECRET=your-super-secure-jwt-secret-key-here
GOOGLE_PROJECT_ID=your-google-project-id
GOOGLE_PRIVATE_KEY_ID=your-private-key-id
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----"
GOOGLE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/your-service-account%40your-project.iam.gserviceaccount.com
```

### 4. Configure Users

Edit `src/config/users.ts` to add your users:

```typescript
export const users: UserConfig[] = [
  {
    username: "vinay",
    passwordHash: "$2a$12$LQv3c1yqBwEHFGwh/khNr.xbRDiOWGD1Oy5Kl64nGJfHQZGV0YQEa", // "vinay123"
    folderId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
    displayName: "Vinay More"
  }
  // Add more users...
];
```

### 5. Start the Application

```bash
npm run dev
```

Visit `http://localhost:3000/vinay` to test the portal.

## 🔧 Detailed Configuration

### Google Service Account Setup

1. **Create Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one

2. **Enable Drive API**
   - Go to APIs & Services > Library
   - Search for "Google Drive API"
   - Click "Enable"

3. **Create Service Account**
   - Go to APIs & Services > Credentials
   - Click "Create Credentials" > "Service Account"
   - Fill in the details and create
   - Download the JSON key file

4. **Extract Credentials**
   From the JSON file, extract these values for your `.env.local`:
   ```json
   {
     "project_id": "your-project-id",
     "private_key_id": "key-id-here",
     "private_key": "-----BEGIN PRIVATE KEY-----\n...",
     "client_email": "service-account@project.iam.gserviceaccount.com",
     "client_id": "123456789",
     "client_x509_cert_url": "https://www.googleapis.com/..."
   }
   ```

### User Configuration

#### Adding New Users

1. **Generate Password Hash**
   ```javascript
   // Run this in Node.js to generate password hashes
   const bcrypt = require('bcryptjs');
   bcrypt.hash('user-password', 12).then(hash => console.log(hash));
   ```

2. **Get Google Drive Folder ID**
   - Create or navigate to the folder in Google Drive
   - The folder ID is in the URL: `https://drive.google.com/drive/folders/FOLDER_ID_HERE`

3. **Share Folder with Service Account**
   - Right-click the folder > Share
   - Add the service account email (from `client_email`)
   - Grant "Editor" or "Viewer" access

4. **Add to Configuration**
   ```typescript
   {
     username: "newuser",
     passwordHash: "generated-hash-here",
     folderId: "google-drive-folder-id",
     displayName: "New User Name"
   }
   ```

### Security Considerations

- **JWT Secret**: Use a strong, random JWT secret (at least 32 characters)
- **Environment Variables**: Never commit `.env.local` to version control
- **Service Account**: Limit service account permissions to only necessary scopes
- **Folder Access**: Regularly audit folder sharing permissions

### File Type Support

The portal automatically handles:
- **PDF files**: Direct download and view
- **Images**: JPG, PNG, GIF support
- **Microsoft Office**: Word, Excel, PowerPoint files
- **Google Workspace**: Docs, Sheets, Slides (auto-converted to PDF)
- **Text files**: Plain text documents

### User Experience

Each user portal provides:
- 🔐 **Password-protected access**
- 📋 **File listing with metadata** (size, date modified)
- ⬇️ **Direct download** for all files
- 🖨️ **Print functionality** (opens in new window)
- 🔄 **Refresh files** button
- 🚪 **Secure logout**

## 🐛 Troubleshooting

### Common Issues

1. **"Service Account configuration is incomplete"**
   - Check all environment variables are set correctly
   - Ensure private key format includes `\\n` line breaks

2. **"Cannot access your Google Drive folder"**
   - Verify folder ID is correct
   - Confirm folder is shared with service account email
   - Check service account has Drive API access

3. **"Authentication failed"**
   - Verify username exists in configuration
   - Check password hash is generated correctly
   - Ensure JWT_SECRET is set

4. **Files not loading**
   - Confirm folder contains files
   - Check folder permissions
   - Verify service account can access the folder

### Testing Folder Access

You can test if a folder is accessible by the service account:

```bash
# In the browser console on your portal page
fetch('/api/files/list', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'your-username' })
})
.then(r => r.json())
.then(console.log);
```

## 📁 File Structure

```
src/
├── app/
│   ├── [username]/               # Dynamic user routes
│   │   ├── page.tsx             # User portal UI
│   │   └── user-portal.module.scss
│   └── api/                     # API endpoints
│       ├── authenticate/        # Login verification
│       ├── check-auth/         # Auth status check
│       └── files/              # File operations
│           ├── list/           # List folder files
│           ├── download/       # Download files
│           └── view/           # View/print files
├── config/
│   └── users.ts                # User configuration
└── lib/
    └── googleDrive.ts          # Google Drive integration
```

## 🔄 Updates and Maintenance

### Adding New Users
1. Generate password hash
2. Get folder ID and share with service account
3. Add to `src/config/users.ts`
4. Restart application

### Updating Passwords
1. Generate new hash with bcrypt
2. Update hash in `src/config/users.ts`
3. Restart application

### Monitoring
- Check server logs for authentication attempts
- Monitor Google Drive API quotas
- Regularly review folder sharing permissions

## 🚀 Production Deployment

### Vercel Deployment

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Environment Variables in Vercel
- Add all variables from `.env.local`
- Ensure `NODE_ENV=production`
- Set up domain and SSL

### Domain Configuration
- Set up custom domain in Vercel
- Configure DNS records
- Test HTTPS certificates

That's it! Your Google Drive Portal should now be fully functional with secure, per-user access to Google Drive folders.