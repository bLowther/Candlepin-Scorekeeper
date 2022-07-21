import { FramePlayers } from '../swagger-generated-client';
import './tile.css';

const Tile: React.FC<{player: FramePlayers}> = ({player}) => {
  const mark = player.mark;
  return (
    <div className={"row"}>
      <div className={"col"}>
        <div className={"ten"}></div>
      </div>
      <div className={"col"}>
        <div className={mark ? mark.toString() : "ten"}></div>
      </div>
    </div>
  );
};

export default Tile;