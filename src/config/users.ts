import { supabaseAdmin } from '../lib/supabaseServer';

export interface UserConfig {
  id?: string;
  username: string;
  passwordHash?: string;
  folderId: string;
  displayName?: string;
  spreadsheetIds?: string[]; // Array of Google Sheets IDs shared with the service account
}

export async function getUserConfig(username: string): Promise<UserConfig | null> {
  const { data, error } = await supabaseAdmin
    .from('client_users')
    .select('username, password_hash, folder_id, display_name, spreadsheet_ids')
    .ilike('username', username)
    .single();

  if (error || !data) return null;

  return {
    username: data.username,
    passwordHash: data.password_hash,
    folderId: data.folder_id || '',
    displayName: data.display_name,
    spreadsheetIds: data.spreadsheet_ids || [],
  };
}

export async function canUserAccessSpreadsheet(userConfig: UserConfig | string, spreadsheetId: string): Promise<boolean> {
  const normalizedSpreadsheetId = spreadsheetId.trim();

  let userToUse;
  if (typeof userConfig === 'string') {
    const fetchedUser = await getUserConfig(userConfig);
    if (!fetchedUser) return false;
    userToUse = fetchedUser;
  } else {
    userToUse = userConfig;
  }

  const normalizedUsername = userToUse.username.toLowerCase();

  // If a sheet ID is explicitly assigned to one or more users in the DB, only those users can access it.
  const { data: usersWithAccess, error } = await supabaseAdmin
    .from('client_users')
    .select('username')
    .contains('spreadsheet_ids', [normalizedSpreadsheetId]);
    
  if (error) {
    console.error('Error fetching users for spreadsheet:', error);
    return false;
  }

  if (usersWithAccess && usersWithAccess.length > 0) {
    return usersWithAccess.some(u => u.username.toLowerCase() === normalizedUsername);
  }

  // If no one is explicitly assigned this sheet, everyone has access (legacy behavior).
  return true;
}

export async function validateUser(username: string, password: string): Promise<boolean> {
  const bcrypt = await import('bcryptjs');
  const user = await getUserConfig(username);
  
  if (!user || !user.passwordHash) {
    return false;
  }
  
  return bcrypt.default.compare(password, user.passwordHash);
}

// Helper function to generate password hashes for new users
export async function generatePasswordHash(password: string): Promise<string> {
  const bcrypt = await import('bcryptjs');
  return bcrypt.default.hash(password, 12);
}

// Google Service Account configuration
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