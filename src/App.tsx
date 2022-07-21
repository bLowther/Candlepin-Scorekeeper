import { Component, ReactElement } from 'react';
import './App.css';
import { DefaultApi, Game, FramePlayers } from './swagger-generated-client'; 
import Timer from './componets/timer';
import PlayersCom from './componets/player';
import FramesCom from './componets/frames';

export interface AppState {
  id: string;
  players:string[];
  game: Game;
  timer: {secs:number; mins:number};
}

export class App extends Component<{}, AppState> {
  #client: DefaultApi = new DefaultApi({}, 'http://localhost:3123');
  private timerID: any;
  constructor(props:any) {
    super(props);
    this.state = {
      id: "0c39b11a-1123-44b5-ba74-72de7d5922fc",
      players: [],
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
      let players: string[] = [];
      body.frames[0].players.forEach(player => {const name = player.player; players.push(name)});
      let game = {
        id: body.id,
        players: players,
        frames: body.frames,
        lane: body.lane,
      }
      this.setState({game, players});
    })
    .catch(err => console.error(err));
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }
  
  
  render(): ReactElement {
    const { players, game:{ frames, lane }, timer } = this.state;
    const activeFrame = frames.find(frame => frame.active);
    const backup: FramePlayers = { player:''}
    return (
      <div>
        <Timer lane={lane} timer={timer}/>
        <div>
          <PlayersCom players={players} frame={activeFrame ? activeFrame.players : [backup]}/>
          <FramesCom frames={frames}/>
        </div>
      </div>
    );
  }
}

export default App;
