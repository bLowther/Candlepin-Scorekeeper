import { Component, ReactElement } from 'react';
import './App.css';
import { DefaultApi, Game } from './swagger-generated-client'; 

export interface AppState {
  id: string;
  game: Game;
  timer: number;
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
      timer: 0, 
    };
  }

  componentDidMount() {
    this.#client.gamesGet(this.state.id)
    .then(res => this.setState({game: res[0]}))
    .catch(err => console.error(err))
  }
  
  
  render(): ReactElement {
    return (
      <div>
      </div>
    );
  }
}

export default App;
