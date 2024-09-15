class HUD {

    static SCREENS = [
        "Home", 
        "Results",
        "Garage",
        "Shop",
        "Settings",
        `$${0}` // money display
    ]

    static Screen = "Home"

    static Buttons = [];

    static raceSelect = document.querySelector(".races");
    static carSelect = document.querySelector(".cars");
    static shopSelect = document.querySelector(".shop");

    static Start(){

    }

    static Update(){
        if(this.Screen !== "Home" || !Main.DisplayHUD) this.raceSelect.style.display = "none";
        if(this.Screen !== "Garage" || !Main.DisplayHUD) this.carSelect.style.display = "none";
        if(this.Screen !== "Shop" || !Main.DisplayHUD) this.shopSelect.style.display = "none";
        // update money
        const formatter = new Intl.NumberFormat('en-US');

        this.SCREENS[this.SCREENS.length-1] = `$${formatter.format(Math.round(Main.money))}`;

        if(!Main.DisplayHUD) return;

        // base
        ctx.fillStyle = "black";
        ctx.strokeStyle = "grey";
        ctx.beginPath();
        ctx.roundRect(50, 50, canvas.width - 100, canvas.height - 100, [20]);
        ctx.fill();
        ctx.stroke();

        // calculate spacing
        const totalTabs = this.SCREENS.length;
        const padding = 150;  // Adjust the padding as needed
        const spaceBetweenTabs = (canvas.width - 2 * padding) / (totalTabs - 1);


        this.SCREENS.forEach((screen, index) => {
            const xPosition = padding + spaceBetweenTabs * index;
            const textWidth = ctx.measureText(screen).width;


            // Draw the text for each screen
            if(index != totalTabs-1){
                this.drawText(screen, xPosition - textWidth / 2, 85, 20, "black", "grey");
            }else{
                this.drawText(screen, xPosition - textWidth / 2, 85, 20, "#EEE", "grey");
            }


            // Highlight the selected screen
            if (this.Screen == screen) {
                ctx.fillStyle = "#EEE";
                ctx.fillRect(xPosition - textWidth / 2, 95, textWidth, 2);
            }


            // Add the button for each tab
            if(index != totalTabs-1){
                this.Buttons.push({
                    x: xPosition - textWidth / 2, y: 70, width: textWidth, height: 20,
                    onclick: () => {
                        if(!Main.tutorialActive || (Main.goToShop && screen === "Shop") || (Main.goToGarage && screen == "Garage")) this.Screen = screen;
                        if(screen === "Shop") Main.wentToShop = true;
                        if(screen === "Garage") Main.wentToGarage = true;
                    },
                });
            }
        });


        this.drawScreens(this.Screen);        


        // click if clicking a button
        if(Input.mouseDown){
            this.Buttons.forEach((button) => {
                if(
                    Input.mouse.x >= button.x && 
                    Input.mouse.x <= button.x + button.width &&
                    Input.mouse.y >= button.y &&
                    Input.mouse.y <= button.y + button.height
                ){
                    button.onclick();
                }
            });
        }
    }

    static drawScreens(screen){
        if(screen === "Home") this.drawHomeScreen();
        if(screen === "Results") this.drawResultsScreen();
        if(screen === "Garage") this.drawGarageScreen();
        if(screen === "Shop") this.drawShopScreen();
    }

    static drawHomeScreen(){
        this.raceSelect.style.display = "block";

        const player = Main.player;


        // player car
        this.drawCar(player.car, 350, canvas.height/2 + player.height/4 - 50, player.width, player.height, 3*Math.PI/4);

        // info seperator
        ctx.fillStyle = "#EEE";
        ctx.fillRect(425, 115, 2, canvas.height-230);

        // speed / accel meeters
        this.drawText("SPEED:", 175, canvas.height/2+110, 20, "black", "white");
        this.drawText("ACCELERATION:", 85, canvas.height/2+135, 20, "black", "white");

        ctx.lineWidth = 2;
        ctx.strokeStyle = "#EEE";
        ctx.fillStyle = "#EEE";
        for(let i = 0; i < 4; i++){ 
            if(i < player.speedRating){
                ctx.fillRect(255+23*i-1, canvas.height/2+95-1, 15+2, 20+2); 
            }else{
                ctx.strokeRect(255+23*i, canvas.height/2+95, 15, 20); 
            }
        }
        for(let i = 0; i < 4; i++){ 
            if(i < player.accelerationRating){
                ctx.fillRect(255+23*i-1, canvas.height/2+120-1, 15+2, 20+2); 
            }else{
                ctx.strokeRect(255+23*i, canvas.height/2+120, 15, 20); 
            }
        }

        // boosts
        if(Main.speedBoost > 0) this.drawText(` (+${Main.speedBoost})`, 338, canvas.height/2+110, 20, "black", "white");
        if(Main.accelerationBoost > 0) this.drawText(` (+${Main.accelerationBoost})`, 338, canvas.height/2+135, 20, "black", "white");
    }

    static drawResultsScreen(){
        if(Main.currRace === undefined) return;

        const player = Main.currRace.playerCar;

        // place
        const color = (player.place === 1) ? "#FFD700" : 
                      (player.place === 2) ? "#C0C0C0" : 
                      (player.place === 3) ? "#CD7F32" : "white";

        this.drawText("#", 75, ((canvas.height-100)/2)+100/2+25, 100, "white", "grey");
        this.drawText(player.place, 150, ((canvas.height-100)/2)+250/2+15, 250, color, "grey");

        // player car
        this.drawCar(player.car, 550, canvas.height/2 + player.height/4, player.width, player.height, 3*Math.PI/4);

        // info seperator
        ctx.fillStyle = "#EEE";
        ctx.fillRect(575, 115, 2, canvas.height-230);

        // info
        for(let i = 0; i < 5; i++){

            const placeFinished = Lanes.getPlaceFinished(i);
            const name = "#"+placeFinished;
            this.drawText(name, 800, (canvas.height-330)/5*placeFinished+85, 25, "white", "grey");

            // draw lanes car
            const cars = Main.currRace.getCars();
            cars.forEach(car => {
                if(car.lane === i){
                    this.drawCar(car.car, 850 + ctx.measureText(name).width, (canvas.height-330)/5*placeFinished+85, 25, 25*1.5, 3 * Math.PI / 4);
                    
                    const time = round((car.endTime - Main.currRace.startTime)/1000, 3);
                    this.drawText(time+"s" + ((car===player) ? " (You)" : ""),  860 + ctx.measureText(name).width, (canvas.height-330)/5*placeFinished+85, 25, "white", "grey");
                }
            });
        }

        // draw rewards line
        ctx.fillStyle = "#EEE";
        ctx.fillRect(700, canvas.height-175, canvas.width-800, 2);

        // draw money gain
        this.drawText(`$${Math.round(Main.currRace.reward)}`, 735, canvas.height-115, 50, "white", "grey");

        // play agian button
        this.drawButton("Play Again", canvas.width-300, canvas.height-155, 150, 50, "#EEE", "black", 10, 
            () => {
                if(!Main.tutorialActive && this.Screen === "Results") Main.newRace(Main.currRace.race);
            }
        );
    }

    static drawGarageScreen(){
        this.carSelect.style.display = "flex";

        const player = Main.player;

        // player car
        this.drawCar(player.car, 350, canvas.height/2 + player.height/4 - 50, player.width, player.height, 3*Math.PI/4);

        // info seperator
        ctx.fillStyle = "#EEE";
        ctx.fillRect(425, 115, 2, canvas.height-230);

        // speed / accel meeters
        this.drawText(`SPEED:`, 175, canvas.height/2+110, 20, "black", "white");
        this.drawText(`ACCELERATION:`, 85, canvas.height/2+135, 20, "black", "white");
    
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#EEE";
        ctx.fillStyle = "#EEE";
        for(let i = 0; i < 4; i++){ 
            if(i < player.speedRating){
                ctx.fillRect(255+23*i-1, canvas.height/2+95-1, 15+2, 20+2); 
            }else{
                ctx.strokeRect(255+23*i, canvas.height/2+95, 15, 20); 
            }
        }
        for(let i = 0; i < 4; i++){ 
            if(i < player.accelerationRating){
                ctx.fillRect(255+23*i-1, canvas.height/2+120-1, 15+2, 20+2); 
            }else{
                ctx.strokeRect(255+23*i, canvas.height/2+120, 15, 20); 
            }
        }

        // boosts
        if(Main.speedBoost > 0) this.drawText(` (+${Main.speedBoost})`, 338, canvas.height/2+110, 20, "black", "white");
        if(Main.accelerationBoost > 0) this.drawText(` (+${Main.accelerationBoost})`, 338, canvas.height/2+135, 20, "black", "white");
    }

    static drawShopScreen(){
        this.shopSelect.style.display = "block";
        
    }

    static drawButton(text, x, y, width, height, mainColor, textColor = "black", radius, onclick){
        ctx.fillStyle = mainColor;
        ctx.beginPath();
        ctx.roundRect(x, y, width+0.5, height, [radius]);
        ctx.fill();

        const textSize = (width - 5)/(text.length/2)-5;
        this.drawText(text, x+1+10, y+height/2+textSize/2-2.5, textSize, textColor, "grey");

        this.Buttons.push({
            x: x, y: y, width: width, height:height,
            onclick: onclick
        });
    }

    static drawCar(car, x, y, width, height, angle/*In Rad*/){
        ctx.save();
        ctx.imageSmoothingEnabled = false;
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.drawImage(Cars.ALLCARS, 
            car.x, car.y, car.width, car.height,
            0, 0, width, height
        );
        ctx.restore();
    }
    
    static drawText(text, x, y, size, mainColor, outlineColor, underlined = false){
        ctx.font = `${size}px Verdana`;
        ctx.strokeStyle = outlineColor;
        ctx.lineWidth = 3;
        ctx.strokeText(text, x, y);
        ctx.fillStyle = mainColor;
        ctx.fillText(text, x, y);

        if(underlined){
            const textWidth = ctx.measureText(text).width;
            ctx.fillStyle = "#EEE";
            ctx.fillRect(x, y+5, textWidth, 2);
        }
    }

}