import { redisClient } from './redisConnection';
import { Request, Response, NextFunction } from 'express';
export const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  if (req.headers.upgrade && req.headers.upgrade.toLowerCase() === 'websocket') {
    return next();
  }
  const ipRaw = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.socket.remoteAddress || 'unknown';
  const ip = ipRaw === '::1' ? '127.0.0.1' : ipRaw;
  const cleanIp = ip.replace(/[^a-zA-Z0-9:.]/g, '_');
  const key = `rate-limit:${cleanIp}`;
  const ttlSeconds = 60;
  const limit = 60;
  try {
    const count = (await redisClient.incr(key)) as number;
    const ttl = await redisClient.ttl(key);
    if (ttl === -1) {
      await redisClient.expire(key, ttlSeconds);
    }
    res.setHeader('X-RateLimit-Limit', limit.toString());
    res.setHeader('X-RateLimit-Remaining', Math.max(0, limit - count).toString());
    res.setHeader('X-RateLimit-Reset', ttl.toString());
    if (count > limit) {
      return res.status(429).json({
        message: "⏳ יותר מדי בקשות. נסי שוב בעוד כמה שניות.",
        retryAfter: ttl,
      });
    }
    next();
  } catch (err) {
    next();
  }
};