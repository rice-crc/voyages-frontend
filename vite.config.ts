import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import { resolve } from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: resolve(__dirname, '.env') });

export default defineConfig({
  plugins: [reactRefresh()],
  // ... other Vite configurations
});
