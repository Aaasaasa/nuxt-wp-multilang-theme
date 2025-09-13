import { defineNitroConfig } from 'nitropack/config';

export default defineNitroConfig({
  // Nitro config for server
  prisma: { autoSetupPrisma: true },
  // Add Redis, etc.
});
