/**
 * Password Hash Generator Utility
 * 
 * Use this script to generate bcrypt hashes for user passwords
 * Run with: node scripts/generate-password-hash.js
 */

const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function generatePasswordHash() {
  try {
    console.log('\n🔐 Password Hash Generator');
    console.log('============================\n');

    rl.question('Enter the username: ', (username) => {
      rl.question('Enter the password: ', async (password) => {
        try {
          console.log('\nGenerating hash...');
          
          const hash = await bcrypt.hash(password, 12);
          
          console.log('\n✅ Generated Configuration:');
          console.log('============================');
          console.log(`Username: ${username}`);
          console.log(`Password: ${password}`);
          console.log(`Hash: ${hash}`);
          
          console.log('\n📋 Add this to your users.ts file:');
          console.log('====================================');
          console.log(`{`);
          console.log(`  username: "${username}",`);
          console.log(`  passwordHash: "${hash}",`);
          console.log(`  folderId: "YOUR_GOOGLE_DRIVE_FOLDER_ID_HERE",`);
          console.log(`  displayName: "Display Name Here"`);
          console.log(`},`);
          
          console.log('\n🔗 Don\'t forget to:');
          console.log('- Get the Google Drive folder ID');
          console.log('- Share the folder with your service account email');
          console.log('- Add the user configuration to src/config/users.ts');
          
        } catch (error) {
          console.error('Error generating hash:', error);
        }
        
        rl.close();
      });
    });

  } catch (error) {
    console.error('Error:', error);
    rl.close();
  }
}

// Test password verification
async function testPassword(password, hash) {
  const isValid = await bcrypt.compare(password, hash);
  console.log(`Password "${password}" is ${isValid ? 'valid' : 'invalid'}`);
}

// Run the generator
generatePasswordHash();