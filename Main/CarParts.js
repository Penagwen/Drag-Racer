class CarParts {

    static Engine1 = {
        image: "./assets/image/Parts_Icons/Icon13_06.png",
        name: "Engine Level 1",
        effect: "+5 speed",
        cost: 25,
        apply: () => {
            Main.speedBoost += 5;
            Main.player.updateBoosts();
        },
        remove: () => {
            Main.speedBoost -= 5;
            Main.player.updateBoosts();
        },
        sold: false,
    }

    static Engine2 = {
        image: "./assets/image/Parts_Icons/Icon13_07.png",
        name: "Engine Level 2",
        effect: "+15 speed",
        cost: 550,
        apply: () => {
            Main.speedBoost += 15;
            Main.player.updateBoosts();
        },
        remove: () => {
            Main.speedBoost -= 15;
            Main.player.updateBoosts();
        },
        sold: false,
    }

    static Booster1 = {
        image: "./assets/image/Parts_Icons/Icon13_01.png",
        name: "Booster Level 1",
        effect: "+0.5 acceleration",
        cost: 35,
        apply: () => {
            Main.accelerationBoost += 0.5;
            Main.player.updateBoosts();
        },
        remove: () => {
            Main.accelerationBoost -= 0.5;
            Main.player.updateBoosts();
        },
        sold: false,
    };

    static Booster2 = {
        image: "./assets/image/Parts_Icons/Icon13_02.png",
        name: "Booster Level 2",
        effect: "+0.8 acceleration",
        cost: 750,
        apply: () => {
            Main.accelerationBoost += 0.8;
            Main.player.updateBoosts();
        },
        remove: () => {
            Main.accelerationBoost -= 0.8;
            Main.player.updateBoosts();
        },
        sold: false,
    }


    static CarPartNames = ["Engine Level 1", "Engine Level 2", "Booster Level 1", "Booster Level 2"];
    static CarPartTypes = [this.Engine1, this.Engine2, this.Booster1, this.Booster2];
}