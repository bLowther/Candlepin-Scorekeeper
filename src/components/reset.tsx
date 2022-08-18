import { useState, FC, useEffect } from 'react';
import './reset.css';
import { Player } from '../core/player';
import ModalCom from './modal';

const iconPath = "M14.854 4.854a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 4H3.5A2.5 2.5 0 0 0 1 6.5v8a.5.5 0 0 0 1 0v-8A1.5 1.5 0 0 1 3.5 5h9.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4z";

interface ResetProps {
  completed:boolean;
  players:Player[]; 
  initializeGame:(players:Player[])=>void; 
  stopTimer:()=>void;
};

const Reset: FC<ResetProps> = ({ completed, players, initializeGame, stopTimer }) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [rolledFirstBall, setRolledFirstBall] = useState<boolean>(false);
  const [activeFrame, setActiveFrame] = useState<number>(0);
  const frames = [1,2,3,4,5,6,7,8,9,10];

  const toggleModal = () => {
    setOpenModal(prevOpenModal => !prevOpenModal);
  };

  const modalChange = () => {
    stopTimer();
    setOpenModal(true);
  };

  const initializeAndClose = (players:Player[]) => {
    initializeGame(players);
    setOpenModal(false);
    setRolledFirstBall(false);
  };

  useEffect(()=>{
    const firsplayer = players[0] || new Player('');
    if(!rolledFirstBall)setRolledFirstBall(firsplayer.frames[0].complete);
    const currentActive = firsplayer.frames.filter(frame => frame.active)[0].number;
    if(activeFrame !== currentActive)setActiveFrame(currentActive);
  },[players, rolledFirstBall, activeFrame]);

  return (
    <div className={"col-1"}>
      <ModalCom
        completed={completed}
        open={openModal}
        rolledFirstBall={rolledFirstBall}
        players={players}
        toggleModal={toggleModal}
        initializeGame={initializeAndClose}
        modalChange={modalChange}
      />
      <div className={"row"} style={{justifyContent: "right"}}>
        <button className={"reset"} onClick={toggleModal} style={rolledFirstBall ? {} : {visibility: "hidden"}} data-testid="ResetButton">
          <svg xmlns={"http://www.w3.org/2000/svg"} width={"24"} height={"16"} className={"bi bi-arrow-90deg-right"} viewBox={"0 0 16 16"}>
            <path d={iconPath}/>
          </svg>
        </button>
      </div>
      {frames.map(frame=>(
        <div className={"row"} style={{justifyContent: "right"}} key={frame} aria-label="Frame">
         <div className={activeFrame === frame ? "activeNumber" : "number" }>
           {frame}
         </div>
        </div>
      ))}
    </div>
  );
};

export default Reset;
