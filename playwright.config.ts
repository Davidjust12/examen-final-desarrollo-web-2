import { defineConfig } from '@playwright/test';
export default defineConfig({ testDir: './tests', timeout: 90000, expect: { timeout: 20000 }, workers: 1, use: { baseURL: 'http://127.0.0.1:4200', launchOptions: { executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' } }, reporter: 'list' });
