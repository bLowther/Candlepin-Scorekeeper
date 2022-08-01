import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export interface ModalProps {
  open: boolean;
  title?: string;
  message: string;
  cancel: string;
  onCancel: ()=>void;
  confirm: string;
  onConfirm: (e: any)=>void;
}

const ModalCom: React.FC<ModalProps> = ({open, title, message, cancel, onCancel, confirm, onConfirm}) => {
  return (
    <Modal show={open} onHide={onCancel}>
    <Modal.Header style={{justifyContent:"center"}}>
      <Modal.Title>{title}</Modal.Title>
    </Modal.Header>
    <Modal.Body style={{textAlign:"center"}}>{message}</Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onCancel} style={{justifyContent:"space-between"}}>
        {cancel}
      </Button>
      <Button variant="success" onClick={onConfirm}>
        {confirm}
      </Button>
    </Modal.Footer>
  </Modal>
  )
}
export default ModalCom;