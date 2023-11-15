import Redis, { Redis as RedisInterface } from "ioredis";
import redisConfig from "@/Config/redis";
import Mutex from "@/Mutex/Mutex";

class CacheService {
  private static instance: CacheService;
  private static instanceCreationLock = new Mutex();
  redis: RedisInterface;

  private constructor() {
    const redisPort = Number(redisConfig.port);

    this.redis = new Redis(redisPort, redisConfig.host, {
      password: redisConfig.password,
    });
  }

  static getInstance(): CacheService {
    if (!CacheService.instance) {      
      CacheService.instanceCreationLock.acquire();
      try {
        if (!CacheService.instance) {
          CacheService.instance = new CacheService();
        }
      } finally {
        CacheService.instanceCreationLock.release();
      }
    }
    return CacheService.instance;
  }

  async get<ExpectedData extends Record<string, unknown>>(
    key: string
  ): Promise<ExpectedData> {
    const cached = await this.redis.get(key);

    if (cached) {
      return JSON.parse(cached);
    } else {
      return null;
    }
  }

  async set<ExpectedData extends Record<string, unknown>>(
    key: string,
    value: ExpectedData,
    expiration: number = null
  ): Promise<boolean> {
    const payload = JSON.stringify(value);

    if (expiration) {
      return Boolean(await this.redis.set(key, payload, "EX", expiration));
    } else {
      return Boolean(await this.redis.set(key, payload));
    }
  }

  async delete(key: string): Promise<boolean> {
    const isKeyDeleted = await this.redis.del(key);

    if (isKeyDeleted) {
      return true;
    } else {
      return false;
    }
  }
}

export default CacheService.getInstance();
