export class Alien {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.width = 40;
        this.height = 40;

        this.x = Math.random() * (gameWidth - this.width);
        this.y = -this.height;

        this.speedY = Math.random() * 2 + 1; // Falling speed
        this.speedX = (Math.random() - 0.5) * 1; // Slight drift

        this.markedForDeletion = false;
        this.isKicked = false;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // If kicked, fly away fast!
        if (this.isKicked) {
            this.speedY -= 1.5; // Fly up
            this.speedX *= 1.1; // Accelerate side
        }

        // Remove if off screen
        if (this.y > this.gameHeight - this.height) { // Hit ground
            if (!this.isKicked) {
                this.landed = true;
            }
            this.markedForDeletion = true;
        }
        if (this.y < -200 || this.x < -100 || this.x > this.gameWidth + 100) {
            // Flew away
            this.markedForDeletion = true;
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.isKicked ? 'orange' : '#00ff00';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(this.x + 10, this.y + 15, 5, 0, Math.PI * 2);
        ctx.arc(this.x + 30, this.y + 15, 5, 0, Math.PI * 2);
        ctx.fill();
    }

    kick(direction) {
        this.isKicked = true;
        this.speedY = -15; // Launch up
        this.speedX = (Math.random() - 0.5) * 20; // Launch sideways randomly
    }
}
