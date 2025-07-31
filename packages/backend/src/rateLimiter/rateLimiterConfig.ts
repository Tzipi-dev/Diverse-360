export const rateLimitGlobalConfig = {
  enabled: process.env.RATE_LIMIT_ENABLED === 'true',
  default: { windowInSeconds: 60, maxRequests: 60 },
  routes: {},  
};