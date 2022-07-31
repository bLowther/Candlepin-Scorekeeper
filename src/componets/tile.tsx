// import { FramePlayers } from '../swagger-generated-client';
import './tile.css';

// const Tile: React.FC<{player: FramePlayers}> = ({player}) => {
//   const mark = player.mark;
//   return (
//     <div className={"row"}>
//       <div className={"col"}>
//         <div className={"ten"}></div>
//       </div>
//       <div className={"col"}>
//         <div className={mark ? mark.toString() : "ten"}></div>
//       </div>
//     </div>
//   );
// };

const Tile: React.FC<{score:number, mark:string | null, active:boolean}> = ({score, mark, active}) => {
  return (
    <div className={"col"} >
      <div className={mark ? mark.toString() : "ten"} id={active ? 'active' : ''}>
        {score > 0 ? score : ''}
      </div>
    </div>
  );
};

export default Tile;