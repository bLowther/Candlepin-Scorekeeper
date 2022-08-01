import './tile.css';

export interface TileProps {
  score:number; 
  mark:string | null;
  active:boolean;
}

const Tile: React.FC<TileProps> = ({score, mark, active}) => {
  return (
    <div className={"col"} >
      <div className={mark ? mark.toString() : "ten"} id={active ? 'active' : ''}>
        {score > 0 ? score : ''}
      </div>
    </div>
  );
};

export default Tile;