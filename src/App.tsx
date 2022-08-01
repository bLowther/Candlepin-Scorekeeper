import { Component, ReactElement } from 'react';
import './App.css';
import { DefaultApi } from './swagger-generated-client'; 
import { Frame, Frames, Player, Mark } from './model';
import Timer from './componets/timer';
import PlayersCom from './componets/player';
import Reset from './componets/reset';

export interface TimerState {secs:number; mins:number};
export interface ActiveState {activePlayer:string, activeFrame:number};

export interface AppState {
  id: string;
  lane: number;
  timer: TimerState;
  active: ActiveState;
  players: Player[];
  resestModal: boolean; 
}

export class App extends Component<{}, AppState> {
  #client: DefaultApi = new DefaultApi({}, 'http://localhost:3123');
  private timerID: any;
  constructor(props:any) {
    super(props);
    this.state = {
      id: "0c39b11a-1123-44b5-ba74-72de7d5922fc",
      lane: 1,
      timer: {secs:0, mins:0},
      active: {activePlayer:"New Player", activeFrame: 1},
      players: [new Player("New Player")],
      resestModal: false,
    };
  }

  counter() {
    const secs = this.state.timer.secs;
    const mins = this.state.timer.mins;
    const timer = secs === 59 ? {secs: 0, mins: mins + 1} : {secs: secs + 1, mins: mins};

    this.setState({timer});
  }

  toggleResetModal(){
    this.setState({resestModal: !this.state.resestModal});
  }

  resetGame(e: React.MouseEvent<HTMLButtonElement>){
    e.preventDefault();
    const players: Player[] = [];
    const active: ActiveState = {activePlayer:'', activeFrame:1};
    const timer: TimerState = {secs:0, mins:0};
    
    this.state.players.forEach(player=>{player.reset(); players.push(player)});
    players[0].frames[0].active = true;
    active.activePlayer = players[0].name;
    
    this.setState({players, active, timer});
    this.toggleResetModal();
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.counter(),
      1000
    );
    this.#client.gamesGet(this.state.id)
    .then(res => {
      const body = res[0];
      const lane = body.lane;
      let active = {activePlayer: '', activeFrame: 1};
      let players:any[] = [];
      
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
        });

        const frames = new Frames(framesArray);
        players.push(new Player(name, frames));
      });

      players.forEach(player=>player.total());
      this.setState({lane, players, active});
    })
    .catch(err => console.error(err));
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  render(): ReactElement {
    const { players, lane, timer, active:{activePlayer, activeFrame}, resestModal } = this.state;
    const firstBall = players[0].frames[0].ball ? players[0].frames[0].ball : 0;
  
    return (
      <div>
        <Timer lane={lane} timer={timer}/>
        <div className={"container text-center"}>
          <div className={"game"}>
            <div className={"row"}>
              <Reset
                frames={players[0].frames}
                activeFrame={activeFrame}
                hasRolled={firstBall > 0}
                open={resestModal}
                toggleResetModal={this.toggleResetModal.bind(this)}
                reset={this.resetGame.bind(this)}
              />
              {players.map(player=>(
               <PlayersCom player={player} activePlayer={activePlayer} key={player.name} />
              ))}
            </div>
          </div>
        </div>
        {/**EndGame Modal*/}
      </div>
    );
  }
}

export default App;
