import { registerAs } from '@nestjs/config';

export default registerAs('ably', () => ({
  apiKey: process.env.ABLY_API_KEY,
}));