import { Player } from '../core/player';
import PlayersCom from '../componets/player';
import {render, screen} from '@testing-library/react'

const testProps = {
  player: new Player('test'),
  activePlayer: 'test'
};

test('Active player will have a green border', () => {
    render(<PlayersCom  { ...testProps }/>);
    const player = screen.getByText('test');
    expect(player).toHaveClass('activePlayer');
});
