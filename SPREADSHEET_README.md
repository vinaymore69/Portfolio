# Spreadsheet Integration (Luckysheet + Google Sheets)

This application integrates Luckysheet as a frontend spreadsheet UI with Google Sheets as the backend data store.

## Features

- **Luckysheet Frontend**: Full-featured spreadsheet interface with editing, formatting, and cell operations
- **Google Sheets Backend**: All data is stored in Google Sheets via Service Account authentication
- **Multi-user Support**: Each user has access to their own spreadsheets without exposing Google Sheets directly
- **Real-time Editing**: Edit cells, apply formatting, merge/unmerge cells, and change background colors
- **Save Functionality**: Save all changes back to Google Sheets with a single click

## How It Works

### Architecture

1. **Frontend**: Luckysheet provides the spreadsheet interface
2. **Backend APIs**: Next.js API routes handle Google Sheets operations
3. **Authentication**: Uses existing user portal authentication system
4. **Data Flow**: Luckysheet ↔ API Routes ↔ Google Sheets API

### API Endpoints

- `POST /api/sheets/list` - Get list of spreadsheets for authenticated user
- `POST /api/sheets/data` - Load spreadsheet data into Luckysheet format
- `POST /api/sheets/update` - Save cell values and ranges to Google Sheets
- `POST /api/sheets/merge` - Handle cell merge/unmerge operations

### User Access Levels

#### Folder-based Access
Users can access spreadsheets from their configured Google Drive folder:
```typescript
{
  username: "user123",
  folderId: "1XRyBHfUZEflGd_JsJDPnYUcQutQ3usp3", // Google Drive folder ID
  // ... other config
}
```

#### Direct Spreadsheet Access
Users can have specific spreadsheets assigned directly:
```typescript
{
  username: "user123",
  spreadsheetIds: ["1057MdIFd-8CSOqJbWc1WTt64oru64JAqByNO366TYfA"], // Direct sheet IDs
  // ... other config
}
```

## Setup Instructions

### 1. Google Service Account Setup

Ensure your Google Service Account has access to:
- Google Sheets API
- Google Drive API (for folder-based access)

The service account email must be shared with any spreadsheets you want to access directly.

### 2. Environment Variables

Make sure these are set in your `.env.local`:
```bash
GOOGLE_PROJECT_ID=your-project-id
GOOGLE_PRIVATE_KEY_ID=your-private-key-id
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/your-service-account%40project.iam.gserviceaccount.com
```

### 3. User Configuration

Add spreadsheet access to users in `src/config/users.ts`:

```typescript
{
  username: "vinay69",
  passwordHash: "...",
  folderId: "1XRyBHfUZEflGd_JsJDPnYUcQutQ3usp3",
  displayName: "Vinay More",
  spreadsheetIds: ["1057MdIFd-8CSOqJbWc1WTt64oru64JAqByNO366TYfA"] // Optional direct access
}
```

### 4. Luckysheet Assets

The Luckysheet assets are automatically copied to `/public/luckysheet/` during `npm install` via the `postinstall` script. You can also run:

```bash
npm run copy-luckysheet
```

## Usage

### Accessing Spreadsheets

1. Login to your user portal: `yoursite.com/username`
2. Click the "Spreadsheets" button in the toolbar
3. Select a spreadsheet from the list
4. Edit the spreadsheet using the Luckysheet interface
5. Click "Save Changes" to update the Google Sheet

### URL Structure

- Spreadsheet list: `yoursite.com/username/sheet`
- Specific spreadsheet: `yoursite.com/username/sheet/SPREADSHEET_ID`

### Example URLs

For user "vinay69":
- Portal: `vinaymore69.tech/vinay69`
- Spreadsheets: `vinaymore69.tech/vinay69/sheet`
- Specific sheet: `vinaymore69.tech/vinay69/sheet/1057MdIFd-8CSOqJbWc1WTt64oru64JAqByNO366TYfA`

## Supported Operations

### Cell Operations
- ✅ Edit cell values
- ✅ Cell formatting (bold, italic, etc.)
- ✅ Background colors
- ✅ Text alignment
- ✅ Number formatting

### Range Operations
- ✅ Copy/paste ranges
- ✅ Merge/unmerge cells
- ✅ Multi-cell selection
- ✅ Fill operations

### Sheet Operations
- ✅ Save all changes to Google Sheets
- ✅ Load existing Google Sheets data
- ✅ Real-time editing

## Technical Details

### Data Conversion

The application converts between Luckysheet's internal format and Google Sheets format:

- **Loading**: Google Sheets → Luckysheet format
- **Saving**: Luckysheet format → Google Sheets batch updates

### Performance Optimizations

- Batch updates for better performance
- Efficient range operations
- Minimal API calls during editing
- Save-on-demand rather than real-time sync

### Security

- Service Account authentication (no OAuth)
- User-level access controls
- No direct Google Sheets exposure to users
- Existing portal authentication system

## Troubleshooting

### Common Issues

1. **Spreadsheet not loading**: Ensure the service account email is shared with the spreadsheet
2. **Save failing**: Check Google Sheets API permissions and quotas
3. **Luckysheet not rendering**: Verify assets are copied to `/public/luckysheet/`
4. **Authentication errors**: Check environment variables and service account configuration

### Debug Mode

Enable debug logging by adding to your component:
```javascript
console.log('Luckysheet data:', luckysheet.getluckysheetfile());
```

## Future Enhancements

Possible improvements:
- Real-time collaboration (multiple users)
- Version history integration
- Advanced formula support
- Chart and pivot table support
- Mobile responsive improvements
- Offline editing capabilities