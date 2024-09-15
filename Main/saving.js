let savedData = {
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

if(JSON.parse(localStorage.getItem("data")) == null){
    localStorage.setItem("data", JSON.stringify(savedData));
}
savedData = JSON.parse(localStorage.getItem("data"));

function saveData(v, data){
    savedData[v] = data;
    localStorage.setItem("data", JSON.stringify(savedData));   
}  