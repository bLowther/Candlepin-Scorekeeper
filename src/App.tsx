import { Component, ReactElement } from 'react';
import './App.css';
import { DefaultApi } from './swagger-generated-client';

export interface AppState { }

export class App extends Component<{}, AppState> {
  #client: DefaultApi = new DefaultApi({}, 'http://localhost:3123');
  render(): ReactElement {
    return (
      <div>
        <h1>Candlepin!</h1>
      </div>
    );
  }
}

export default App;
