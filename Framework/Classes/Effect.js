class Effect{
    constructor({ color, speed, friction=0.98, alphaDecay=0.01 }){

        this.particles = [];

        this.color = color;
        this.alpha = 1;

        this.speed = speed;
        this.friction = friction
        this.alphaDecay = alphaDecay;
        
    }

    addParticles({ particle, number }){
        for(let i = 0; i < number; i++){
            this.particles.push(particle(i));
        }
    }

    update(){

        this.particles.forEach(part => {
            part.update({ 
                speed: this.speed, 
                friction: this.friction 
            });
        });

        this.alpha -= this.alphaDecay;

    }
}