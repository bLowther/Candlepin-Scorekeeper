export type Mark = 'spare' | 'strike' | null;

export interface Listeners {
  [event: string]: Set<Function>;
}

export class Frame {
  number: number = 0;
  total: number = 0;
  downed: number[] = [];
  complete: boolean = false;
  mark: Mark;
  active: boolean = false;
  ball?: number = 1;

  constructor(number: number, opts?: { downed: number[], completed: boolean, mark: Mark }) {
    this.number = number;
    this.downed = opts?.downed || [];
    this.complete = opts?.completed || false;
    this.mark = opts?.mark as Mark;
  }

  get score(): number {
    return this.downed.reduce((total,  down ) => total + down, 0);
  }

  reset(): void {
    this.complete = false;
    this.downed = [];
    this.mark = null;
  }
}

export class Frames {
  #frames: Set<Frame> = new Set();

  get frames(): Frame[] {
    return Array.from(this.#frames);
  }

  get completed(): Frame[] {
    return this.frames.filter(({ downed, mark}) => downed.length === 3 || mark === 'strike' || mark === 'spare');
  }

  // get score(): number {
  //   return this.completed.reduce(((total, { score }) => total + score), 0);
  // }

  constructor(frames: Frame[] = []) {
    frames.forEach(frame => this.#frames.add(frame));

    if (this.#frames.size < 10) {
      let i = Array.from(this.#frames.values()).pop()?.number || 0;
      while (this.#frames.size < 10) {
        this.#frames.add(new Frame(++i));
      }
    }
  }

  total(): void {
    let runningTotal = 0;
    for (let i = 0; i < this.completed.length; i++) {
      const frame = this.completed[i];
      const nextFrame = this.completed[i + 1];
      const double = this.completed[i + 2]
      let pending = false;
      runningTotal += frame.score;
      if(nextFrame) {
        if (frame.mark === 'spare') runningTotal += nextFrame.downed[0];
        if (frame.mark === 'strike') {
          if (nextFrame.downed.length > 1) runningTotal += (nextFrame.downed[0] + nextFrame.downed[1]);
          if (nextFrame.mark === 'strike' && double) runningTotal += (nextFrame.downed[0] + double.downed[0]);
        }
      } else if (frame.mark === 'strike' || frame.mark === 'spare') pending = true;
      if (!pending) frame.total = runningTotal;
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

  // get score(): number {
  //   return this.#frames.score;
  // }

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

  total(): void {
    this.#frames.total()
  }
}