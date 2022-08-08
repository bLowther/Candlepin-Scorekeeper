import React, {useState} from 'react';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

export interface ModalProps {
  open: boolean;
  title: string;
  names: string[];
  message: string;
  cancel: string;
  onCancel: (name?:any)=>void;
  confirm: string;
  onConfirm: ()=>void;
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
            <ListGroup.Item action onClick={onCancel} key={player + 'Modal'}>
              {player}
            </ListGroup.Item>))}
        </ListGroup>
        : <></>}
    </Modal.Body>
    <Modal.Footer style={{justifyContent:"space-between"}}>
      {title === "New Game" ? 
        <InputGroup size={"sm"}>
          <Button variant="outline-secondary" id="addPlayers" type="submit" onClick={()=>{onCancel(value); setValue('')}}>
            {cancel}
          </Button>
          <Form.Control
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </InputGroup>
      : <Button variant="secondary" onClick={onCancel} >
        {cancel}
      </Button>
      }
      <Button variant="success" onClick={onConfirm}>
        {confirm}
      </Button>
    </Modal.Footer>
  </Modal>
  )
}
export default ModalCom;