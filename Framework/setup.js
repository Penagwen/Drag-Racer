let globalAlpha = 0.65;

class Setup{

    static _Start(){
        Input._Start();
        Main.Start();
        HUD.Start();
    }

    static _Update(){
        requestAnimationFrame(Setup._Update);

        ctx.fillStyle = `rgba(0, 0, 0, ${globalAlpha})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        Camera.render(canvas, ctx);

        Main.Update();

        ctx.restore();

        HUD.Update();
    }
}

Setup._Start();
Setup._Update();
