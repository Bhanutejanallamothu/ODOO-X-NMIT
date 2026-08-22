/**
 * Dayflow HRMS Concurrent Runner
 * Starts both backend and frontend development servers.
 * Automatically runs 'npm install' if node_modules are missing.
 */
const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const BACKEND_DIR = path.join(__dirname, 'backend');
const FRONTEND_DIR = path.join(__dirname, 'frontend');

// Helper to run a command synchronously (useful for installs)
const runSync = (command, cwd, description) => {
  console.log(`\n[Setup] ${description}...`);
  try {
    execSync(command, { cwd, stdio: 'inherit' });
    console.log(`[Setup] ✓ ${description} completed.`);
    return true;
  } catch (error) {
    console.error(`[Setup] ✗ Failed: ${description}.`, error.message);
    return false;
  }
};

// Check and install dependencies
const checkDependencies = () => {
  const backendModules = path.join(BACKEND_DIR, 'node_modules');
  const frontendModules = path.join(FRONTEND_DIR, 'node_modules');

  if (!fs.existsSync(backendModules)) {
    const success = runSync('npm install', BACKEND_DIR, 'Installing backend dependencies');
    if (!success) process.exit(1);
  } else {
    console.log('[Setup] Backend node_modules found.');
  }

  if (!fs.existsSync(frontendModules)) {
    const success = runSync('npm install', FRONTEND_DIR, 'Installing frontend dependencies');
    if (!success) process.exit(1);
  } else {
    console.log('[Setup] Frontend node_modules found.');
  }
};

// Start a background development process
const startProcess = (command, args, cwd, prefix, colorCode) => {
  // Use shell: true for Windows support
  const child = spawn(command, args, { cwd, shell: true });

  const formatLog = (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(line => {
      if (line) {
        // Apply ANSI color coding to log prefixes
        console.log(`\x1b[${colorCode}m[${prefix}]\x1b[0m ${line}`);
      }
    });
  };

  child.stdout.on('data', formatLog);
  child.stderr.on('data', formatLog);

  child.on('close', (code) => {
    console.log(`[System] ${prefix} process exited with code ${code}`);
    process.exit(code || 0);
  });

  return child;
};

// Main execution
console.log('==================================================');
console.log('            Dayflow HRMS Orchestrator             ');
console.log('==================================================');

checkDependencies();

console.log('\n[System] Starting development servers concurrently...\n');

// 34 = Blue (Backend), 35 = Magenta (Frontend)
const backendProcess = startProcess('npm', ['run', 'dev'], BACKEND_DIR, 'Backend', '34');
const frontendProcess = startProcess('npm', ['run', 'dev'], FRONTEND_DIR, 'Frontend', '35');

// Handle exit signals to terminate child processes gracefully
const cleanExit = () => {
  console.log('\n[System] Shutting down servers...');
  try {
    backendProcess.kill();
  } catch (e) {}
  try {
    frontendProcess.kill();
  } catch (e) {}
  process.exit();
};

process.on('SIGINT', cleanExit);
process.on('SIGTERM', cleanExit);
process.on('exit', cleanExit);
