class Race {

    constructor(player, race){

        this.race = race;

        this.botCars = [];
        this.race.cars.forEach((data) => {
            this.botCars.push(new Car(data));
        });

        Main.FINISHLINE.x = this.race.length;

        this.playerCar = player;

        this.reward = 0;

        this.started = false;
        this.startTime = 0;

        this.TIMETOSTART = 3000; // ms
    }

    getCars(){
        return [...this.botCars, this.playerCar];
    }

    start(){
        this.countDown();

        setTimeout(() => {
            this.getCars().forEach(car => {
                car.velocity.x = 1;
            });
            this.started = true;
            this.startTime = Date.now();
        }, this.TIMETOSTART);
    }

    countDown(){
        
        Main.countDownNumber = 3;
        setTimeout(() => {
            Main.countDownNumber = 2;
        }, this.TIMETOSTART/3 * 1);
        setTimeout(() => {
            Main.countDownNumber = 1;
        }, this.TIMETOSTART/3 * 2);
        setTimeout(() => {
            Main.countDownNumber = 4;
        }, this.TIMETOSTART/3 * 3);
        setTimeout(() => {
            Main.countDownNumber = 0;
        }, this.TIMETOSTART/3 * 3 + 300);
    }

    checkIfRaceOver(){
        if(!this.started) return;


        let over = true;

        this.getCars().forEach((car) => {
            if(!car.finished || car.velocity.x == 1) over = false;
        });    

        if(over){            
            setTimeout(() => {
                if(this.started){
                    if(Main.tutorialActive){
                        Main.finishedTutorialRace = true;
                    }
                    const adjReward = this.calcReward(this.race.reward);
                    gsap.to(this, {
                        reward: adjReward,
                        duration: 0.5,
                        ease: "power1.out",
                    });
                    gsap.to(Main, {
                        money: Main.money + adjReward,
                        duration: 0.5,
                        ease: "power1.out",
                    });

                    // unlock new race if got first place for the first time
                    if(Races.races[Main.maxRace] === this.race && Lanes.getPlaceFinished(Main.player.lane) === 1){
                        Main.maxRace ++;
                        Races.unlockRace(Races.races[Main.maxRace]);
                    }    


                    this.started = false;
                    HUD.Screen = "Results";
                    Main.DisplayHUD = true;
                }
            }, 500);
        }
    }

    calcReward(baseReward){
        if(Main.tutorialActive) return 25;
        return Math.floor(baseReward / this.playerCar.place);
    }
}