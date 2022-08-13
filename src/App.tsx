import { useState, useEffect, useLayoutEffect } from 'react';
import './App.css';
import { DefaultApi } from './swagger-generated-client'; 
import { Frame, Frames, Player, Mark } from './model';
import Timer from './componets/timer';
import PlayersCom from './componets/player';
import Reset from './componets/reset';
import ModalCom from './componets/modal';

export interface ActiveState {activePlayer:string, activeFrame:number, activeTimer:boolean};
export interface ModalState {
  title: string;
  message: string;
  cancel: string;
  onCancel: (name?:any, remove?:boolean)=>void;
  confirm: string;
  onConfirm: (names?:any)=>void;
}

function App() {
  const client:DefaultApi = new DefaultApi({}, 'http://localhost:3123');
  const [id, setId] = useState<string>("0c39b11a-1123-44b5-ba74-72de7d5922fc");
  const [lane, setLane] = useState<number>(1);
  const [counter, setCounter] = useState<number>(0);
  const [active, setActive] = useState<ActiveState>({activePlayer:"", activeFrame: 1, activeTimer: true});
  const [players, setPlayers] = useState<Player[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [names, setNames] = useState<string[]>([]);
  const [value, setValue] = useState('');
  const [modal, setModal] = useState<ModalState>({
    title: "" ,
    message: "",
    cancel: "",
    onCancel: ()=>{},
    confirm: "",
    onConfirm: ()=>{},
  });

  const initializeGame = (players:Player[]) => {
    const active:ActiveState = {activePlayer:players[0].name, activeFrame: 1, activeTimer: true};
    setId("newId");  
    setPlayers(players);
    setNames([]);
    setOpenModal(false);
    setModal(resetModal);
    setCounter(0);
    setActive(active);
  };

  const switchModal = (modal:ModalState) => {
    setActive({activePlayer:'', activeFrame: 0, activeTimer: false});
    setModal(modal);
    setOpenModal(true);
  };

  const toggleModal = () => {
    setOpenModal(prevOpenModal => !prevOpenModal);
  };

  const resetModal:ModalState = {
    title: "Restart?",
    message: "Are you sure that you want to restart the game?",
    cancel: "Cancel",
    onCancel: toggleModal, 
    confirm: "Restart", 
    onConfirm: () => switchModal(newGameModal)
  };

  const newGameModal:ModalState = {
    title: "New Game",
    message: "Would you like to start a new game?",
    cancel: "Add Player",
    onCancel: (name:string, remove?:boolean) => {
      if(name) setNames(prevNames => [...prevNames, name]);
      if(remove) setNames(prevNames => prevNames.filter(string=>string !== name));
    },
    confirm: "Start",
    onConfirm: (names:string[]) => {
      const newPlayers:Player[] = names.map(name=>new Player(name));
      initializeGame(newPlayers);
    }
  };

  const completedGameModal:ModalState = {
    title: "Game Complete!",
    message: "Would you like to start another game?",
    cancel: "Quit",
    onCancel: () => switchModal(newGameModal),
    confirm: "Start",
    onConfirm: () => {
      players.forEach(player=>player.reset());
      initializeGame([...players]);
    }
  };  

  const updateGameState = () => { 
    let players:Player[] = [];
    let active:ActiveState = {activePlayer: '', activeFrame: 1, activeTimer: true};

    if(id && id !== "newId")client.gamesGet(id) // async await redux
    .then(res => {
      const body = res[0];
      const lane = body.lane;
      
      body.frames[0].players.forEach(player => {
        const name = player.player;
        let framesArray: Frame[] = [];

        body.frames.forEach(frame => {
          if (frame.active) active.activeFrame = frame.number;

          const thisPlayer = frame.players.find(player => player.player === name);
          if(thisPlayer?.active) active.activePlayer = thisPlayer.player;

          const downed = thisPlayer?.downed ? thisPlayer.downed : [];
          const completed = frame.complete;
          const mark = (thisPlayer?.mark ? thisPlayer.mark.toString() : null) as Mark;

          let newFrame = new Frame(frame.number,{ downed, completed, mark });
          newFrame.active = frame.active;

          framesArray.push(newFrame);
        });

        const frames = new Frames(framesArray);
        players.push(new Player(name, frames));
      });
      players.forEach(player=>player.total());

      setPlayers(players);
      setActive(active);
      setLane(lane);
      if(body.completed) {
        const winner = players.map((player => player.name + " : " + player.frames[9].total)).sort((a, b) => Number(b.split(":")[1]) - Number(a.split(":")[1]));
        setNames(winner)
        switchModal(completedGameModal);
      };
    })
    .catch(err => {
      console.error(err);
    }); 
  };

  useEffect(() => {
    if(active.activeTimer){
      const timerID = setInterval(() => {
        setCounter(prevCount => prevCount + 1);
        updateGameState();
      }, 1000);
      return () => clearInterval(timerID);
  }},[setCounter, active.activeTimer, updateGameState]);

  useLayoutEffect(()=>{
    if(id) {
      updateGameState();
      setModal(resetModal);
    } else {
      switchModal(newGameModal);
    }    
  },[id]);

  const firstBall = players.length > 0 ? players[0].frames[0] : new Frame(0);
  
  return (
    <div>
      <ModalCom {...modal} open={openModal} names={names} value={value} setValue={setValue}/>
      <Timer lane={lane} timer={counter}/>
      <div className={"container text-center"}>
        <div className={"game"}>
          <div className={"row"}>
            <Reset activeFrame={active.activeFrame} rolledFirstBall={firstBall.complete} resetModalToggle={toggleModal}/>
            {players.map(player=>(
              <PlayersCom player={player} activePlayer={active.activePlayer} key={player.name} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
