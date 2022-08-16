import { Player } from '../core/player';
import PlayersCom from '../componets/player';
import {render, screen} from '@testing-library/react'

const testProps = {
  player: new Player('test'),
  activePlayer: 'test'
};

test('', () => {
    render(<PlayersCom  { ...testProps }/>);

});
