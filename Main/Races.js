class Races {

    static race1 = {
        cars: [
            {
                lane: 0, 
                car: Cars.getRandomColorCar(Cars.BASIC),
                speed: 14,
                acceleration: 1.3,
            },
            {
                lane: 1, 
                car: Cars.getRandomColorCar(Cars.BASIC),
                speed: 18,
                acceleration: 1.6,
            },
            {
                lane: 2, 
                car: Cars.getRandomColorCar(Cars.BASIC),
                speed: 20,
                acceleration: 1.7,
            },
            {
                lane: 3, 
                car: Cars.getRandomColorCar(Cars.BASIC),
                speed: 14,
                acceleration: 1.5,
            },
        ],
        length: 2500,
        reward: 100,
        locked: false,
        number: 1,
    }

    static race2 = {
        cars: [
            {
                lane: 0, 
                car: Cars.getRandomColorCar(Cars.BASIC),
                speed: 30,
                acceleration: 1.7,
            },
            {
                lane: 1, 
                car: Cars.getRandomColorCar(Cars.F2CARS),
                speed: 38,
                acceleration: 2.0,
            },
            {
                lane: 2, 
                car: Cars.getRandomColorCar(Cars.F2CARS),
                speed: 40,
                acceleration: 2.1,
            },
            {
                lane: 3, 
                car: Cars.getRandomColorCar(Cars.BASIC),
                speed: 35,
                acceleration: 1.8,
            },
        ],
        length: 7500,
        reward: 750,
        locked: true,
        number: 2,
    }

    static races = [this.race1, this.race2];

    static unlockRacesUpTo(raceIndex){
        for(let i = 0; i < Math.min(raceIndex+1, this.races.length); i++){
            this.unlockRace(this.races[i], false);
        }
    }

    static unlockRace(race, shop = true){
        race.locked = false;

        const racesElement = document.querySelector(".races").children;
        const racecEl = racesElement[race.number-1];
        racecEl.className = racecEl.className.replace(" locked", "");

        if(shop) Shop.upgradeShop();
    }

}