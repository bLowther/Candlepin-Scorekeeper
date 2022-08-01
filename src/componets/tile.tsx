import './tile.css';

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