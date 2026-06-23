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

const environment = { ...import.meta.env }
const env: any = {}
const prefix = 'VITE_';

for (const v of vars) {
  const k = v.replace(prefix, '');
  env[k] = environment[v];
}

if (!env.REACT_ENV) {
  env.REACT_ENV = 'dev';
}

if (!env.DEV_API_URL) {
  env.DEV_API_URL = 'http://localhost:3000/api';
}

const mode = env.REACT_ENV.toLowerCase();
env.REACT_ENV = mode;
env.IS_PROD = mode === 'prod' || mode === 'production';

if (!env.API_URL) {
  env.API_URL = env.IS_PROD ? env.PROD_API_URL : env.DEV_API_URL;
}

export const envs = env as Envs;