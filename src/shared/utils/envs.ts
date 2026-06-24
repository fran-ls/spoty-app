interface Envs {
  DEV_API_URL: string;
  PROD_API_URL: string;
  API_URL: string;
  REACT_ENV: string;
  SUPABASE_URL: string;
  SUPABASE_PUBLISHABLE_KEY: string;
  IS_PROD: boolean;
}

const vars = [
  'VITE_REACT_ENV',
  'VITE_DEV_API_URL',
  'VITE_PROD_API_URL',
  'VITE_API_URL',
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_PUBLISHABLE_KEY'
];

const metaEnv = { ...import.meta.env }
const env: any = {}
const prefix = 'VITE_';

for (const v of vars) {
  const k = v.replace(prefix, '');
  env[k] = metaEnv[v];
}

const { REACT_ENV, DEV_API_URL, PROD_API_URL } = env;
const MODE = REACT_ENV ? REACT_ENV.toLowerCase() : 'dev';
const IS_PROD = MODE === 'prod' || MODE === 'production';

env.REACT_ENV = MODE;
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

export const envs = env as Envs;