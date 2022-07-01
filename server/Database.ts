import { readFile, writeFile } from 'fs/promises';
import { Game, FramePlayers, Mark, Frame } from '../src/swagger-generated-client/api';
import { Level, Logger } from './Logger';

export class FrameMissingPlayersError extends Error { }

export class Database {
  #logger = new Logger(Level.DEBUG);
  #games: Game[] = [];
  #ready: boolean = false;

  get ready(): boolean {
    return this.#ready;
  }

  get games(): Game[] {
    return this.#games;
  }

  async getGameById(gameId: string): Promise<Game | undefined> {
    return this.#games.find(({ id }) => id === gameId);
  }

  async load(): Promise<Game[]> {
    const data: string = await readFile('games.start.json', 'utf-8');
    try {
      this.#games = JSON.parse(data);
    } catch (e) {
      this.#logger.error(e as Error);
      this.#games = [];
    }

    this.#ready = true;
    return this.#games;
  }

  async #save(game: Game): Promise<void> {
    const index = this.#games.findIndex(({ id }) => id === game.id);
    if (index === -1) {
      this.#games.push(game);
    } else {
      Object.assign(this.#games[index], game);
    }

    return writeFile('games.json', JSON.stringify(this.#games));
  }

  /**
   * @param gameId 
   * @param downed 
   * @throws {RangeError} if gameId cannot be found
   */
  async roll(gameId: string, downed: number): Promise<void> {
    const game = this.#games.find(({ id }) => id === gameId);
    if (!game) {
      throw new RangeError(`Game not found: ${gameId}`);
    } else {
      const activePlayer = this.#getActivePlayer(game) as FramePlayers;
      const currentFrame = this.#getActiveFrame(game) as Frame;
      activePlayer.ball = (activePlayer.ball || 0) + 1;
      if (!Array.isArray(activePlayer.downed)) {
        activePlayer.downed = [];
      }
      activePlayer.downed.push(downed);
      const totalDowned = activePlayer.downed.reduce((acc, cur) => acc + cur, 0);
      if (totalDowned >= 10) {
        activePlayer.mark = [undefined, Mark.Strike, Mark.Spare, Mark.Ten][activePlayer.ball];
      }

      this.#logger.debug(`Frame updated: ${JSON.stringify(currentFrame)}`);
      if (activePlayer.ball >= 3 || totalDowned >= 10) {
        activePlayer.active = false;
        const nextPlayerIndex = currentFrame.players.indexOf(activePlayer) as number;
        if (nextPlayerIndex >= currentFrame.players.length - 1) {
          if (currentFrame.number === 10) {
            game.completed = new Date();
          } else {
            // currentFrame.number is 1 indexed so it's easy to set the next frame
            currentFrame.active = false;
            currentFrame.complete = true;
            game.currentFrame = game.frames[currentFrame.number];
            game.currentFrame.active = true;
            game.currentFrame.players[0].active = true;
          }
        } else {
          currentFrame.players[nextPlayerIndex + 1].active = true;
        }
      }

      this.#save(game);
    }
  }

  #getActiveFrame(game: Game): Frame {
    const activeFrame = game.currentFrame;
    if (!activeFrame) {
      const nextFrame = game.frames.find(({ active }) => active) || game.frames[0];
      game.currentFrame = nextFrame;
      return nextFrame;
    } else {
      return activeFrame;
    }
  }

  #getActivePlayer(game: Game): FramePlayers {
    const currentFrame = this.#getActiveFrame(game) as Frame;
    const activePlayer = currentFrame.players.find(({ active }) => active);
    if (!activePlayer) {
      const newActivePlayer = currentFrame.players[0];
      newActivePlayer.active = true;
      return newActivePlayer;
    } else {
      return activePlayer;
    }
  }
}