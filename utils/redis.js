import { promisify } from 'util';
import { createClient } from 'redis';

/**
 * Class used to represent Redis client
 */
class RedisClient {
  /**
   * New RedisClient instance
   */
  constructor() {
    this.client = createClient();
    this.isClientConnected = true;
    this.client.on('error', (err) => {
      console.error('Redis client failed to connect:', err.message || err.toString());
      this.isClientConnected = false;
    });
    this.client.on('connect', () => {
      this.isClientConnected = true;
    });
  }

  /**
   * Check to see if clients connection to redis server is active
   * @returns boolean
   */
  isAlive() {
    return this.isClientConnected;
  }

  /**
    * Retreve key value
    * @param: Key
    * @returns: string
    */
  async get(key) {
    return promisify(this.client.GET).bind(this.client)(key);
  }

  /**
   * Store key and its value along with an expiration time.
   * @param: The key of the item to store.
   * @param: value The item to store.
   * @param:  duration The expiration time of the item.
   * @returns Promise
   */
  async set(key, value, duration) {
    await promisify(this.client.SETEX)
      .bind(this.client)(key, duration, value);
  }

  /**
   * Remove value of a given key.
   * @param: The key of the item to remove.
   * @returns Promise
   */
  async del(key) {
    await promisify(this.client.DEL).bind(this.client)(key);
  }
}

export const redisClient = new RedisClient();
export default redisClient;
