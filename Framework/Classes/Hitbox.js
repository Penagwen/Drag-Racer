class Hitbox{
    constructor({ x, y, width, height, parent, offsets={x:0, y:0} }){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.parent = parent;
        this.offsets = offsets;

        this.hitbox = this;
    }

    update(){
        this.x = this.parent.x - this.offsets.x;
        this.y = this.parent.y - this.offsets.y;  
    }

    render(){
        ctx.strokeStyle = "red";
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

    collision(hitbox){
        return (
            this.x < hitbox.x + hitbox.width &&
            this.x + this.width > hitbox.x &&
            this.y < hitbox.y + hitbox.height &&
            this.y + this.height > hitbox.y
        )
    }

    distance(hitbox){
        return Math.hypot(
            (hitbox.x + hitbox.width/2) - (this.x + this.width/2), 
            (hitbox.y + hitbox.height/2) - (this.y + this.height/2));
    }
}