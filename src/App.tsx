import { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import './App.css';
import { DefaultApi } from './swagger-generated-client'; 
import { Frame, Frames, Player, Mark } from './core/player';
import Timer from './componets/timer';
import PlayersCom from './componets/player';
import Reset from './componets/reset';

function App() {
  
  const [id, setId] = useState<string>("0c39b11a-1123-44b5-ba74-72de7d5922fc");
  const [lane, setLane] = useState<number>(1);
  const [activePlayer, setActivePlayer] = useState<string>("");
  const [activeTimer, setActiveTimer] = useState<boolean>(true);
  const [gameReset, setGameReset] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);
  const [players, setPlayers] = useState<Player[]>([]);

  const initializeNewGame = (players:Player[]) => {
    setGameReset(true);
    setCompleted(false);
    setId("newId");  
    setPlayers(players);
    setActivePlayer(players[0].name);
    setActiveTimer(true);
  };  

  const updateGameState = useCallback(() => { 
    const client:DefaultApi = new DefaultApi({}, 'http://localhost:3123');
    let players:Player[] = [];

    if(id && id !== "newId")client.gamesGet(id)
    .then(res => {
      const body = res[0];
      const currentLane = body.lane;
      
      body.frames[0].players.forEach(player => {
        const name = player.player;
        let framesArray: Frame[] = [];

        body.frames.forEach(frame => {

          const thisPlayer = frame.players.find(player => player.player === name);
          if(thisPlayer?.active) setActivePlayer(thisPlayer.player);

          const downed = thisPlayer?.downed || [];
          const completed = frame.complete;
          const mark = (thisPlayer?.mark?.toString() || null) as Mark;

          let newFrame = new Frame(frame.number,{ downed, completed, mark });
          newFrame.active = frame.active;

          framesArray.push(newFrame);
        });

        const frames = new Frames(framesArray);
        players.push(new Player(name, frames));
      });
      players.forEach(player=>player.total());

      setPlayers(players);
      if(lane !== currentLane)setLane(currentLane);
      if(gameReset) setGameReset(false);
      if(body.completed) setCompleted(true);
    })
    .catch(err => {
      console.error(err);
    }); 
  },[id, lane, gameReset]);

  useEffect(() => {
    if(activeTimer){
      const timerID = setInterval(() => {
        updateGameState();
      }, 1000);
      return () => clearInterval(timerID);
  }},[updateGameState, activeTimer]);

  useLayoutEffect(()=>{
    if(id) updateGameState();
  },[id, updateGameState]);
  
  return (
    <div>
      <Timer lane={lane} active={activeTimer} reset={gameReset}/>
      <div className={"container text-center"}>
        <div className={"game"}>
          <div className={"row"}>
            <Reset players={players} initializeGame={initializeNewGame} completed={completed} stopTimer={() => setActiveTimer(false)}/>
            {players.map(player=>(
              <PlayersCom player={player} activePlayer={activePlayer} key={player.name} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
