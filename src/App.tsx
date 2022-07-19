import { Component, ReactElement } from 'react';
import './App.css';
import { DefaultApi, Game } from './swagger-generated-client'; 
import Timer from './componets/timer';

export interface AppState {
  id: string;
  game: Game;
  timer: string;
}

export class App extends Component<{}, AppState> {
  #client: DefaultApi = new DefaultApi({}, 'http://localhost:3123');

  constructor(props:any) {
    super(props);
    this.state = {
      id: "0c39b11a-1123-44b5-ba74-72de7d5922fc",
      game: {
        completed: new Date(),
        frames: [],
        id: "",
        lane: 1,
        started: new Date(),
      },
      timer: '', 
    };
  }

  componentDidMount() {
    this.#client.gamesGet(this.state.id)
    .then(res => {
      this.setState({game: res[0]});
    }
    )
    .catch(err => console.error(err))
  }

  updateTimer(cb:(date:Date)=>string) {
    const date = this.state.game.started;
    const startDate = typeof date === 'string' ? new Date(date) : date === undefined ? new Date() : date;
    const time = cb(startDate);

    this.setState({timer: time})
  }
  
  
  render(): ReactElement {
    const {timer, game:{ id } } = this.state;
    return (
      <div>
        <Timer timer={timer} updateTimer={this.updateTimer.bind(this)} gameId={id}/>
      </div>
    );
  }
}

export default App;
