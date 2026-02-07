export class Boomerang {
    constructor(x, y, direction) {
        this.x = x;
        this.y = y;
        this.width = 60; // Even bigger (was 40)
        this.height = 60;
        this.startX = x;

        // Direction: 1 (Right), -1 (Left)
        this.direction = direction;

        this.speedX = 20 * direction; // Faster launch
        this.speedY = -15; // Higher arc

        // Physics for a longer, higher curve
        this.acceleration = -0.25 * direction; // Reduced drag (was 0.5) -> Flies 2x further
        this.gravity = 0.5; // Gravity y

        this.markedForDeletion = false;
        this.rotation = 0;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        this.speedX += this.acceleration;
        this.speedY += this.gravity;

        this.rotation += 0.8; // Faster spin

        // Return logic:
        // We want it to come back. 
        // With current physics, it accelerates backwards in X.
        // And gravity pulls it down in Y. 
        // It might hit the ground or go off screen.

        // Simple catch condition: close to X start and moving towards it
        if (this.direction === 1 && this.speedX < 0 && this.x < this.startX) {
            this.markedForDeletion = true;
        }
        if (this.direction === -1 && this.speedX > 0 && this.x > this.startX) {
            this.markedForDeletion = true;
        }

        // Safety deletion if it hits ground or goes way off
        if (this.y > 5000 || this.x < -1000 || this.x > 3000) this.markedForDeletion = true;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.rotation);

        ctx.fillStyle = 'cyan';
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 3;

        // Draw V shape scaled to size
        const w = this.width / 2;
        const h = this.height / 2;

        ctx.beginPath();
        // V shape logic
        ctx.moveTo(-w, -h / 2);
        ctx.lineTo(0, h / 2);
        ctx.lineTo(w, -h / 2);
        ctx.lineTo(0, 0); // Inner point
        ctx.closePath();

        ctx.fill();
        ctx.stroke();

        ctx.restore();
    }
}
