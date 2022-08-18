import { Frame } from '../core/player';
import Tile from './tile';

interface FrameProps {
  frame: Frame;
  isActivePlayer:boolean;
}

const FrameCom: React.FC<FrameProps> = ({frame, isActivePlayer}) => {
  const ball = frame.ball ? frame.ball : 0;
  const firstRoll = frame.active && ball === 0 && isActivePlayer;
  const stillRolling = frame.active && ball > 0 && isActivePlayer;
  return (
    <div>
      {frame.number === 1 ?
          <div className={"row"} data-testid="frame">
            <Tile score={0} mark={"ten"} active={firstRoll} />
            <Tile score={frame.total} mark={frame.mark} active={stillRolling}/>
          </div>
        :
        frame.mark === 'strike' || frame.mark === 'spare' ?
          <div className={"row"} data-testid="frame">
            <Tile score={0} mark={frame.mark} active={false} />
            <Tile score={frame.total} mark={"ten"} active={false}/>
          </div>
        :
          <div className={"row"} data-testid="frame">
              <Tile score={frame.score} mark={"ten"} active={firstRoll} />
              <Tile score={frame.total} mark={frame.mark} active={stillRolling}/>
          </div>
      }
    </div>  
  );
};

export default FrameCom;