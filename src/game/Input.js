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

    // Touch Controls
    this.touchStartX = 0;
    this.lastTapTime = 0;

    window.addEventListener('touchstart', (e) => {
      // Prevent default to stop scrolling/zooming
      // e.preventDefault(); // Might block browser UI, be careful. 

      const touch = e.changedTouches[0];
      const x = touch.clientX;
      const width = window.innerWidth;

      // Movement Zones
      if (x < width / 2) {
        this.keys.ArrowLeft = true;
        this.keys.ArrowRight = false;
      } else {
        this.keys.ArrowRight = true;
        this.keys.ArrowLeft = false;
      }

      // Tap Logic
      const currentTime = new Date().getTime();
      const tapLength = currentTime - this.lastTapTime;

      if (tapLength < 300 && tapLength > 0) {
        // Double Tap -> Boomerang (Control)
        this.keys.Control = true;
        setTimeout(() => this.keys.Control = false, 200);
        this.keys.Space = false; // Cancel single tap kick if double tap
      } else {
        // Single Tap -> Kick (Space)
        // We set it true, but maybe we should wait to see if it's a double tap?
        // For responsiveness, let's fire Kick immediately. Double tap will just be Kick + Boomerang.
        this.keys.Space = true;
        setTimeout(() => this.keys.Space = false, 200);
      }
      this.lastTapTime = currentTime;
    }, { passive: false });

    window.addEventListener('touchend', (e) => {
      // frequent stops
      this.keys.ArrowLeft = false;
      this.keys.ArrowRight = false;
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
