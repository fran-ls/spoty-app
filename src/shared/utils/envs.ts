interface Envs {
  DEV_API_URL: string;
  PROD_API_URL: string;
  API_URL: string;
  REACT_ENV: string;
  SUPABASE_URL: string;
  SUPABASE_PUBLISHABLE_KEY: string;
  IS_PROD: boolean;
  YTDROP_API_URL: string;
  YTDROP_STORAGE_KEY: string;
  MODE: string;
  DEMO_USER: {
    email: string;
    pass: string;
  }
}

const vars = [
  'VITE_REACT_ENV',
  'VITE_DEV_API_URL',
  'VITE_PROD_API_URL',
  'VITE_API_URL',
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_PUBLISHABLE_KEY',
  'VITE_YTDROP_API_URL',
  'VITE_YTDROP_STORAGE_KEY',
  'VITE_MODE',
];

const metaEnv = { ...import.meta.env }
const env: any = {}
const prefix = 'VITE_';

for (const v of vars) {
  const k = v.replace(prefix, '');
  env[k] = metaEnv[v];
}

const { REACT_ENV, DEV_API_URL, PROD_API_URL, MODE } = env;
const reactEnv = REACT_ENV ? REACT_ENV.toLowerCase() : 'dev';
const IS_PROD = reactEnv === 'prod' || reactEnv === 'production';

env.REACT_ENV = reactEnv;
env.IS_PROD = IS_PROD;

if (!DEV_API_URL) {
  env.DEV_API_URL = 'http://localhost:3000/api';
}

if (!env.API_URL || !IS_PROD) {
  env.API_URL = DEV_API_URL;
}

if (IS_PROD && PROD_API_URL) {
  env.API_URL = PROD_API_URL;
}

env.MODE = MODE ? MODE.toLowerCase() : 'dev';
env.DEMO_USER = JSON.parse(metaEnv.VITE_DEMO_USER)

export const envs = env as Envs;