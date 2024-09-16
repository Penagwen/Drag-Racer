class Main{

    static player;
    static selectedCarIndex = savedData.selectedCarIndex;
    static PLAYERS_GARAGE = savedData.PLAYERS_GARAGE.slice();
    static Parts = savedData.Parts.slice(); // parts they have

    static equippedParts = savedData.equippedParts.slice(); // max 3

    static speedBoost = savedData.speedBoost;
    static accelerationBoost = savedData.accelerationBoost;

    static maxRace = savedData.maxRace;

    static money = savedData.money;

    static currRace;
    static countDownNumber = 0;

    static DisplayHUD = false;

    static tutorialActive = !savedData.completedTutorial;
    static startedTutorialRace = false;
    static finishedTutorialRace = false;
    static goToShop = false;
    static wentToShop = false;
    static boughtEngine = false;
    static goToGarage = false;
    static wentToGarage = false;
    static wentToPartTab = false;
    static equippedEngine = false;

    static FINISHLINE = {
        x: -1000,
    }

    static Start(){
        this.ResetData();            

        // update car memory addresses
        this.PLAYERS_GARAGE.forEach((car) => {
            car.car = Cars.carTypes[car.type][car.color];
        });

        // update parts memory addresses
        this.Parts.forEach((part, index) => {
            this.Parts[index] = CarParts.CarPartTypes[CarParts.CarPartNames.indexOf(part.name)];
        });
        this.equippedParts.forEach((part, index) => {
            this.equippedParts[index] = CarParts.CarPartTypes[CarParts.CarPartNames.indexOf(part.name)];                
        });

        Shop.initShop();            

        if(this.PLAYERS_GARAGE.length === 0){
            this.PLAYERS_GARAGE.push({
                type: 0,
                color: "blue",
                car: Cars.carTypes[0]["blue"],
                speed: 15,
                acceleration: 1.3,
                playerCar: true,
                lane: 4,
            });
        }
        this.player = new Car(this.PLAYERS_GARAGE[this.selectedCarIndex]);
        Main.player.updateBoosts();

        this.updateGarageHTML();
        Shop.UpdateShop();

        Lanes.createLanes();
        Cars.init();

        HUD.Screen = HUD.SCREENS[0];
        this.DisplayHUD = true;

        Races.unlockRacesUpTo(this.maxRace);
        
        this.saveAllData();

        if(this.tutorialActive){ this.startTutorial();  }
        else {
            document.querySelector(".tutorial").style.display = "none";
            document.querySelector("body").style.pointerEvents = "auto";
        }
    }
    
    static Update(){
        Lanes.drawLanes();

        this.drawFinishLine();

        if(!!this.currRace){

            const cars = this.currRace.getCars();
            cars.forEach(car => {
                car.update();
            });


            this.currRace.checkIfRaceOver();
        }

        this.drawCountDown();

        
    }

    static saveAllData(){
        saveData("money", this.money);
        saveData("completedTutorial", !this.tutorialActive);
        saveData("maxRace", this.maxRace);
        saveData("selectedCarIndex", this.selectedCarIndex);
        saveData("PLAYERS_GARAGE", this.PLAYERS_GARAGE);
        saveData("Parts", this.Parts);
        saveData("equippedParts", this.equippedParts);
        saveData("speedBoost", this.speedBoost);
        saveData("accelerationBoost", this.accelerationBoost);
        saveData("featured", Shop.fetured);
        saveData("cars", Shop.cars);
        saveData("parts", Shop.parts);

        // save all data every second
        setTimeout(() => {
            this.saveAllData();
        }, 1000);
    }

    static ResetData(){
        savedData = {
            money: 0,
            completedTutorial: false,
            maxRace: 0,
            selectedCarIndex: 0,
            PLAYERS_GARAGE: [],
            Parts: [], // parts they have
        
            equippedParts: [], // max 3
        
            speedBoost: 0,
            accelerationBoost: 0,

            featured: [],
            cars: [],
            parts: [],
        }
        this.selectedCarIndex = savedData.selectedCarIndex;
        this.PLAYERS_GARAGE = savedData.PLAYERS_GARAGE.slice();
        this.Parts = savedData.Parts.slice(); // parts they have
        this.equippedParts = savedData.equippedParts.slice(); // max 3
        this.speedBoost = savedData.speedBoost;
        this.accelerationBoost = savedData.accelerationBoost;
        this.maxRace = savedData.maxRace;
        this.money = savedData.money;
        this.tutorialActive = !savedData.completedTutorial;
        
        Shop.fetured = [];
        Shop.cars = [];
        Shop.parts = [];
    }

    static drawFinishLine(){

        let color = true; // true - white, false - black

        for(let y = 0; y < Math.floor(canvas.height / 15)+1; y++){
            for(let x = 0; x < 3; x++){
                ctx.fillStyle = (color) ? "white" : "black";
                ctx.fillRect(this.FINISHLINE.x + x*15, (-canvas.height/2) + y*15, 15, 15);
                color = !color;
            }    
        }   
        
    }

    static drawCountDown(){
        if(this.countDownNumber === 4) {

            ctx.fillStyle = "rgb(150, 150, 150)";
            ctx.font = "100px Verdana";
            ctx.fillText("GO!", Camera.x - 75, Camera.y + 35);

        }else if(this.countDownNumber !== 0){

            ctx.fillStyle = "rgb(150, 150, 150)";
            ctx.font = "100px Verdana";
            ctx.fillText(this.countDownNumber, Camera.x - 25, Camera.y + 35);

        }
    }

    static newRace(race){
        if(this.tutorialActive){
            this.startedTutorialRace = true;
        }

        this.DisplayHUD = false;

        Camera.x = 0;
        Camera.y = 0;

        this.player.reset();
        Lanes.reset();

        this.currRace = new Race(this.player, race);
        if(!this.tutorialActive){
            this.currRace.start();   
        }
    }

    static equipPart(partIndex){
        if(this.tutorialActive){
            this.equippedEngine = true;
        }

        if(this.equippedParts.length < 3){
            this.equippedParts.push(this.Parts[partIndex]); 
            this.Parts[partIndex].apply();
            this.updateGarageHTML();
            return;
        }

        // remove the first element in the array
        this.equippedParts.shift();
        this.equippedParts.push(this.Parts[partIndex]);
        this.Parts[partIndex].apply();
        this.updateGarageHTML();
    }

    static unequipAllParts(){
        this.equippedParts.forEach((part) => {
            part.remove();
        }); 

        this.equippedParts = [];
        this.updateGarageHTML();
    }

    static unequipPart(partIndex){
        this.equippedParts.forEach((part, index) => {
            if(this.Parts[partIndex] === part){
                this.equippedParts.splice(index, 1);
                this.Parts[partIndex].remove();
            }
        });
        this.updateGarageHTML();
    }

    static equipCar(carIndex){
        // undo and redo car parts effects
        this.equippedParts.forEach((part) => {
            part.remove();
        });

        this.player = new Car(this.PLAYERS_GARAGE[carIndex]); 
        this.selectedCarIndex = carIndex; 
        this.updateGarageHTML();

        this.equippedParts.forEach((part) => {
            part.apply();
        });
    }

    static updateGarageHTML(){
        const garage = document.querySelector(".cars");
        garage.innerHTML = 
        `
        <div class='tabs'>
            <div class="tab" onclick="document.querySelector('.cars').id = 'carTab'; Main.updateGarageHTML();">
            <${(garage.id === "carTab") ? "u" : "span"}>Cars</${(garage.id === "carTab") ? "u" : "span"}>
            </div>
            <div class="tab partsTab" onclick="document.querySelector('.cars').id = 'partsTab'; Main.updateGarageHTML();">
                <${(garage.id === "partsTab") ? "u" : "span"}>Parts</${(garage.id === "partTab") ? "u" : "span"}>
            </div>
        </div>
        `;

        if(this.tutorialActive && document.querySelector('.cars').id === 'partsTab'){
            this.wentToPartTab = true;
        }
        if(garage.id === "carTab"){
            this.PLAYERS_GARAGE.forEach((car, index) => {
                garage.innerHTML += 
                `<div class="car ${(index === this.selectedCarIndex) ? 'selected' : ''}" onclick="Main.equipCar(${index});">
                    <p class="name">${Cars.getCarName(car.car)}</p>
                    <img src="./assets/image/Cars.png" style='
                        clip-path: polygon(
                            calc(${car.car.x}px * 1.5) calc(${car.car.y}px * 1.5),
                            calc(${car.car.x + car.car.width}px * 1.5) calc(${car.car.y}px * 1.5),
                            calc(${car.car.x + car.car.width}px * 1.5) calc(${car.car.y + car.car.height}px * 1.5),
                            calc(${car.car.x}px * 1.5) calc(${car.car.y + car.car.height}px * 1.5)
                        );
                        transform: translate(
                            calc(-${car.car.x - 32}px * 1.5),
                            calc(-${car.car.y}px * 1.5)
                        );
                    '>                
                    <p class="stats">Speed: ${car.speed}  |  Acceleration: ${car.acceleration}</p>
                </div>`;
            });
        }else{
            this.Parts.forEach((part, index) => {
                const equipped = Main.equippedParts.includes(part);
                
                garage.innerHTML += 
                `<div class="part ${(equipped) ? "selected" : ""}" onclick=${(equipped) ? `Main.unequipPart(${index});` : `Main.equipPart(${index});`}>
                    <p class="name">${part.name}</p>
                    <div class="image-wrapper"><img src="${part.image}"></div>
                    <p class="stats">Effect: ${part.effect}</p>
                </div>`;
            });

            // add clear all button
            garage.innerHTML += `
                <button onclick="Main.unequipAllParts();">Clear All</button>
            `
        }
    }


    // tutorial

    static async startTutorial(){
        const tutorial = document.querySelector(".tutorial");
        const tutorialText = tutorial.querySelector("p");

        this.typeSentence("Welcome to Drag Racer!", tutorialText);
        await this.waitForMs(2700);

        // promt the user to start a race
        tutorialText.innerHTML = "";
        tutorialText.style.fontSize = "small";
        this.moveTutorialText(400, 175, 150, 75, tutorial);
        this.typeSentence("Click this to start a race.", tutorialText, 50);

        const race = document.querySelector(".races").children[0];
        race.style.outline = "4px dashed cyan";
        race.style.outlineOffset = "5px";
        
        await this.waitForMs(1400);

        race.style.pointerEvents = "auto";

        await this.waitFor(_ => this.startedTutorialRace === true);

        race.style.outline = "";
        race.style.outlineOffset = "";
        race.style.pointerEvents = "auto";
        
        tutorialText.innerHTML = "";
        this.moveTutorialText(Camera.x + 350, Camera.y + canvas.height - 60, 250, 75, tutorial);
        this.typeSentence("This is your car. After the count down press space repeatedly to accelerate.", tutorialText, 50);

        await this.waitForMs(4500);

        tutorial.style.display = "none";
        this.moveTutorialText(-100, -100, 10, 10, tutorial);
        this.currRace.start();   

        await this.waitFor(_ => this.finishedTutorialRace === true);

        tutorial.style.display = "flex";
        tutorialText.innerHTML = "";
        tutorialText.style.fontSize = "xx-large";
        this.moveTutorialText(canvas.width/2, canvas.height/2, canvas.width/2, canvas.height/2, tutorial);
        this.typeSentence("Great Job, now Head over to the shop to buy some upgrades.", tutorialText, 50);
        
        await this.waitForMs(3000);

        this.goToShop = true;
        document.querySelector(".textHighlight").style.display = "block";

        await this.waitFor(_ => this.wentToShop === true);

        document.querySelector(".textHighlight").style.display = "none";

        tutorialText.innerHTML = "";
        tutorialText.style.fontSize = "large";
        this.moveTutorialText(canvas.width/2, 550, canvas.width/2, 100, tutorial);
        this.typeSentence("Scroll over to buy the Engine upgrade.", tutorialText, 50);

        await this.waitForMs(2000);

        document.querySelector(".shop").style.pointerEvents = "auto";

        const engine = document.querySelector(".CarParts").children[1];
        engine.style.outline = "4px dashed cyan";
        engine.style.outlineOffset = "5px";    

        await this.waitFor(_ => this.boughtEngine === true);


        engine.style.outline = "";
        engine.style.outlineOffset = "";

        tutorialText.innerHTML = "";
        tutorialText.style.fontSize = "xx-large";
        this.moveTutorialText(canvas.width/2, canvas.height/2, canvas.width/2, canvas.height/2, tutorial);
        this.typeSentence("Now head over to the garage.", tutorialText, 50);

        await this.waitForMs(1500);

        this.goToGarage = true;

        document.querySelector(".textHighlight").style.left = "535px";
        document.querySelector(".textHighlight").style.display = "block";

        await this.waitFor(_ => this.wentToGarage === true);

        tutorial.style.display = "none";
        this.moveTutorialText(-100, -100, 10, 10, tutorial);

        document.querySelector(".textHighlight").style.display = "none";

        document.querySelector("body").style.pointerEvents = "auto";
        document.querySelector(".tab.partsTab").style.outline = "4px dashed cyan";
        document.querySelector(".tab.partsTab").style.outlineOffset = "-3px";

        await this.waitFor(_ => this.wentToPartTab === true);

        document.querySelector(".tab.partsTab").style.outline = "";
        document.querySelector(".tab.partsTab").style.outlineOffset = "";

        document.querySelector(".part").style.outline = "4px dashed cyan";
        document.querySelector(".part").style.outlineOffset = "2.5px";

        await this.waitFor(_ => this.equippedEngine === true);

        tutorial.style.display = "flex";
        tutorialText.innerHTML = "";
        tutorialText.style.fontSize = "xx-large";
        this.moveTutorialText(canvas.width/2, canvas.height/2, canvas.width/2, canvas.height/2, tutorial);
        this.typeSentence("Great Job, now you should be ready to win! Play the race again.", tutorialText, 50);

        await this.waitForMs(5000);

        tutorial.style.display = "none";
        document.querySelector("body").style.pointerEvents = "auto";

        this.tutorialActive = false;
    }

    static moveTutorialText(x, y, width, height, tutorial){
        gsap.to(tutorial, {
            width: `${width}px`,
            height: `${height}px`,
            top: `${y}px`,
            left: `${x}px`,
            duration: 1,
        });
    }

    static async typeSentence(sentence, eleRef, delay = 100) {
        const letters = sentence.split("");
        let i = 0;
        while(i < letters.length) {
            await this.waitForMs(delay);
            eleRef.innerHTML += letters[i];
            i++
        }
        return;
    }
    
    
    static waitForMs(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    static waitFor(conditionFunction) {

        const poll = resolve => {
            if(conditionFunction()) resolve();
            else setTimeout(_ => poll(resolve), 100);
        }

        return new Promise(poll);
    }
}           
        
    
