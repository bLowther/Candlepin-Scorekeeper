import { Frame } from '../model';
import './reset.css';

const iconPath = "M14.854 4.854a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 4H3.5A2.5 2.5 0 0 0 1 6.5v8a.5.5 0 0 0 1 0v-8A1.5 1.5 0 0 1 3.5 5h9.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4z";

const Reset: React.FC<{frames: Frame[], activeFrame: number, hasRolled: boolean, resetGame:(e: any)=>void}> = ({frames, activeFrame, hasRolled, resetGame}) => {
  
  return (
    <div className={"col-1"}>
      <div className={"row"} style={{justifyContent: "right"}}>
        <button className={"reset"} onClick={resetGame} style={hasRolled ? {} : {visibility: "hidden"}}>
          <svg xmlns={"http://www.w3.org/2000/svg"} width={"24"} height={"16"} className={"bi bi-arrow-90deg-right"} viewBox={"0 0 16 16"}>
            <path d={iconPath}/>
          </svg>
        </button>
      </div>
      {frames.map(frame=>(
        <div className={"row"} style={{justifyContent: "right"}} key={frame.number}>
         <div key={frame.number} className={activeFrame === frame.number ? "activeNumber" : "number" } >
           {frame.number}
         </div>
       </div>
      ))}
    </div>  
  );
};

export default Reset;
