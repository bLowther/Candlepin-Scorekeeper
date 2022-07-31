import { Frame } from '../model';
import Tile from './tile';

// export class Frame {
//   number: number = 0;
//   downed: number = 0;
//   complete: boolean = false;
//   mark: Mark;
//   active: boolean = false;
//   ball?: number = 1;

//   constructor(number: number, opts?: { downed: number, completed: boolean, mark: Mark }) {
//     this.number = number;
//     this.downed = opts?.downed || 0;
//     this.complete = opts?.completed || false;
//     this.mark = opts?.mark as Mark;
//   }

//   reset(): void {
//     this.complete = false;
//     this.downed = 0;
//     this.mark = null;
//   }
// }

const FrameCom: React.FC<{frame: Frame, isActivePlayer:boolean}> = ({frame, isActivePlayer}) => {
  const ball = frame.ball ? frame.ball : 0;
  return (
    <div>
      {frame.mark === 'strike' ?
          <div className={"row"}>
            <Tile score={0} mark={frame.mark} active={frame.active && isActivePlayer} />
            <Tile score={0} mark={"ten"} active={frame.active && isActivePlayer}/>
          </div>
        :
        <div className={"row"}>
            <Tile score={frame.downed} mark={"ten"} active={frame.active && ball === 0 && isActivePlayer} />
            <Tile score={0} mark={frame.mark} active={frame.active  && ball > 0 && isActivePlayer}/>
        </div>
      }
    </div>  
  );
};

export default FrameCom;