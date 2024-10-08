import { MongoClient } from 'mongodb';
import {
  ObjectId
} from 'mongodb';

/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

const agg = [
  {
    '$match': {
      'product': new ObjectId('670523d03da65eea320dd612')
    }
  }, {
    '$group': {
      '_id': null, 
      'avarageRating': {
        '$avg': '$rating'
      }, 
      'numOfReviews': {
        '$sum': 1
      }
    }
  }
];

const client = await MongoClient.connect(
  ''
);
const coll = client.db('10-ECOMMERCE-API').collection('reviews');
const cursor = coll.aggregate(agg);
const result = await cursor.toArray();
await client.close();