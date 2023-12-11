import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  server: {
    SUI_PRIVATE_KEY: z.string(),
    STORY_TIME_ADDRESS: z.string(),
  },
  runtimeEnv: process.env,
});
