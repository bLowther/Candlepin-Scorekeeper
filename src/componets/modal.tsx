import { Dispatch, SetStateAction, FC } from 'react';
import { ModalState } from '../App';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

interface ModalProps extends ModalState {
  open: boolean,
  names: string[],
  value: string,
  setValue: Dispatch<SetStateAction<string>>
}

const ModalCom: FC<ModalProps> = ({open, title, names, message, cancel, onCancel, confirm, onConfirm, value, setValue}) => {

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
      :title === "Game Complete!" ?  
        <ListGroup>
          <ListGroup.Item>Final Scores:</ListGroup.Item>
          {names.map((player, i)=>(
            <ListGroup.Item key={player + 'Modal'}>
              {`${i === 0 ? 'Winner! ' : i === 1 ? '2nd ' : i=== 2 ? '3rd ' : i+1 + 'th '} ${player}`}
            </ListGroup.Item>))}
        </ListGroup>
      : 
        <></>
      }
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