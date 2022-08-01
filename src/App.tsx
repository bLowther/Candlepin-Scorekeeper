import { Component, ReactElement } from 'react';
import './App.css';
import { DefaultApi, Game } from './swagger-generated-client'; 
import { Frame, Frames, Player, Mark } from './model';
import Timer from './componets/timer';
import PlayersCom from './componets/player';
import Reset from './componets/reset';

export interface TimerState {secs:number; mins:number};
export interface ActiveState {activePlayer:string, activeFrame:number};

export interface AppState {
  id: string;
  players: Player[];
  active: ActiveState;
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
      players: [new Player("New Player")],
      active: {activePlayer:"New Player", activeFrame: 1},
      game: {
        id:"",
        frames: [{ 
          active: true, 
          complete: false, 
          number: 1, 
          players:[{ player: "New Player", mark: undefined, downed: [], ball: 0, active: false }] 
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

  resetGame(e: React.MouseEvent<HTMLButtonElement>){
    e.preventDefault();
    const players: Player[] = []
    const active: ActiveState = {activePlayer:'', activeFrame:1};
    const timer: TimerState = {secs:0, mins:0}
    
    this.state.players.forEach(player=>{player.reset(); players.push(player)})
    players[0].frames[0].active = true;
    active.activePlayer = players[0].name;
    
    this.setState({players, active, timer})
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
          const downed = thisPlayer?.downed ? thisPlayer?.downed : [];
          const completed = frame.complete;
          const mark = (thisPlayer?.mark ? thisPlayer.mark.toString() : null) as Mark;
          let newFrame = new Frame(frame.number,{ downed, completed, mark });
          newFrame.ball = downed.length;
          newFrame.active = frame.active;
          framesArray.push(newFrame);
        })
        const frames = new Frames(framesArray);
        players.push(new Player(name, frames));
      });
      players.forEach(player=>player.total());
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
    const firstBall = players[0].frames[0].ball ? players[0].frames[0].ball : 0
  
    return (
      <div>
        <Timer lane={game.lane} timer={timer}/>
        <div className={"container text-center"}>
          <div className={"game"}>
            <div className={"row"}>
              <Reset
                frames={players[0].frames}
                activeFrame={activeFrame}
                hasRolled={firstBall > 0}
                resetGame={this.resetGame.bind(this)}
              />
              {players.map(player=>(
               <PlayersCom player={player} activePlayer={activePlayer} key={player.name} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
