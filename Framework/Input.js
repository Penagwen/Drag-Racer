class Input{

    static #keysDown = [];
    static mouseDown = false;
	static mouse = { x: 0, y: 0 };

    static _Start(){
        window.onkeydown = (e) => {
            const key = e.key.toLowerCase();
            if(!this.#keysDown.includes(key)){
                this.#keysDown.push(key);
            }
        }
        window.onkeyup = (e) => {
            const key = e.key.toLowerCase();
            this.#keysDown.splice(this.#keysDown.indexOf(key), 1);
        }
        window.onclick = (e) => {
            this.mouseDown = true;
            this.mouse.x = e.x;
            this.mouse.y = e.y;
            setTimeout(() => {
                this.mouseDown = false;
            }, 100);
        }
        window.onmousedown = (e) => { 
            this.mouseDown = true;
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        }
        window.onmouseup = (e) => { 
            this.mouseDown = false;
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        }
        window.onmousemove = (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        }
    }

    static getKeyDown(key){
        return this.#keysDown.includes(key);
    }
    
    static getMouseX(){ return Input.mouse.x -canvas.width/2; }
	static getMouseY(){ return Input.mouse.y -canvas.height/2; }
	static getScreenX(){ return Input.mouse.x; }
	static getScreenY(){ return Input.mouse.y; }
}

