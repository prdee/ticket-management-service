import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  url: process.env.SUPABASE_URL,
  key: process.env.SUPABASE_KEY,
}));