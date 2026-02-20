/**
 * Google Drive Folder Access Test
 * 
 * Use this script to test if your service account can access a Google Drive folder
 * Run with: node scripts/test-drive-access.js
 */

require('dotenv').config({ path: '.env.local' });

const { google } = require('googleapis');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Service account configuration
const serviceAccountConfig = {
  type: "service_account",
  project_id: process.env.GOOGLE_PROJECT_ID,
  private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
  private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  client_id: process.env.GOOGLE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL,
  universe_domain: "googleapis.com"
};

function validateConfig() {
  const requiredVars = [
    'GOOGLE_PROJECT_ID',
    'GOOGLE_PRIVATE_KEY_ID', 
    'GOOGLE_PRIVATE_KEY',
    'GOOGLE_CLIENT_EMAIL',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_CERT_URL'
  ];
  
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.log('❌ Missing environment variables:');
    missing.forEach(varName => console.log(`   - ${varName}`));
    console.log('\nPlease check your .env.local file');
    return false;
  }
  
  return true;
}

function getDriveService() {
  const auth = new google.auth.GoogleAuth({
    credentials: serviceAccountConfig,
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  });

  return google.drive({ version: 'v3', auth });
}

async function testFolderAccess(folderId) {
  try {
    console.log(`\n🔍 Testing access to folder: ${folderId}`);
    
    const drive = getDriveService();
    
    // Test 1: Get folder metadata
    console.log('1. Getting folder metadata...');
    const folderResponse = await drive.files.get({
      fileId: folderId,
      fields: 'id,name,mimeType,owners,permissions',
    });
    
    console.log(`   ✅ Folder name: "${folderResponse.data.name}"`);
    console.log(`   ✅ Folder ID: ${folderResponse.data.id}`);
    
    // Test 2: List files in folder
    console.log('\n2. Listing files in folder...');
    const filesResponse = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'files(id,name,mimeType,size,modifiedTime)',
      orderBy: 'modifiedTime desc',
      pageSize: 10,
    });
    
    const files = filesResponse.data.files || [];
    console.log(`   ✅ Found ${files.length} files`);
    
    if (files.length > 0) {
      console.log('\n   📁 Files in folder:');
      files.forEach((file, index) => {
        const size = file.size ? `(${Math.round(parseInt(file.size) / 1024)}KB)` : '';
        console.log(`   ${index + 1}. ${file.name} ${size}`);
      });
    } else {
      console.log('   ⚠️  Folder appears to be empty');
    }
    
    // Test 3: Try to download a file if available
    if (files.length > 0) {
      console.log('\n3. Testing file download access...');
      try {
        const testFile = files[0];
        await drive.files.get({
          fileId: testFile.id,
          alt: 'media',
        }, { responseType: 'stream' });
        console.log(`   ✅ Can download files (tested: ${testFile.name})`);
      } catch (downloadError) {
        console.log(`   ❌ Cannot download files: ${downloadError.message}`);
      }
    }
    
    console.log('\n🎉 Success! The service account can access this folder.');
    console.log('\n📋 Summary:');
    console.log(`   - Folder ID: ${folderId}`);
    console.log(`   - Folder Name: ${folderResponse.data.name}`);
    console.log(`   - Files Count: ${files.length}`);
    console.log(`   - Service Account Email: ${process.env.GOOGLE_CLIENT_EMAIL}`);
    
    return true;
    
  } catch (error) {
    console.log('\n❌ Failed to access folder');
    
    if (error.code === 404) {
      console.log('   Reason: Folder not found or not shared with service account');
      console.log('   Solution: Make sure the folder ID is correct and shared with:');
      console.log(`   ${process.env.GOOGLE_CLIENT_EMAIL}`);
    } else if (error.code === 403) {
      console.log('   Reason: Permission denied');
      console.log('   Solution: Share the folder with the service account email:');
      console.log(`   ${process.env.GOOGLE_CLIENT_EMAIL}`);
    } else {
      console.log(`   Error: ${error.message}`);
    }
    
    return false;
  }
}

async function main() {
  console.log('🔍 Google Drive Folder Access Tester');
  console.log('====================================\n');
  
  // Validate configuration
  if (!validateConfig()) {
    rl.close();
    return;
  }
  
  console.log('✅ Environment variables are configured');
  console.log(`✅ Service account email: ${process.env.GOOGLE_CLIENT_EMAIL}\n`);
  
  rl.question('Enter Google Drive folder ID to test: ', async (folderId) => {
    if (!folderId.trim()) {
      console.log('❌ Please enter a valid folder ID');
      rl.close();
      return;
    }
    
    await testFolderAccess(folderId.trim());
    
    console.log('\n💡 How to get folder ID:');
    console.log('1. Open Google Drive in browser');
    console.log('2. Navigate to your folder');
    console.log('3. Copy the ID from the URL: https://drive.google.com/drive/folders/FOLDER_ID_HERE');
    
    console.log('\n💡 How to share folder with service account:');
    console.log('1. Right-click the folder > Share');
    console.log(`2. Add this email: ${process.env.GOOGLE_CLIENT_EMAIL}`);
    console.log('3. Set permissions to Viewer or Editor');
    
    rl.close();
  });
}

main().catch(console.error);