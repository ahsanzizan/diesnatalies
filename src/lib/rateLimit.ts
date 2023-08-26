import { LRUCache } from "lru-cache";
import { ServerResponse } from "http";

interface RateLimitOptions {
    uniqueTokenPerInterval?: number;
    interval?: number;
}

interface RateLimitResult {
    isRateLimited: boolean;
}

interface RateLimiter {
    check(res: ServerResponse, limit: string, token: string): Promise<RateLimitResult>;
}

const rateLimit = (options: RateLimitOptions): RateLimiter => {
    const tokenCache = new LRUCache<string, number[]>({
        max: parseInt(options.uniqueTokenPerInterval?.toString() || "500", 10),
        ttl: parseInt(options.interval?.toString() || "60000", 10),
    });

    return {
        check: (res: ServerResponse, limit: string, token: string): Promise<RateLimitResult> =>
            new Promise((resolve, reject) => {
                const tokenCount = tokenCache.get(token) || [0];

                if (tokenCount[0] === 0) {
                    tokenCache.set(token, tokenCount);
                }
                tokenCount[0] += 1;

                const currentUsage = tokenCount[0];
                const isRateLimited = currentUsage >= parseInt(limit, 10);
                res.setHeader('X-RateLimit-Limit', limit);
                return resolve({ isRateLimited });
            }),
    };
};

export default rateLimit;
