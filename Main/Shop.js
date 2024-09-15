class Shop {

    static shopLevel = 1;

    // fetured - expensive cool stuff
    static fetured = savedData.featured;
    // cars - new cars  
    static cars = savedData.cars;
    // car parts - upgrades
    static parts = savedData.parts;

    static initShop(){
        if(this.fetured.length === 0){
            this.fetured.push(...[
                {
                    type: 4,
                    color: "orange",
                    car: Cars.SUPERCARS.orange,
                    speed: 100,
                    acceleration: 2.6,
                    playerCar: true,
                    lane: 4,
                    cost: 10000,
                    sold: false,
                },
                {
                    type: 3,
                    color: "green",
                    car: Cars.GOKARTS.green,
                    speed: 75,
                    acceleration: 2.1,
                    playerCar: true,
                    lane: 4,
                    cost: 7500,
                    sold: false,
                },
            ]);
        }
        if(this.cars.length === 0){
            this.cars.push(...[
                {
                    type: 2,
                    color: "red",
                    car: Cars.F2CARS.red,
                    speed: 25,
                    acceleration: 1.5,
                    playerCar: true,
                    lane: 4,
                    cost: 250,
                    sold: false,
                },
            ]);
        }
        if(this.parts.length === 0){
            this.parts.push(...[
                CarParts.Engine1,
                CarParts.Booster1,
            ]);
        }

        // update chop object memories
        this.fetured.forEach((car) => {
            const sold = car.sold;
            car.car = Cars.carTypes[car.type][car.color];
            car.sold = sold;
        });
        this.cars.forEach((car) => {
            const sold = car.sold;
            car.car = Cars.carTypes[car.type][car.color];
            car.sold = sold;
        });
        this.parts.forEach((part, index) => {
            const sold = part.sold;
            this.parts[index] = CarParts.CarPartTypes[CarParts.CarPartNames.indexOf(part.name)];  
            this.parts[index].sold = sold;              
        });
    }

    static UpdateShop(){
        const featuredItems = document.querySelector(".featured");
        const carItems = document.querySelector(".ShopCars");
        const parts = document.querySelector(".CarParts");

        featuredItems.innerHTML = "<p><u>Featured</u></p>";
        carItems.innerHTML = "<p><u>Cars</u></p>";
        parts.innerHTML = "<p><u>Parts</u></p>";


        const formatter = new Intl.NumberFormat('en-US');

        for(let i = 0; i < this.fetured.length; i++){
            const carStats = this.fetured[i];
            const car = carStats.car;
            const formattedNumber = formatter.format(carStats.cost);

            featuredItems.innerHTML += 
            `<div class="item ${(carStats.sold) ? "sold" : ""}" data-name="${Cars.getCarName(car)}" data-stats="Speed: ${carStats.speed}\nAcceleration: ${carStats.acceleration}" onclick='Shop.checkCost(this)'>
                <img src="./assets/image/Cars.png" style='
                    clip-path: polygon(
                        calc(${car.x}px * 3) calc(${car.y}px * 3),
                        calc(${car.x + car.width}px * 3) calc(${car.y}px * 3),
                        calc(${car.x + car.width}px * 3) calc(${car.y + car.height}px * 3),
                        calc(${car.x}px * 3) calc(${car.y + car.height}px * 3)
                    );
                    transform: translate(
                        calc(-${car.x - 28}px * 3),
                        calc(-${car.y - 10}px * 3)
                    );
                '>  
                <div class="cost">$${formattedNumber}</div>
            </div>`;
        }

        for(let i = 0; i < this.cars.length; i++){
            const carStats = this.cars[i];
            const car = carStats.car;
            const formattedNumber = formatter.format(carStats.cost);
            carItems.innerHTML += 
            `<div class="item ${(carStats.sold) ? "sold" : ""}" data-name="${Cars.getCarName(car)}" data-stats="Speed: ${carStats.speed}\nAcceleration: ${carStats.acceleration}" onclick='Shop.checkCost(this)'>
                <img src="./assets/image/Cars.png" style='
                    clip-path: polygon(
                        calc(${car.x}px * 3) calc(${car.y}px * 3),
                        calc(${car.x + car.width}px * 3) calc(${car.y}px * 3),
                        calc(${car.x + car.width}px * 3) calc(${car.y + car.height}px * 3),
                        calc(${car.x}px * 3) calc(${car.y + car.height}px * 3)
                    );
                    transform: translate(
                        calc(-${car.x - 28}px * 3),
                        calc(-${car.y - 10}px * 3)
                    );
                '>        
                <div class="cost">$${formattedNumber}</div>

            </div>`;
        }

        for(let i = 0; i < this.parts.length; i++){
            const part = this.parts[i];
            const formattedNumber = formatter.format(part.cost);

            parts.innerHTML += 
            `<div class="item ${(part.sold) ? "sold" : ""}" data-name="${part.name}" data-stats="${part.effect}" onclick='Shop.checkCost(this)'>
                <div class="image-wrapper"><img src="${part.image}"></div>
                <div class="cost">$${formattedNumber}</div>
            </div>`;

        }
 

        
        // spaceing 
        carItems.style.marginLeft = `${300 * this.fetured.length}px`;
        parts.style.marginLeft = `${300 * this.fetured.length + 300 * this.cars.length}px`;

    }

    static checkCost(item){
        if(item.className.includes("sold")) return;

        const cost = item.children[1].innerHTML.replace("$", "").replaceAll(",", "");

        if(Main.money >= cost){
            // buy
            item.className += " sold";

            gsap.to(Main, {
                money: Main.money - cost,
                duration: 0.5,
                ease: "power1.out",
            });
            let indexOfItem = 0;
            for(let i = 0; i < item.parentNode.children.length; i++){
                if(item.parentNode.children[i] == item){
                    indexOfItem = i;
                    break;
                }
            }

            if(item.parentNode.className === "CarParts"){
                // part
                if(Main.tutorialActive){
                    Main.boughtEngine = true;
                }
                Main.Parts.push(this.parts[indexOfItem-1]); 
                this.parts[indexOfItem-1].sold = true;
                Main.updateGarageHTML();
            }else{
                // car
                const type = (item.parentNode.className === "featured") ? this.fetured : this.cars;
                Main.PLAYERS_GARAGE.push(type[indexOfItem-1]); 
                type[indexOfItem-1].sold = true;
                Main.updateGarageHTML();
            }    
        }else {
            // can't buy
            item.className += " invalid";

            setTimeout(() => {
                item.className = "item";
            }, 500);
        }
    }

    static upgradeShop(){
        this.shopLevel ++;

        // remove sold items
        this.fetured.forEach((item, index) => {
            if(item.sold){
                this.fetured.splice(index, 1);
            }
        });
        this.cars.forEach((item, index) => {
            if(item.sold){
                this.cars.splice(index, 1);
            }
        });
        this.parts.forEach((item, index) => {
            if(item.sold){
                this.parts.splice(index, 1);
            }
        });

        if(this.shopLevel === 2){
            // level 2 items
            this.cars.push(...[
                {
                    type: 6,
                    color: "purple",
                    car: Cars.TRUCKS.purple,
                    speed: 35,
                    acceleration: 1.9,
                    playerCar: true,
                    lane: 4,
                    cost: 750,
                    sold: false,
                },
                {
                    type: 2,
                    color: "cyan",
                    car: Cars.F2CARS.cyan,
                    speed: 40,
                    acceleration: 1.9,
                    playerCar: true,
                    lane: 4,
                    cost: 1000,
                    sold: false,
                },
            ]);
            this.parts.push(...[
                CarParts.Engine2,
                CarParts.Booster2,
            ]);
        }

        this.UpdateShop();
    }
}