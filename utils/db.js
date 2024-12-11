import mongodb from 'mongodb';
// eslint-disable-next-line no-unused-vars
import Collection from 'mongodb/lib/collection';
import envLoader from './env_loader';

/**
 * Manages the connection and operations for a MongoDB database.
 */
class DBClient {
  /**
   * Initializes a new instance of DBClient and establishes a connection to MongoDB.
   * Configuration details (host, port, database) are loaded from environment variables.
   */
  constructor() {
    envLoader(); // Load environment variables.
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    const dbURL = `mongodb://${host}:${port}/${database}`;

    // Create and connect the MongoDB client.
    this.client = new mongodb.MongoClient(dbURL, { useUnifiedTopology: true });
    this.client.connect();
  }

  /**
   * Verifies if the database connection is active.
   * @returns {boolean} True if the client is connected, otherwise false.
   */
  isAlive() {
    return this.client.isConnected();
  }

  /**
   * Retrieves the total count of user documents in the `users` collection.
   * @returns {Promise<number>} A promise that resolves to the number of users.
   */
  async nbUsers() {
    return this.client.db().collection('users').countDocuments();
  }

  /**
   * Retrieves the total count of file documents in the `files` collection.
   * @returns {Promise<number>} A promise that resolves to the number of files.
   */
  async nbFiles() {
    return this.client.db().collection('files').countDocuments();
  }

  /**
   * Provides a reference to the `users` collection for further operations.
   * @returns {Promise<Collection>} A promise that resolves to the `users` collection.
   */
  async usersCollection() {
    return this.client.db().collection('users');
  }

  /**
   * Provides a reference to the `files` collection for further operations.
   * @returns {Promise<Collection>} A promise that resolves to the `files` collection.
   */
  async filesCollection() {
    return this.client.db().collection('files');
  }
}

// Create a singleton instance of the DBClient class.
export const dbClient = new DBClient();
export default dbClient;
