export class InputHandler {
  constructor() {
    this.keys = {
      ArrowLeft: false,
      ArrowRight: false,
      Space: false,
      Enter: false,
      Control: false
    };

    this.keySequence = [];
    this.cheatCode = 'kuur';

    window.addEventListener('keydown', (e) => {
      if (e.code === 'ArrowLeft') this.keys.ArrowLeft = true;
      if (e.code === 'ArrowRight') this.keys.ArrowRight = true;
      if (e.code === 'Space') this.keys.Space = true;
      if (e.code === 'Enter') this.keys.Enter = true;

      // Shotgun approach for Control key
      if (e.ctrlKey || e.key === 'Control' || e.code === 'ControlLeft' || e.code === 'ControlRight') {
        console.log('Control key detected');
        this.keys.Control = true;
        // e.preventDefault(); // Ctrl usually triggers browser shortcuts, might be annoying but let's keep it safe
      }

      // Cheat Code Detection
      this.keySequence.push(e.key);
      if (this.keySequence.length > this.cheatCode.length) {
        this.keySequence.shift();
      }
      if (this.keySequence.join('') === this.cheatCode) {
        this.triggerCheat = true;
        this.keySequence = [];
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'ArrowLeft') this.keys.ArrowLeft = false;
      if (e.code === 'ArrowRight') this.keys.ArrowRight = false;
      if (e.code === 'Space') this.keys.Space = false;
      if (e.code === 'Enter') this.keys.Enter = false;
      if (e.key === 'Control' || e.code === 'ControlLeft' || e.code === 'ControlRight') {
        this.keys.Control = false;
      }
    });
  }

  isDown(key) {
    return this.keys[key];
  }

  checkCheat() {
    if (this.triggerCheat) {
      this.triggerCheat = false;
      return true;
    }
    return false;
  }
}
