// src/common/mongo-transport.ts
import * as winstonTransport from 'winston-transport';
import { connect, model, Schema } from 'mongoose';

const logSchema = new Schema({
  timestamp: String,
  level: String,
  message: String,
  url: String,
  method: String,
  statusCode: Number,
  stack: String,
  createdAt: { type: Date, expires: '14d', default: Date.now },
});
const LogModel = model('Log', logSchema);

export class MongoTransport extends winstonTransport {
  private isConnected = false;


  constructor(opts: { mongoUri: string }) {
    super();
    connect(opts.mongoUri)
      .then(() => {
        this.isConnected = true;
        console.log('MongoDB conectado para logging');
      })
      .catch((err) => console.error('Error conectando a MongoDB:', err));
  }

  

  async log(info: any, callback: () => void) {

    if (!this.isConnected) {
      console.warn('Aún no conectado a MongoDB. Log ignorado temporalmente.');
      return callback(); // Evitar cuelgues
    }
    
    try {
      let logData = {
        timestamp: info.timestamp,
        level: info.level,
        message: info.message,
        url: '',
        method: '',
        statusCode: null as number | null,
        stack: '',
        createdAt: new Date(),
      };

      // Manejar metadatos de errores (GlobalExceptionFilter)
      if (info[Symbol.for('splat')]) {
        const meta = info[Symbol.for('splat')][0];
        if (meta && typeof meta === 'object') {
          logData.url = meta.url || logData.url;
          logData.method = meta.method || logData.method;
          logData.statusCode = meta.statusCode || logData.statusCode;
          logData.stack = meta.stack || logData.stack;
        }
      }

      // Parsear logs de Morgan
      if (logData.level === 'info' && logData.message.includes('HTTP')) {
        const morganMatch = logData.message.match(/"([^"]+) ([^"]+) HTTP[^"]+" (\d+)/);
        if (morganMatch) {
          logData.method = morganMatch[1]; // Ej: "POST"
          logData.url = morganMatch[2];    // Ej: "/auth/login"
          logData.statusCode = parseInt(morganMatch[3], 10); // Ej: 201
        }
      }

      await LogModel.create(logData);
    } catch (err) {
      console.error('Error al guardar log en MongoDB:', err);
    }
    callback();
    }
  }
