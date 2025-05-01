#!/usr/bin/env node

/**
 * Supabase Authentication Verification Script
 * 
 * This script helps verify your Supabase configuration for Google Authentication.
 * Run this script to check if all required environment variables are properly set
 * and to verify that your redirect URLs are configured correctly.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// ANSI colors for output formatting
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m"
};

/**
 * Print a formatted message
 */
function print(message, color = colors.reset) {
  console.log(color + message + colors.reset);
}

/**
 * Print a section header
 */
function printHeader(title) {
  console.log("\n" + colors.bright + colors.blue + "===== " + title + " =====" + colors.reset);
}

/**
 * Check if .env file exists and contains required variables
 */
async function checkEnvFile() {
  printHeader("ENV File Check");
  
  const envPath = path.join(process.cwd(), '.env');
  const envLocalPath = path.join(process.cwd(), '.env.local');
  
  let envExists = fs.existsSync(envPath);
  let envLocalExists = fs.existsSync(envLocalPath);
  let envFileContent = '';
  
  if (!envExists && !envLocalExists) {
    print("⚠️  No .env or .env.local file found! This is required for Supabase authentication.", colors.red);
    
    const createEnv = await askQuestion("Would you like to create a .env file now? (y/n): ");
    if (createEnv.toLowerCase() === 'y') {
      envFileContent = `VITE_SUPABASE_URL=your-supabase-url-here
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here

# Add your Supabase URL and anon key above (no quotes needed)
# You can find these values in your Supabase project dashboard
# under Settings > API
`;
      fs.writeFileSync(envPath, envFileContent);
      print("✅ Created .env file. Please edit it to add your Supabase credentials.", colors.green);
      return false;
    } else {
      print("❌ Environment file is required for authentication to work.", colors.red);
      return false;
    }
  }
  
  // Read the env file that exists
  const envFile = envExists ? envPath : envLocalPath;
  envFileContent = fs.readFileSync(envFile, 'utf8');
  
  // Check for required variables
  const hasSupabaseUrl = envFileContent.includes('VITE_SUPABASE_URL=');
  const hasSupabaseAnonKey = envFileContent.includes('VITE_SUPABASE_ANON_KEY=');
  
  if (!hasSupabaseUrl || !hasSupabaseAnonKey) {
    print("⚠️  Missing required environment variables!", colors.red);
    if (!hasSupabaseUrl) print("   - VITE_SUPABASE_URL is missing", colors.red);
    if (!hasSupabaseAnonKey) print("   - VITE_SUPABASE_ANON_KEY is missing", colors.red);
    
    const updateEnv = await askQuestion("Would you like to update your env file with the missing variables? (y/n): ");
    if (updateEnv.toLowerCase() === 'y') {
      let updatedContent = envFileContent;
      
      if (!hasSupabaseUrl) {
        updatedContent += "\nVITE_SUPABASE_URL=your-supabase-url-here";
      }
      
      if (!hasSupabaseAnonKey) {
        updatedContent += "\nVITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here";
      }
      
      updatedContent += "\n\n# Add your Supabase URL and anon key above (no quotes needed)";
      updatedContent += "\n# You can find these values in your Supabase project dashboard";
      updatedContent += "\n# under Settings > API\n";
      
      fs.writeFileSync(envFile, updatedContent);
      print("✅ Updated env file. Please edit it to add your Supabase credentials.", colors.green);
    }
    
    return false;
  }
  
  // Check if values are empty or placeholders
  const urlMatch = envFileContent.match(/VITE_SUPABASE_URL=([^\n]+)/);
  const keyMatch = envFileContent.match(/VITE_SUPABASE_ANON_KEY=([^\n]+)/);
  
  const url = urlMatch ? urlMatch[1].trim() : '';
  const key = keyMatch ? keyMatch[1].trim() : '';
  
  if (!url || url.includes('your-supabase-url-here') || url === '""' || url === "''") {
    print("⚠️  VITE_SUPABASE_URL is empty or contains a placeholder value.", colors.red);
    return false;
  }
  
  if (!key || key.includes('your-supabase-anon-key-here') || key === '""' || key === "''") {
    print("⚠️  VITE_SUPABASE_ANON_KEY is empty or contains a placeholder value.", colors.red);
    return false;
  }
  
  print("✅ Environment variables are properly configured.", colors.green);
  return true;
}

