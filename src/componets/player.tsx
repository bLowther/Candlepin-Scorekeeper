import { Player } from '../model';
import FrameCom from './frame';
import './player.css';

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