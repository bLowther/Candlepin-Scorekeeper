import { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import './App.css';
import { DefaultApi } from './swagger-generated-client'; 
import { Frame, Frames, Player } from './core/player';
import Timer from './components/timer';
import PlayersCom from './components/player';
import Reset from './components/reset';

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

  const updateGameState = useCallback(async () => { 
    const client:DefaultApi = new DefaultApi({}, 'http://localhost:3123');
    let players:Player[] = [];

    if(id && id !== "newId") {
      const res = await client.gamesGet(id);
      const body = res[0];
      const currentLane = body.lane;
        
      body.frames[0].players.forEach(player => {
        const name = player.player;
        let framesArray: Frame[] = [];

        body.frames.forEach((frame: { players: any[]; complete: any; number: number; active: boolean; }) => {
          const thisPlayer = frame.players.find(({player}) => player === name);
          if(thisPlayer.active) setActivePlayer(thisPlayer.player);
          const opts = {
            downed : thisPlayer.downed || [],
            completed : frame.complete,
            mark : thisPlayer.mark?.toString() || null
          };
          let newFrame = new Frame(frame.number,opts);
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
    }
  },[id, lane, gameReset]);

  useEffect(() => {
    if(activeTimer){
      const timerID = setInterval(() => {
        updateGameState();
      }, 500);
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
