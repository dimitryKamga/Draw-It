import inversify from 'inversify';
import mongodb from 'mongodb';

import secrets from './secrets.json';

@inversify.injectable()
class Database {
	private readonly client: mongodb.MongoClient;
	private _db?: mongodb.Db;

	constructor() {
		// this._db = await mongodb.MongoClient.connect('mongodb://[::1]/log2990', {
		this.client = new mongodb.MongoClient('mongodb://127.0.0.1/log2990', {
			auth: secrets.mongodb.auth,
			// Next does not work with IPv6
			useUnifiedTopology: true,
		});
	}

	get db(): mongodb.Db | undefined {
		return this._db;
	}

	async connect(dbName?: string): Promise<mongodb.Db> {
		await this.client.connect();
		this._db = this.client.db(dbName);
		const counterCollection = this._db.collection('counter');
		await counterCollection?.count().then(count => {
			if (count == 0) {
				counterCollection.insert({
					_id: 'productid',
					sequenceValue: 0,
				});
			}
		});
		return this._db;
	}

	close(force?: boolean): Promise<void> {
		return this.client.close(force);
	}
}

export { Database };
