import './tile.css';

export interface TileProps {
  score:number; 
  mark:string | null;
  active:boolean;
}

const Tile: React.FC<TileProps> = ({score, mark, active}) => {
  return (
    <div className={"col"} >
      <div className={mark ? mark.toString() : "ten"} style={active ? {borderColor: "green"} : {}}  data-testid="tile">
        {score > 0 ? score : ''}
      </div>
    </div>
  );
};

export default Tile;