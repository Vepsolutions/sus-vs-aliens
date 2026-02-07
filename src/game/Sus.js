export class Sus {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.width = 80;
        this.height = 120;

        this.initialY = gameHeight - this.height - 20; // Grounded positions
        this.x = gameWidth / 2 - this.width / 2;
        this.y = this.initialY;

        this.image = new Image();
        this.image.src = '/sus.jpeg';

        this.speed = 0;
        this.maxSpeed = 7;

        this.isKicking = false;
        this.kickTimer = 0;
        this.kickDuration = 30; // frames

        this.jumpForce = 0;
        this.gravity = 0.8;
        this.groundY = this.initialY;

        this.lastDirection = 1; // 1 Right, -1 Left
        this.canShoot = true;
    }

    update(input) {
        // Movement
        if (input.keys.ArrowLeft) {
            this.speed = -this.maxSpeed;
            this.lastDirection = -1;
        }
        else if (input.keys.ArrowRight) {
            this.speed = this.maxSpeed;
            this.lastDirection = 1;
        }
        else this.speed = 0;

        this.x += this.speed;

        // Boundaries
        if (this.x < 0) this.x = 0;
        if (this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width;

        // Jump / Kick
        if (input.keys.Space && !this.isKicking && this.y === this.groundY) {
            this.isKicking = true;
            this.kickTimer = this.kickDuration;
            // Also small jump
            this.jumpForce = -10;
        }

        // Physics (Jump/Gravity)
        this.y += this.jumpForce;
        if (this.y < this.groundY) {
            this.jumpForce += this.gravity;
        } else {
            this.y = this.groundY;
            this.jumpForce = 0;
        }

        // Kick State
        if (this.isKicking) {
            this.kickTimer--;
            if (this.kickTimer <= 0) {
                this.isKicking = false;
            }
        }

        // Boomerang
        if (input.keys.Control && this.canShoot) {
            this.canShoot = false;
            // Simple cooldown or just trigger once per press (handled by input usually, but let's add delay)
            setTimeout(() => this.canShoot = true, 500);
            return { type: 'boomerang', x: this.x, y: this.y + this.height / 2, direction: this.lastDirection };
        }
    }

    draw(ctx) {
        ctx.save();

        // Apply global transformations first (like flipping)
        if (this.lastDirection === -1) {
            ctx.translate(this.x + this.width, this.y);
            ctx.scale(-1, 1);
            // When flipped, draw at 0,0 relative to the translated origin
            // If kicking, apply rotation around the center of the (flipped) image
            if (this.isKicking) {
                ctx.translate(this.width / 2, this.height / 2);
                ctx.rotate(-0.5); // Kick angle
                ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
            } else {
                ctx.drawImage(this.image, 0, 0, this.width, this.height);
            }
        } else {
            // Not flipped
            if (this.isKicking) {
                // Rotate effect for kick
                ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
                ctx.rotate(-0.5); // Kick angle
                ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
            } else {
                ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            }
        }

        ctx.restore();

        // Debug kickbox
        if (this.isKicking) {
            ctx.strokeStyle = 'red';
            ctx.strokeRect(this.x - 20, this.y - 20, this.width + 40, this.height + 20);
        }
    }

    getHitbox() {
        if (this.isKicking) {
            // Larger hitbox for kick
            return {
                x: this.x - 20,
                y: this.y - 20,
                width: this.width + 40,
                height: this.height + 20
            };
        }
        // Normal hitbox (body) - aliens shouldn't touch this
        return {
            x: this.x + 20,
            y: this.y + 20,
            width: this.width - 40,
            height: this.height - 20
        };
    }
}
