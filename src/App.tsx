import { Component, ReactElement } from 'react';
import './App.css';
import { DefaultApi } from './swagger-generated-client'; 
import { Frame, Frames, Player, Mark } from './model';
import Timer from './componets/timer';
import PlayersCom from './componets/player';
import Reset from './componets/reset';
import ModalCom, { ModalProps } from './componets/modal';

export interface TimerState {secs:number; mins:number};
export interface ActiveState {activePlayer:string, activeFrame:number};

export interface AppState {
  id: string;
  lane: number;
  timer: TimerState;
  active: ActiveState;
  players: Player[];
  modal: ModalProps 
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
      active: {activePlayer:"", activeFrame: 1},
      players: [],
      modal: {
        open: false,
        title: "" ,
        names: [],
        message: "",
        cancel: "",
        onCancel: ()=>{} ,
        confirm: "" ,
        onConfirm: ()=>{},
      }
    };
  }

  counter() {
    const secs = this.state.timer.secs;
    const mins = this.state.timer.mins;
    const timer = secs === 59 ? {secs: 0, mins: mins + 1} : {secs: secs + 1, mins: mins};

    this.setState({timer});
    this.updateGameState();
  }

  toggleModal(){
    let modal = {...this.state.modal};
    modal.open = !modal.open;
    this.setState({modal});
  }

  addPlayer(name:string){
    if(name) {
      let modal = {...this.state.modal};
      modal.names.push(name);
      this.setState({modal});  
    }
  }

  startgame(){
    const players = this.state.modal.names.map(name=>new Player(name));
    if(players.length > 0) {
      this.timerID = setInterval(
        () => this.counter(),
        1000
      );
      const timer: TimerState = {secs:0, mins:0};
      const active = {activePlayer:players[0].name, activeFrame: 1};
      players[0].frames[0].active = true;
      this.setState({players, active, timer});
      this.toggleModal();
    } else {
      alert("You need to add a player")
    }
  }

  endGame(){
    if(this.timerID)clearInterval(this.timerID);
    const modal: ModalProps = {
      open: true,
      title: "New Game" ,
      names: [],
      message: "Would you like to start a new game?",
      cancel: "Add Player",
      onCancel: this.addPlayer.bind(this) ,
      confirm: "Start" ,
      onConfirm: this.startgame.bind(this)
    }
    this.setState({id: "", modal});
  }

  finishGame() {
    const modal: ModalProps = {
      open: true,
      title: "Game Complete!" ,
      names: [],
      message: "Would you like to start another game?",
      cancel: "Quit",
      onCancel: this.endGame.bind(this) ,
      confirm: "Start" ,
      onConfirm: this.resetGame.bind(this)
    }
    this.setState({ modal });
  }  

  setResetModal() {
    const modal: ModalProps = {
      open: false,
      title: "Restart?",
      names: [],
      message: "Are you sure that you want to restart the game?",
      cancel: "Cancel",
      onCancel: this.toggleModal.bind(this), 
      confirm: "Restart", 
      onConfirm: this.endGame.bind(this)
    }
    this.setState({ modal });
  }

  resetGame(){
    const players: Player[] = [];
    const active: ActiveState = {activePlayer: '', activeFrame: 1};
    const timer: TimerState = {secs:0, mins:0};
    
    this.state.players.forEach(player=>{player.reset(); players.push(player)});
    players[0].frames[0].active = true;
    active.activePlayer = players[0].name;

    this.setResetModal();
    this.setState({players, active, timer});
  }

  updateGameState() { 
    let players:Player[] = [];
    let active = {activePlayer: '', activeFrame: 1};

    this.#client.gamesGet(this.state.id)
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

          const downed = thisPlayer?.downed ? thisPlayer?.downed : [];
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
      this.setResetModal();
      this.setState({lane, players, active});
    })
    .catch(err => {
      clearInterval(this.timerID);
      console.error(err);
    }); 
  }

  componentDidMount() {
    if(this.state.id) {
      this.timerID = setInterval(
        () => this.counter(),
        1000
      );

      this.updateGameState();
    } else {
      this.endGame();
    }

  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  render(): ReactElement {
    const { players, lane, timer, active:{activePlayer, activeFrame}, modal, } = this.state;
    const firstBall = players.length > 0 ? players[0].frames[0] : new Frame(0);
  
    return (
      <div>
        <ModalCom {...modal}/>
        <Timer lane={lane} timer={timer}/>
        <div className={"container text-center"}>
          <div className={"game"}>
            <div className={"row"}>
              <Reset activeFrame={activeFrame} firstBall={firstBall.complete} resetModalToggle={this.toggleModal.bind(this)}/>
              {players.map(player=>(
               <PlayersCom player={player} activePlayer={activePlayer} key={player.name} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default App;
