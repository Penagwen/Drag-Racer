class Cars{

    static ALLCARS = new Image();

    static BASIC = {
        blue: { x: 320, y: 32, width: 32, height: 48,},
        orange: { x: 352, y: 32, width: 32, height: 48,},
        purple: { x: 384, y: 32, width: 32, height: 48,},
        black: { x: 320, y: 80, width: 32, height: 48,},
        lavender: { x: 352, y: 80, width: 32, height: 48,},
        yellow: { x: 384, y: 80, width: 32, height: 48,},

        red: { x: 320, y: 142, width: 32, height: 48,},
        american: { x: 352, y: 142, width: 32, height: 48,},
        orange2: { x: 384, y: 142, width: 32, height: 48,},
        lime: { x: 320, y: 190, width: 32, height: 48,},
        white: { x: 352, y: 190, width: 32, height: 48,},
        grey: { x: 384, y: 190, width: 32, height: 48,},
    }

    static F1CARS = {
        red: { x: 32, y: 32, width: 32, height: 48,},
        orange: { x: 64, y: 32, width: 32, height: 48,},
        pink: { x: 96, y: 32, width: 32, height: 48,},
        blue: { x: 32, y: 80, width: 32, height: 48,},
        yellow: { x: 64, y: 80, width: 32, height: 48,},
        black: { x: 96, y: 80, width: 32, height: 48,},
    }

    static F2CARS = {
        red: { x: 32, y: 142, width: 32, height: 48,},
        blue: { x: 64, y: 142, width: 32, height: 48,},
        orange: { x: 96, y: 142, width: 32, height: 48,},
        green: { x: 32, y: 190, width: 32, height: 48,},
        cyan: { x: 64, y: 190, width: 32, height: 48,},
        pink: { x: 96, y: 190, width: 32, height: 48,},
    }

    static GOKARTS = {
        red: { x: 32, y: 252, width: 32, height: 48,},
        pink: { x: 64, y: 252, width: 32, height: 48,},
        blue: { x: 96, y: 252, width: 32, height: 48,},
        lime: { x: 32, y: 300, width: 32, height: 48,},
        green: { x: 64, y: 300, width: 32, height: 48,},
        orange: { x: 96, y: 300, width: 32, height: 48,},
    }

    static SUPERCARS = {
        red: { x: 144, y: 32, width: 32, height: 48,},
        darkBlue: { x: 176, y: 32, width: 32, height: 48,},
        white: { x: 208, y: 32, width: 32, height: 48,},
        orange: { x: 240, y: 32, width: 32, height: 48,},
        pink: { x: 272, y: 32, width: 32, height: 48,},
        green: { x: 144, y: 80, width: 32, height: 48,},
        blue: { x: 176, y: 80, width: 32, height: 48,},
        purple: { x: 208, y: 80, width: 32, height: 48,},
        black: { x: 240, y: 80, width: 32, height: 48,},
        yellow: { x: 272, y: 80, width: 32, height: 48,},
    }

    static SPORTSCARS = {
        pink: { x: 144, y: 32, width: 32, height: 48,},
        brown: { x: 176, y: 32, width: 32, height: 48,},
        lightBlue: { x: 208, y: 32, width: 32, height: 48,},
        red: { x: 240, y: 32, width: 32, height: 48,},
        cyan: { x: 272, y: 32, width: 32, height: 48,},
        purple: { x: 144, y: 80, width: 32, height: 48,},
        green: { x: 176, y: 80, width: 32, height: 48,},
        blue: { x: 208, y: 80, width: 32, height: 48,},
        black: { x: 240, y: 80, width: 32, height: 48,},
        orange: { x: 272, y: 80, width: 32, height: 48,},
    }

    static TRUCKS = {
        red: { x: 144, y: 252, width: 32, height: 48,},
        blue: { x: 176, y: 252, width: 32, height: 48,},
        grey: { x: 208, y: 252, width: 32, height: 48,},
        purple: { x: 144, y: 300, width: 32, height: 48,},
        white: { x: 176, y: 300, width: 32, height: 48,},
        american: { x: 208, y: 300, width: 32, height: 48,},
    }

    // static Bugeys = {
    //     orange: { x: 240, y: 252, width: 48, height: 48,},
    //     purple: { x: 240, y: 300, width: 48, height: 48,},
    // }

    static carTypes = [this.BASIC, this.F1CARS, this.F2CARS, this.GOKARTS, this.SUPERCARS, this.SPORTSCARS, this.TRUCKS];        
    static carNames = ["Basic", "F1 Car", "F2 Car", "Go Kart", "Super Car", "Sports Car", "Truck"];

    static init(){
        this.ALLCARS.src = "./assets/image/Cars.png"
    }

    static getRandomCar(){
        const randomCarType = this.carTypes[ Math.floor(Math.random() * (this.carTypes.length)) ];

        const carColors = Object.keys(randomCarType);
        const randomCarColor = carColors[ Math.floor(Math.random() * (carColors.length)) ];

        return randomCarType[randomCarColor];
    }

    static getRandomColorCar(carType){
        const carColors = Object.keys(carType);
        const randomCarColor = carColors[ Math.floor(Math.random() * (carColors.length)) ];

        return carType[randomCarColor];
    }

    static getCarName(car){
        let name = "";
        this.carTypes.forEach((type, i) => {
            Object.values(type).forEach((data, index) => {
                if(data === car){
                    name = capitalizeFirstLetter(Object.keys(type)[index]);
                    name += " "+this.carNames[i];
                }
            });
        });
        return name;
    }
}