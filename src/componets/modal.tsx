import React, {useState} from 'react';
import { ModalState } from '../App';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

export interface ModalProps extends ModalState {
  open: boolean,
  names: string[]
}

const ModalCom: React.FC<ModalProps> = ({open, title, names, message, cancel, onCancel, confirm, onConfirm}) => {
  const [value, setValue] = useState('');

  return (
    <Modal show={open} onHide={onCancel}>
    <Modal.Header style={{justifyContent:"center"}}>
      <Modal.Title>{title}</Modal.Title>
    </Modal.Header>
    <Modal.Body style={{textAlign:"center"}}>
      <h5>{message}</h5>
      {title === "New Game" ?  
        <ListGroup>
          <ListGroup.Item>Players to join:</ListGroup.Item>
          {names.map(player=>(
            <ListGroup.Item action onClick={()=>onCancel(player, true)} key={player + 'Modal'}>
              {player}
            </ListGroup.Item>))}
        </ListGroup>
        : <></>}
    </Modal.Body>
      {title === "New Game" ?
      <Modal.Footer style={{justifyContent:"center"}}> 
        <InputGroup size={"sm"}>
          <Button variant="outline-secondary" id="addPlayers" type="submit" onClick={()=>{onCancel(value); setValue('')}}>
            {cancel}
          </Button>
          <Form.Control
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </InputGroup>
        {names.length ?
        <Button variant="success" onClick={()=>onConfirm(names)}>
          {confirm}
        </Button>
        :
        <></>
        }
      </Modal.Footer>
      :
      <Modal.Footer style={{justifyContent:"space-between"}}> 
        <Button variant="secondary" onClick={onCancel} >
          {cancel}
        </Button>
        <Button variant="success" onClick={onConfirm}>
          {confirm}
        </Button>
      </Modal.Footer>
      } 
  </Modal>
  )
}
export default ModalCom;