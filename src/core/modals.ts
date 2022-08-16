class Modal {
  onCancel: (...args:any) => void;
  onConfirm: (...args:any) => void;

  constructor(onCancel: (...args:any) => void, onConfirm: (...args:any) => void) {
    this.onCancel = onCancel;
    this.onConfirm = onConfirm
  }
}

export class ResetModal extends Modal {
  title: string = "Restart?";
  message: string = "Are you sure that you want to restart the game?";
  cancel: string = "Cancel";
  confirm: string = "Restart"; 
};

export class NewGameModal extends Modal {
  title: string = "New Game";
  message: string = "Would you like to start a new game?";
  cancel: string = "Add Player";
  confirm: string = "Start";
};

export class CompletedGameModal extends Modal {
  title: string = "Game Complete!";
  message: string = "Would you like to start another game?";
  cancel: string = "Quit";
  confirm: string = "Start";

};