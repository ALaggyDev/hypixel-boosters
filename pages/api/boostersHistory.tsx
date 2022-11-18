import { NextApiRequest, NextApiResponse } from 'next';
import { BoostersMetaData } from '../../src/api/boosterFetch';
import MongoWrapper from '../../src/mongoDbWrapper';

export default async (_req: NextApiRequest, res: NextApiResponse<BoostersMetaData[]>) => {
  const db = await MongoWrapper.getDb('hypixel');
  const cursor = db
    .collection('boostersHistory')
    .find({ time: { $gte: Date.now() - 86400000 } }, { projection: { _id: 0 } });

  const boosters: BoostersMetaData[] = await cursor.toArray();

  res.status(200).json(boosters);
};
