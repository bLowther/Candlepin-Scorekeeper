import { useState, useEffect, useLayoutEffect } from 'react';
import './App.css';
import { DefaultApi } from './swagger-generated-client'; 
import { Frame, Frames, Player, Mark } from './model';
import Timer from './componets/timer';
import PlayersCom from './componets/player';
import Reset from './componets/reset';
import ModalCom from './componets/modal';

export interface ActiveState {activePlayer:string, activeFrame:number};
export interface ModalState {
  title: string;
  message: string;
  cancel: string;
  onCancel: (name?:any, remove?:boolean)=>void;
  confirm: string;
  onConfirm: (names?:any)=>void;
}

function App() {
  const client: DefaultApi = new DefaultApi({}, 'http://localhost:3123');
  const [id, setId] = useState<string>("0c39b11a-1123-44b5-ba74-72de7d5922fc");
  const [lane, setLane] = useState<number>(1);
  const [counter, setCounter] = useState<number>(0);
  const [active, setActive] = useState<ActiveState>({activePlayer:"", activeFrame: 1});
  const [players, setPlayers] = useState<Player[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [names, setNames] = useState<string[]>([])
  const [modal, setModal] = useState<ModalState>({
    title: "" ,
    message: "",
    cancel: "",
    onCancel: ()=>{} ,
    confirm: "" ,
    onConfirm: ()=>{},
  });

  const toggleModal = () => {
    setOpenModal(prevOpenModal => !prevOpenModal);
  }

  const addRemovePlayer = (name:string, remove?:boolean) => {
    if(name) setNames(prevNames => [...prevNames, name])
    if(remove) setNames(prevNames => prevNames.filter(string=>string !== name))
  }

  const startgame = (names:string[]) => {
    let newPlayers = names.map(name=>new Player(name));
    newPlayers.forEach(player => player.frames[0].active = true);

    setNames([]);
    setActive({activePlayer:newPlayers[0].name, activeFrame: 1});
    setPlayers(newPlayers);
    setCounter(0);
    toggleModal();
  }

  const endGame = () => {
    const modal = {
      title: "New Game",
      message: "Would you like to start a new game?",
      cancel: "Add Player",
      onCancel: addRemovePlayer,
      confirm: "Start",
      onConfirm: startgame
    };
    setModal(modal);
    setOpenModal(true);
  }

  const finishGame = () => {
    const modal = {
      title: "Game Complete!",
      message: "Would you like to start another game?",
      cancel: "Quit",
      onCancel: endGame,
      confirm: "Start",
      onConfirm: resetGame
    };
    setId("");
    setModal(modal);
    setOpenModal(true);
  }  

  const setResetModal = () => {
    const modal = {
      title: "Restart?",
      message: "Are you sure that you want to restart the game?",
      cancel: "Cancel",
      onCancel: toggleModal, 
      confirm: "Restart", 
      onConfirm: endGame
    };
    setModal(modal);
    setOpenModal(false);
  }

  const resetGame = () => {
    const newPlayers: Player[] = [];
    const active: ActiveState = {activePlayer: '', activeFrame: 1};
    
    players.forEach(player=>{player.reset(); newPlayers.push(player)});
    newPlayers[0].frames[0].active = true;
    active.activePlayer = players[0].name;

    setResetModal();
    setPlayers(players);
    setActive(active);
    setCounter(0);
  }

  const updateGameState = () => { 
    let players:Player[] = [];
    let active = {activePlayer: '', activeFrame: 1};

    client.gamesGet(id) // async await
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
      setResetModal();
      setPlayers(players);
      setActive(active);
      setLane(lane);
    })
    .catch(err => {
      console.error(err);
    }); 
  }

  useEffect(() => {
    const timerID = setInterval(() => {
        setCounter(prevCount => prevCount + 1);
      },
      1000
    );
    return () => clearInterval(timerID);
  },[setCounter]);

  useLayoutEffect(()=>{
    if(id) {
      updateGameState();
    } else {
      endGame();
    }    
  },[id]);

  const firstBall = players.length > 0 ? players[0].frames[0] : new Frame(0);
  
  return (
    <div>
      <ModalCom {...modal} open={openModal} names={names}/>
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
