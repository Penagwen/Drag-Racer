class Lanes{

    static NUMBER = 5;
    static HEIGHT = canvas.height/this.NUMBER;

    static #Lanes = [];
    static #LaneNumbers = [];

    static #Placements = []
    static #LastPlaceThatFinished = 0;



    static getYFromLane(lane){
        return (Camera.y - canvas.height/2 - 2.5) + lane*this.HEIGHT;
    }

    static createLanes(){
        for(let lane = 0; lane < this.NUMBER; lane++){
            this.#Lanes.push({
                startX: Camera.x - canvas.width/2, endX: Camera.x + canvas.width*100,
                startY: this.getYFromLane(lane), endY: this.getYFromLane(lane),
            });

            this.#LaneNumbers.push({
                x: Camera.x - canvas.width/2 + 200,
                y: this.getYFromLane(lane),
                number: lane+1,
            })
        }
    }

    static addPlaceFinished(lane){
        this.#Placements.push({
            x: Main.FINISHLINE.x + 50,
            y: this.#LaneNumbers[lane].y,
            number: ++this.#LastPlaceThatFinished,
        });
    }

    static getPlaceFinished(lane){
        let place = 0;
        this.#Placements.forEach((p) => {
            if(p.y == this.#LaneNumbers[lane].y){
                place = p.number;
            }
        });
        return place;
    }

    static drawLanes(){
        ctx.strokeStyle = "grey";
        ctx.lineWidth = 5;
        this.#Lanes.forEach((lane) => {
            ctx.beginPath();
            ctx.setLineDash([25, 15]);
            ctx.moveTo(lane.startX, lane.startY);
            ctx.lineTo(lane.endX, lane.endY);
            ctx.stroke();
        });

        ctx.fillStyle = "rgb(150, 150, 150)";
        ctx.font = "24px Verdana";
        this.#LaneNumbers.forEach((number) => {
            ctx.fillText(number.number, number.x, number.y + 12 + this.HEIGHT/2);
        });

        ctx.fillStyle = "rgb(150, 150, 150)";
        ctx.font = "48px Verdana";
        this.#Placements.forEach((number) => {
            ctx.fillText(number.number, number.x, number.y + 24 + this.HEIGHT/2);
        });
    }

    static reset(){
        this.#Placements = [];
        this.#LastPlaceThatFinished = 0;
    }
}