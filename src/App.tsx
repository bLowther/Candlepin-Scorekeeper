import { Component, ReactElement } from 'react';
import './App.css';
import { DefaultApi, Game } from './swagger-generated-client'; 
import { Frame, Frames, Player, Mark } from './model';
import Timer from './componets/timer';
import PlayersCom from './componets/player';
// import FramesCom from './componets/frames';

export interface TimerState {secs:number; mins:number};

export interface AppState {
  id: string;
  players: Player[];
  active: {activePlayer:string, activeFrame:number};
  game: Game;
  timer: TimerState;
}

export class App extends Component<{}, AppState> {
  #client: DefaultApi = new DefaultApi({}, 'http://localhost:3123');
  private timerID: any;
  constructor(props:any) {
    super(props);
    this.state = {
      id: "0c39b11a-1123-44b5-ba74-72de7d5922fc",
      players: [new Player('')],
      active: {activePlayer:'', activeFrame: 1},
      game: {
        id:"",
        frames: [{ 
          active: true, 
          complete: false, 
          number: 1, 
          players:[{ player: "", mark: undefined, downed: [], ball: 0, active: false }] 
        }],
        lane: 1,
      },
      timer: {secs:0, mins:0}
    };
  }

  counter = () => {
    const secs = this.state.timer.secs;
    const mins = this.state.timer.mins;
    const timer = secs === 59 ? {secs: 0, mins: mins + 1} : {secs: secs + 1, mins: mins}

    this.setState({timer});
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.counter(),
      1000
    );
    this.#client.gamesGet(this.state.id)
    .then(res => {
      const body = res[0];
      let players:any[] = [];
      let active = {activePlayer: '', activeFrame: 1};
      body.frames[0].players.forEach(player => {
        const name = player.player;
        let framesArray: Frame[] = [];
        body.frames.forEach(frame => {
          if (frame.active) active.activeFrame = frame.number;
          const thisPlayer = frame.players.find(player => player.player === name);
          if(thisPlayer?.active) active.activePlayer = thisPlayer.player;
          const rolls = thisPlayer?.downed ? thisPlayer?.downed : [];
          const downed = rolls.reduce((total,  down ) => total + down, 0);
          const completed = frame.complete;
          const mark = (thisPlayer?.mark ? thisPlayer.mark.toString() : null) as Mark;
          let newFrame = new Frame(frame.number,{ downed, completed, mark });
          newFrame.ball = rolls.length;
          newFrame.active = frame.active;
          framesArray.push(newFrame);
        })
        const frames = new Frames(framesArray);
        players.push(new Player(name, frames));
      });
      let game = {
        id: body.id,
        frames: body.frames,
        lane: body.lane,
      }
      this.setState({game, players, active});
    })
    .catch(err => console.error(err));
  }

  

  componentWillUnmount() {
    clearInterval(this.timerID);
  }
  
  
  render(): ReactElement {
    const { players, game, timer, active:{activePlayer, activeFrame} } = this.state;
    return (
      <div>
        <Timer lane={game.lane} timer={timer}/>
        <div>
          <div className={"container text-center"}>
            <div className={"row"}>
            <div className={"col-1"}>
              <div className={"row"}><button>Reset</button></div>
              {players[0].frames.map(frame=>(
               <div key={frame.number}>{frame.number}{activeFrame === frame.number ? '!' : ''}</div>
              )) /**This needs to be pulled out into own componet and styled */}
            </div>
              {players.map(player=>(
               <PlayersCom player={player} activePlayer={activePlayer} key={player.name}/>
              ))}
            </div>
          </div>
          {/* <FramesCom frames={game.frames}/> */}
        </div>
      </div>
    );
  }
}

export default App;
