// Configuration for user portals
// In production, store this data in a secure database
// This is a simplified example using a JSON configuration

export interface UserConfig {
  username: string;
  passwordHash: string;
  folderId: string;
  displayName?: string;
  spreadsheetIds?: string[]; // Array of Google Sheets IDs shared with the service account
}

export const users: UserConfig[] = [
  // Example users - Replace with your actual users
  {
    username: "vinay69",
    passwordHash: "$2b$12$u0QUm3JxKqXivH183o.OCOP98CW7sVz1vnlOlxjha6eFmSBZD65R6", // "vinay123" 
    folderId: "1XRyBHfUZEflGd_JsJDPnYUcQutQ3usp3", // Replace with actual folder ID
    displayName: "Vinay More",
    spreadsheetIds: ["1057MdIFd-8CSOqJbWc1WTt64oru64JAqByNO366TYfA"] // The spreadsheet ID you provided
  },
  {
    username: "muthusam_mvt",
    passwordHash: "$2b$12$zznKeY6gWK2IU6JWdG0apuEG8VtDLs/PAhkp38gzMboR5UWRoKCuW", // 
    folderId: "1gxdDqkuB5c_cwtQVoK1ZJijpoDzsqUBc", // Replace with actual folder ID  
    displayName: "Muthusam Thevar"
  },
  {
    username: "akanksha",
    passwordHash: "$2b$12$z5yhbcSrOUzBPnXvNnGZLOVXzLCAYE6QhjgJ8po7o6fPq9WKVVPGi", // 
    folderId: "1SuEwI9S6vykk5l__8e-9bTGHjDBDk5tg", // Replace with actual folder ID  
    displayName: "Akanksha Thorat"
  },{
    username: "pushkar",
    passwordHash: "$2b$12$BCif6l5bPreV1WVS2eVRY.vx3WzsSVOKMGcUMp5wxPM79VDycGi1O", // "pushkar123"
    folderId: "1vy1Shu5x1Mxr3tZEgfBixBF-VgrnMqY6", // Replace with actual folder ID  
    displayName: "Pushkar More"
  },{
    username: "sangee12",
    passwordHash: "$2b$12$3GGXA9j2uCx1LDx6uQXlJe6Rquvx7dAP6Vrnq2Xhj8k466roKbBxu", // "satyarth123"
    folderId: "1-HNzoFsORBBn2bZgYu9Z6o6VjyepKmwh", // Replace with actual folder ID  
    displayName: "Sangeeta Shirsat"
  }
  // Add more users as needed
];

export function getUserConfig(username: string): UserConfig | null {
  return users.find(user => user.username.toLowerCase() === username.toLowerCase()) || null;
}

export function validateUser(username: string, password: string): Promise<boolean> {
  const bcrypt = require('bcryptjs');
  const user = getUserConfig(username);
  
  if (!user) {
    return Promise.resolve(false);
  }
  
  return bcrypt.compare(password, user.passwordHash);
}

// Helper function to generate password hashes for new users
// Use this in a separate script to generate hashes for your passwords
export async function generatePasswordHash(password: string): Promise<string> {
  const bcrypt = require('bcryptjs');
  return bcrypt.hash(password, 12);
}

// Google Service Account configuration
// Load directly from the JSON key file (already in project root)
let serviceAccountJson: any = null;
try {
  serviceAccountJson = require('../../vinaymore69-portfolio-a009c477bec9.json');
} catch {
  // Fall back to environment variables if file not found
}

export const serviceAccountConfig = serviceAccountJson ?? {
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

// Validate that all required environment variables are set
export function validateServiceAccountConfig(): boolean {
  // If loaded from JSON file directly, it's always valid
  if (serviceAccountJson) return true;
  
  const requiredVars = [
    'GOOGLE_PROJECT_ID',
    'GOOGLE_PRIVATE_KEY_ID', 
    'GOOGLE_PRIVATE_KEY',
    'GOOGLE_CLIENT_EMAIL',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_CERT_URL'
  ];
  
  return requiredVars.every(varName => process.env[varName]);
}