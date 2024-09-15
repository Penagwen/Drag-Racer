class Car{
    constructor({ lane, car, speed, acceleration, playerCar = false}){

        this.lane = lane;

        this.x = Camera.x - canvas.width/2 + 20;
        this.y = Lanes.getYFromLane(lane) + 20;
       

        this.velocity = {x:0, y:0};

        this.baseSpeed = speed;
        this.baseAcceleration = acceleration;

        this.maxSpeed = speed;
        this.speed = 0;
        this.acceleration = acceleration;

        this.speedRating = Math.round(convertRange( this.maxSpeed, [ 1, 1000 ], [ 1, 4 ] ));
        this.accelerationRating = Math.round(convertRange( this.acceleration, [ 1, 5 ], [ 1, 4 ] ));


        this.endPoint = 550;
        this.deceleration = -(this.maxSpeed*this.maxSpeed)/(2*this.endPoint);

        this.playerCar = playerCar;
        this.cameraFollowing = false;

        this.finished = false;

        // to make sure it was a press of the space bar and not just a hold
        this.spaceKeyDown = false;
        this.shouldSlowDown = false;
        this.spaceBarReleased = true;

        this.car = car;

        this.place = 0;
        this.endTime = 0;

        this.width = Lanes.HEIGHT;
        this.height = Lanes.HEIGHT * (this.car.height/this.car.width);
    }

    draw(){
        ctx.save();
        ctx.imageSmoothingEnabled = false;

        ctx.translate(this.x + this.height, this.y - 20);
        ctx.rotate(Math.PI / 2);

        ctx.drawImage(Cars.ALLCARS, 
            this.car.x, this.car.y, this.car.width, this.car.height,
            0, 0, this.width, this.height
        );
        ctx.restore();
    }

    update(){
        this.draw();

        if(this.playerCar && this.x >= Camera.x && !this.cameraFollowing) this.cameraFollowing = true;
        if(this.cameraFollowing) Camera.x = this.x;

        if(this.x > Main.FINISHLINE.x + 50 && !this.finished){
            this.finished = true;
            Lanes.addPlaceFinished(this.lane);
            this.place = Lanes.getPlaceFinished(this.lane);
            this.endTime = Date.now();

            // calculate the needed rate of deceleration until the car is +150 past the finish line
            const distanceLeft = this.endPoint - (this.x - Main.FINISHLINE.x);
            this.deceleration = - (this.speed * this.speed) / (2 * distanceLeft);
        }


        // cheeck if Race has started
        if(Main.currRace.started){
            
            if(!this.playerCar) this.botMove();
            else this.playerMove();

        }

        this.x += this.velocity.x * this.speed;
    }

    botMove(){
        if(this.finished){
            // decelerate
            this.speed = Math.max(this.speed + this.deceleration, 0);

            if(this.speed < 0.1){
                this.speed = 0;
                this.velocity.x = 0;
            }
        }else{
            this.speed = Math.min(this.speed + this.acceleration/9.25, this.maxSpeed);
        }
    }

    playerMove() {
        if (this.finished) {
            // Decelerate
            this.speed = Math.max(this.speed + this.deceleration, 0);
    
            if (this.speed < 0.1) {
                this.speed = 0;
                this.velocity.x = 0;
            }
    
            return;
        }
    
        // Handle space bar press
        if (Input.getKeyDown(" ")) {
            if (!this.spaceKeyDown && this.spaceBarReleased) {
                // Pressed the space bar after releasing it
                this.spaceKeyDown = true;
                this.spaceBarReleased = false;
                
                // Start counting the duration of the press
                this.spaceBarPressStartTime = Date.now();
    
                // Accelerate
                this.speed = Math.min(this.speed + this.acceleration, this.maxSpeed);
            }
        } else {
            if (this.spaceKeyDown) {
                // Space bar was released
                this.spaceKeyDown = false;
                this.spaceBarReleased = true;
    
                // Start deceleration immediately after releasing the space bar
                this.decelerationStartTime = Date.now();
            }
    
            const bufferTime = 500; // 500ms buffer time before deceleration
            const timeSinceRelease = Date.now() - this.decelerationStartTime;
    
            if (timeSinceRelease > bufferTime) {
                // Gradual deceleration
                this.speed = Math.max(this.speed * 0.99, 0);
            }
        }
    
        // Force deceleration if the space bar is held down for too long
        const maxPressDuration = 100; // Max duration the player can hold the space bar in ms
        const pressDuration = Date.now() - this.spaceBarPressStartTime;
    
        if (this.spaceKeyDown && pressDuration > maxPressDuration) {
            // Gradual deceleration while space bar is still pressed
            this.speed = Math.max(this.speed * 0.99, 0);
        }
    }

    reset(){
        this.x = Camera.x - canvas.width/2 + 20;
        this.y = Lanes.getYFromLane(this.lane) + 20;
       

        this.velocity = {x:0, y:0};

        this.cameraFollowing = false;

        this.finished = false;

        // to make sure it was a press of the space bar and not just a hold
        this.spaceKeyDown = false;
        this.shouldSlowDown = false;
        this.spaceBarReleased = true;

        this.place = 0;
        this.endTime = 0;
    }

    updateBoosts(){
        this.maxSpeed = this.baseSpeed + Main.speedBoost;
        this.acceleration = this.baseAcceleration + Main.accelerationBoost;
    }
}