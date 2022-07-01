import express from 'express';
import bodyParser from 'body-parser';
import { Level, Logger } from './Logger';
import { Database } from './Database';

const {
  HOST = 'localhost',
  PORT = 3123
}: NodeJS.ProcessEnv | { HOST: string, PORT: number } = process.env;
const logger = new Logger(Level.DEBUG);
const app = express();
const db = new Database();
db.load();
app.use(bodyParser.json({ type: 'application/json' }));
app.get('/health', (req, res) => {
  if (db.ready) {
    res.status(200).end();
  } else {
    res.status(503).end();
  }
});
app.use('/', (req, res, next) => {
  if (!db.ready) {
    res.status(503).send('Database not ready yet');
  } else {
    next();
  }
});
app.get('/games', (req, res) => {
  res.status(200).json(db.games);
});
app.delete('/game/:id', async (req, res) => {
  const game = await db.getGameById(req.params.id);
  if (!game) {
    res.status(404).send(`Unable to find game ${req.params.id}`);
  } else {
    await db.load();
    res.status(204).end();
  }
});
app.put('/game/:id/roll', async (req, res) => {
  const game = await db.getGameById(req.params.id);
  if (!game) {
    res.status(404).send(`Unable to find game ${req.params.id}`);
  } else if (game.completed) {
    res.status(409).send('Already completed');
  } else {
    const downed = (req.body as any).downed as number;
    if (!downed && typeof downed !== 'number') {
      res.status(400).send('Property "downed" is required in the request');
    } else {
      try {
        await db.roll(req.params.id, (req.body as any).downed as number);
        res.status(204).end();
      } catch (e) {
        logger.error(e as Error);
        res.status(500).send((e as Error).stack);
      }
    }
  }
});
app.listen(PORT as number, HOST, () => {
  logger.info(`Candlepin server started at ${HOST}:${PORT}`);
});