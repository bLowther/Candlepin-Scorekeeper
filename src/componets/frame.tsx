import { Frame } from '../swagger-generated-client';
import Tile from './tile';

const FrameCom: React.FC<{frame: Frame}> = ({frame}) => {

  return (
    <div className={"container text-center"}>
      <div className={"row"}>
      <div className={"col-1"}><h2>{frame.number}</h2></div>
        {frame.players.map(player=>(
          <div className={"col"} key={player.player + frame.number}>
            <Tile player={player}/>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FrameCom;