/**
 * Ask a question and get user input
 */
function askQuestion(question) {
  return new Promise(resolve => {
    rl.question(question, answer => {
      resolve(answer);
    });
  });
}

/**
 * Print Supabase Google Auth setup steps
 */
function printGoogleAuthSetup() {
  printHeader("Google Authentication Setup Guide");
  
  print("\n1. Go to your Supabase dashboard: https://app.supabase.io", colors.cyan);
  print("2. Select your project", colors.cyan);
  print("3. Go to Authentication → Providers", colors.cyan);
  print("4. Enable Google provider", colors.cyan);
  print("5. Configure redirect URLs:", colors.cyan);
  print(`   - Add: ${colors.yellow}http://localhost:3000/assessment${colors.cyan}`, colors.cyan);
  print(`   - If using a wildcard, add: ${colors.yellow}http://localhost:3000/*${colors.cyan}`, colors.cyan);
  print("6. Configure Site URL:", colors.cyan);
  print(`   - Set to: ${colors.yellow}http://localhost:3000${colors.cyan}`, colors.cyan);
  print("7. Add your OAuth credentials from Google Cloud Console", colors.cyan);
  print("\nFor Google Cloud Console setup:", colors.cyan);
  print("1. Go to https://console.cloud.google.com/", colors.cyan);
  print("2. Create a project if you don't have one", colors.cyan);
  print("3. Go to 'APIs & Services' → 'Credentials'", colors.cyan);
  print("4. Click 'Create Credentials' → 'OAuth client ID'", colors.cyan);
  print("5. Configure the consent screen if prompted", colors.cyan);
  print("6. Set application type to 'Web application'", colors.cyan);
  print("7. Add authorized redirect URIs:", colors.cyan);
  print(`   - ${colors.yellow}https://YOUR_SUPABASE_PROJECT_REF.supabase.co/auth/v1/callback${colors.cyan}`, colors.cyan);
  print("8. Copy the Client ID and Client Secret to Supabase Google provider settings", colors.cyan);
}

/**
 * Check for common issues in the code
 */
async function checkCodeIssues() {
  printHeader("Code Check");
  
  try {
    // Check if supabaseClient.ts exists
    const clientPath = path.join(process.cwd(), 'src', 'lib', 'supabaseClient.ts');
    if (!fs.existsSync(clientPath)) {
      print("⚠️ supabaseClient.ts not found at expected path.", colors.red);
      return false;
    }
    
    const clientCode = fs.readFileSync(clientPath, 'utf8');
    
    // Check for auth options in createClient
    if (!clientCode.includes('auth:') || !clientCode.includes('persistSession')) {
      print("⚠️ Auth options missing in Supabase client configuration.", colors.yellow);
      print("   For proper authentication, the client should include auth configuration.", colors.yellow);
      return false;
    }
    
    // Check for import of createClient
    if (!clientCode.includes("import { createClient }")) {
      print("⚠️ Import of createClient from @supabase/supabase-js is missing.", colors.red);
      return false;
    }
    
    print("✅ Supabase client configuration looks good.", colors.green);
    return true;
    
  } catch (error) {
    print(`❌ Error checking code: ${error.message}`, colors.red);
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  print("\n🔍 Supabase Authentication Verification Tool 🔍", colors.bright + colors.blue);
  print("This tool will help verify your Supabase configuration for Google Authentication.\n");
  
  const envCheck = await checkEnvFile();
  const codeCheck = await checkCodeIssues();
  
  printGoogleAuthSetup();
  
  printHeader("Verification Results");
  
  if (envCheck && codeCheck) {
    print("✅ Your Supabase configuration appears to be correct!", colors.green);
    print("If you're still experiencing issues with Google authentication:", colors.cyan);
    print("1. Check your browser console for errors", colors.cyan);
    print("2. Verify your Google OAuth credentials are correct", colors.cyan);
    print("3. Make sure cookies and third-party cookies are enabled in your browser", colors.cyan);
    print("4. Try clearing browser cache and cookies", colors.cyan);
  } else {
    print("⚠️ Some issues were found in your configuration.", colors.yellow);
    print("Please fix the issues mentioned above and run this script again.", colors.yellow);
  }
  
  rl.close();
}

// Run the main function
main(); 