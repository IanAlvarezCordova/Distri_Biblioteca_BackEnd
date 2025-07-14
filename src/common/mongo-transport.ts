// src/common/mongo-transport.ts
import * as winstonTransport from 'winston-transport';
import { connect, model, Schema } from 'mongoose';

const logSchema = new Schema({
  timestamp: String,
  level: String,
  message: String,
});
const LogModel = model('Log', logSchema);

export class MongoTransport extends winstonTransport {
  constructor(opts: { mongoUri: string }) {
    super();
    connect(opts.mongoUri).catch((err) => console.error('Error conectando a MongoDB:', err));
  }

  async log(info: any, callback: () => void) {
    try {
      await LogModel.create({
        timestamp: info.timestamp,
        level: info.level,
        message: info.message,
      });
      callback();
    } catch (err) {
      console.error('Error al guardar log en MongoDB:', err);
      callback();
    }
  }
}