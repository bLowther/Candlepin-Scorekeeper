import { FramePlayers } from '../swagger-generated-client';
import './player.css';

interface PlayersProps {
  players: string[];
  frame: FramePlayers[];
}

const PlayersCom: React.FC<PlayersProps> = ({players, frame}) => {
  const activePlayer = frame.find(player=>player.active)?.player;

  return (
    <div className={"container text-center"}>
      <div className={"row"}>
      <div className={"col-1"}><button>Reset</button></div>
        {players.map(player=>(
          <div className={"col"} key={player}>
            <div className={activePlayer === player ? 'activePlayer' : 'player'}>
              {player}
            </div>  
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayersCom;