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
  ip: String, // <-- Nuevo campo
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
      return callback();
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
        ip: '',
        createdAt: new Date(),
      };
  
      // Extraer metadatos (GlobalExceptionFilter)
      if (info[Symbol.for('splat')]) {
        const meta = info[Symbol.for('splat')][0];
        if (meta && typeof meta === 'object') {
          logData.url = meta.url || logData.url;
          logData.method = meta.method || logData.method;
          logData.statusCode = meta.statusCode || logData.statusCode;
          logData.stack = meta.stack || logData.stack;
          logData.ip = meta.ip || logData.ip;
        }
      }
  
      // Parsear logs de acceso (de Morgan)
      if (logData.message.startsWith('[')) {
        const parts = logData.message.split(' ');
        if (parts.length >= 4) {
          logData.ip = parts[0].slice(1, -1); // Extrae la IP sin corchetes
          logData.method = parts[1]; // Método HTTP (ej. POST)
          logData.url = parts[2]; // URL (ej. /auth/login)
          logData.statusCode = parseInt(parts[3], 10); // Código de estado (ej. 200)
        }
      }

      // Ignorar logs de OPTIONS, 304, y recursos estáticos
    if (
      logData.method === 'OPTIONS' ||
      logData.statusCode === 304 ||
      logData.url.includes('favicon') ||
      logData.url.includes('.png') ||
      logData.url.includes('.jpg')
    ) {
      return callback();
    }
  
      await LogModel.create(logData);
    } catch (err) {
      console.error('Error al guardar log en MongoDB:', err);
    }
  
    callback();
  }
}
