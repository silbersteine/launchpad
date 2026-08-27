import * as fs from 'node:fs';
import * as path from 'node:path';
import dotenv from 'dotenv';
import { randomUUID } from 'node:crypto';

dotenv.config({ path: '../next/.env' });

const TO_BE_MODIFIED_KEY = /tobemodified/g;
const PREVIEW_SECRET_KEY = 'preview_secret';

const generateSecret = () => randomUUID().replace(/-/g, '_');
const previewSecret = process.env.PREVIEW_SECRET || generateSecret();

function copyEnvFile(targetDir) {
  targetDir = targetDir.trim();

  const examplePath = path.join(targetDir, '.env.example');
  const envPath = path.join(targetDir, '.env');

  console.log('Attempting to copy from:', examplePath);
  console.log('To:', envPath);

  if (!fs.existsSync(examplePath)) {
    console.error(`.env.example file does not exist in ${targetDir}`);
    process.exitCode = 1;
    return;
  }

  if (fs.existsSync(envPath)) {
    console.log(`.env file already exists in ${targetDir}, no action taken.`);
    return;
  }

  fs.copyFileSync(examplePath, envPath);
  console.log(`.env.example has been copied to ${envPath}`);

  const currentEnv = fs.readFileSync(envPath, 'utf8');
  const updatedEnv = currentEnv
    .replace(TO_BE_MODIFIED_KEY, generateSecret)
    .replace(PREVIEW_SECRET_KEY, previewSecret);

  fs.writeFileSync(envPath, updatedEnv, 'utf8');
  console.log(`${envPath} has been updated with new secrets.`);
}

const directoryPath = process.argv[2]?.trim();

if (directoryPath) {
  copyEnvFile(directoryPath);
} else {
  console.error('Please provide a directory path as an argument.');
  process.exitCode = 1;
}
