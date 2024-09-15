class Particle{
    constructor({ x, y, velocity }){

        this.x = x;
        this.y = y;
        this.velocity = velocity;

    }

    update({ speed, friction }){
        this.x += this.velocity.x * speed;
        this.y += this.velocity.y * speed;

        this.velocity.x *= friction;
        this.velocity.y *= friction;
    }
}