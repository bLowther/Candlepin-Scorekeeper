import ModalCom from '../componets/modal';
import {render, screen, fireEvent} from '@testing-library/react'
import { Player } from '../core/player';
import React from 'react';
import { Modal } from 'react-bootstrap';

const testProps = {
  completed:false,
  open:false, 
  rolledFirstBall:false,
  players:[new Player('test')], 
  initializeGame:(players:Player[])=>{}, 
  toggleModal:()=>{},
  modalChange:()=>{},
};

test('Modal will default to Restart when game is not complete', () => {
  const setStateMock = jest.fn();
  const useStateMock: any = (useState: any) => [useState, setStateMock];
  jest.spyOn(React, 'useState').mockImplementation(useStateMock);
  render(<ModalCom  { ...testProps }/>);
  expect(setStateMock).toHaveBeenCalled();
});


