import { Player } from '../model';
import FrameCom from './frame';
import './player.css';

// export class Player {
//   #frames: Frames;
//   #name: string;

//   static create(name: string): Player {
//     return new Player(name);
//   }

//   get score(): number {
//     return this.#frames.score;
//   }

//   get name(): string {
//     return this.#name;
//   }

//   get frames(): Frame[] {
//     return this.#frames.frames;
//   }

//   constructor(name: string, frames: Frames = new Frames()) {
//     this.#frames = frames;
//     this.#name = name;
//   }
// }

interface PlayersProps {
  player: Player;
  activePlayer: string;
}

const PlayersCom: React.FC<PlayersProps> = ({player, activePlayer }) => {
  const isActivePlayer = activePlayer === player.name;
  return (
    <div className={"col"}>
      <div className={isActivePlayer ? 'activePlayer' : 'player'}>
        {player.name}
      </div>
      {player.frames.map(frame=>(
        <FrameCom frame={frame} isActivePlayer={isActivePlayer} key={player.name + frame.number}/>
      ))}  
    </div>
  );
};

export default PlayersCom;