import { useState, FC, useEffect, useCallback, useMemo, useLayoutEffect } from 'react';
import { ResetModal, NewGameModal, CompletedGameModal} from '../core/modals';
import { Player } from '../core/player';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

interface ModalState {
  title: string;
  message: string;
  cancel: string;
  onCancel: (name?:any, remove?:boolean)=>void;
  confirm: string;
  onConfirm: (names?:any)=>void;
}

interface ModalProps {
  completed:boolean;
  open:boolean; 
  rolledFirstBall:boolean;
  players:Player[]; 
  initializeGame:(players:Player[])=>void; 
  toggleModal:()=>void;
  modalChange:()=>void;
}

const ModalCom: FC<ModalProps> = ({completed, open, rolledFirstBall, players, initializeGame, toggleModal, modalChange}) => {
  const [value, setValue] = useState('');
  const [names, setNames] = useState<string[]>([]);
  const [modal, setModal] = useState<ModalState>({
    title: "" ,
    message: "",
    cancel: "",
    onCancel: ()=>{},
    confirm: "",
    onConfirm: ()=>{},
  });

  const switchModal = useCallback((modal:ModalState) => {
    modalChange();
    setModal(modal);
  },[modalChange]);

  const addRemovePlayer= useCallback((name:string, remove?:boolean) => {
    if(name) setNames(prevNames => [...prevNames, name]);
    if(remove) setNames(prevNames => prevNames.filter(string=>string !== name));
  },[]);

  const modalInitialize= useCallback((players:Player[]) => {
    initializeGame(players);
    setNames([]);
  },[initializeGame]);

  const startNewGame = useCallback((names:string[]) => {
    const newPlayers:Player[] = names.map(name=>new Player(name));
    modalInitialize(newPlayers);
  },[modalInitialize]);

  const playAgain = useCallback(() => {
    players.forEach(player=>player.reset());
    modalInitialize([...players]);
  },[players, modalInitialize]);

  const newGameModal:ModalState = useMemo(() => new NewGameModal(addRemovePlayer, startNewGame),[addRemovePlayer, startNewGame]);
  const resetModal:ModalState = useMemo(() => new ResetModal(toggleModal,() => switchModal(newGameModal)),[toggleModal, switchModal, newGameModal]);
 
  
  useEffect(()=>{
    if(completed) {     
      const winner = players.map((player => player.name + " : " + player.frames[9].total)).sort((a, b) => Number(b.split(":")[1]) - Number(a.split(":")[1]));
      setNames(winner);

      const completedGameModal:ModalState = new CompletedGameModal(() => {switchModal(newGameModal); setNames([])}, playAgain);
      switchModal(completedGameModal);
    };
  },[completed, players, switchModal, playAgain, newGameModal]);

  useLayoutEffect(()=>{if(!rolledFirstBall)setModal(resetModal);},[resetModal, rolledFirstBall]);

  return (   
    <Modal show={open} onHide={modal.onCancel}>
    <Modal.Header style={{justifyContent:"center"}}>
      <Modal.Title>{modal.title}</Modal.Title>
    </Modal.Header>
    <Modal.Body style={{textAlign:"center"}}>
      <h5>{modal.message}</h5>
      {modal.title === "New Game" ?  
        <ListGroup>
          <ListGroup.Item>Players to join:</ListGroup.Item>
          {names.map(player=>(
            <ListGroup.Item action onClick={()=>modal.onCancel(player, true)} key={player + 'Modal'}>
              {player}
            </ListGroup.Item>))}
        </ListGroup>
      :modal.title === "Game Complete!" ?  
        <ListGroup>
          <ListGroup.Item>Final Scores:</ListGroup.Item>
          {names.map((player, i)=>(
            <ListGroup.Item key={player + 'Modal'}>
              {`${i === 0 ? 'Winner! ' : i === 1 ? '2nd ' : i === 2 ? '3rd ' : i + 1 + 'th '} ${player}`}
            </ListGroup.Item>))}
        </ListGroup>
      : 
        <></>
      }
    </Modal.Body>
    {modal.title === "New Game" ?
      <Modal.Footer style={{justifyContent:"center"}}> 
        <InputGroup size={"sm"}>
          <Button variant="outline-secondary" id="addPlayers" type="submit" onClick={()=>{modal.onCancel(value); setValue('')}}>
            {modal.cancel}
          </Button>
          <Form.Control
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </InputGroup>
        {names.length ?
          <Button variant="success" onClick={()=>modal.onConfirm(names)}>
            {modal.confirm}
          </Button>
        :
          <></>
        }
      </Modal.Footer>
    :
      <Modal.Footer style={{justifyContent:"space-between"}}> 
        <Button variant="secondary" onClick={modal.onCancel} >
          {modal.cancel}
        </Button>
        <Button variant="success" onClick={modal.onConfirm}>
          {modal.confirm}
        </Button>
      </Modal.Footer>
    } 
  </Modal>
  )
}

export default ModalCom;