import { MongoClient, Db } from 'mongodb';

export default class MongoWrapper {
  public static client: MongoClient;
  private static DBCache: Record<string, Db> = {};

  // It is recommend to use this function to get connection instead of directly accessing
  public static async getCurrentConnection() {
    if (!process.env.MONGODB_URI) throw new Error('No mongo db uri in environment variables!');

    // if a connection didn't exist yet
    if (!this.client || !this.client.isConnected()) {
      this.client = new MongoClient(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      await this.client.connect();
      this.DBCache = {};
    }

    return this.client;
  }

  // It is recommend to use this function caches database
  public static async getDb(db: string) {
    if (!this.DBCache[db]) {
      const connection = await this.getCurrentConnection();
      this.DBCache[db] = connection.db(db);
    }
    return this.DBCache[db];
  }

  public static async closeConnection() {
    if (this.client) await this.client.close();
  }
}
