export class Powerup {
    constructor(gameWidth, gameHeight, type) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.type = type; // 'red' (Health) or 'black' (Nuke)
        this.width = 30;
        this.height = 30;
        this.x = Math.random() * (gameWidth - this.width);
        this.y = -this.height;
        this.speedY = Math.random() * 2 + 2; // Fall speed
        this.markedForDeletion = false;
    }

    update() {
        this.y += this.speedY;

        if (this.y > this.gameHeight - this.height) {
            // Landed - maybe persist for a bit? For now, just remove when off screen or hit ground?
            // Let's make them disappear on ground contact for simplicity, or slowly blink out.
            // Simplicity: Disappear on ground.
            this.markedForDeletion = true;
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.type === 'red' ? 'red' : 'black';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Icon/Text
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.fillText(this.type === 'red' ? '+' : '💣', this.x + 5, this.y + 22);
    }
}
