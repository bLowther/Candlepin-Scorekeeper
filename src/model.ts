export type Mark = 'spare' | 'strike' | null;

export interface Listeners {
  [event: string]: Set<Function>;
}

export class Frame {
  number: number = 0;
  downed: number = 0;
  complete: boolean = false;
  mark: Mark;
  active: boolean = false;
  ball?: number = 1;

  constructor(number: number, opts?: { downed: number, completed: boolean, mark: Mark }) {
    this.number = number;
    this.downed = opts?.downed || 0;
    this.complete = opts?.completed || false;
    this.mark = opts?.mark as Mark;
  }

  reset(): void {
    this.complete = false;
    this.downed = 0;
    this.mark = null;
  }
}

export class Frames {
  #frames: Set<Frame> = new Set();

  get frames(): Frame[] {
    return Array.from(this.#frames);
  }

  get score(): number {
    return this.frames.filter(({ complete: completed }) => completed).reduce((total, { downed }) => total + downed, 0);
  }

  constructor(frames: Frame[] = []) {
    frames.forEach(this.#frames.add);

    if (this.#frames.size < 10) {
      let i = Array.from(this.#frames.values()).pop()?.number || 0;
      while (this.#frames.size < 10) {
        this.#frames.add(new Frame(++i));
      }
    }
  }

  reset(): void {
    for (const frame of this.#frames) {
      frame.reset();
    }
  }
}

export class Player {
  #frames: Frames;
  #name: string;

  static create(name: string): Player {
    return new Player(name);
  }

  get score(): number {
    return this.#frames.score;
  }

  get name(): string {
    return this.#name;
  }

  get frames(): Frame[] {
    return this.#frames.frames;
  }

  constructor(name: string, frames: Frames = new Frames()) {
    this.#frames = frames;
    this.#name = name;
  }
}