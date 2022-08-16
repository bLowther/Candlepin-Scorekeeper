import ModalCom from '../componets/modal';
import {render, screen} from '@testing-library/react'
import { Player } from '../core/player';

const testProps = {
  completed:false,
  open:false, 
  rolledFirstBall:false,
  players:[new Player('test')], 
  initializeGame:(players:Player[])=>{}, 
  toggleModal:()=>{},
  modalChange:()=>{},
};

test('', () => {
    render(<ModalCom  { ...testProps }/>);

});
