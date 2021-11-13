const body = document.querySelector("body");
const backgroundsPath = '../src/assets/backgrounds';
const bgCount = 62;
let intervalValue = 120000; //default value of 2 minutes
let bgCycleHistory = []; //10 last bgs
let bgPathArray = [];
let nextBG;


for(let i =1; i<=bgCount;i++) {
    bgPathArray.push(`${backgroundsPath}/${i}.jpg`);
}
const backgroundChanger = () => {
    if (body.style.backgroundImage == 'url("undefined")') {
        body.style.backgroundImage = 'url("../src/assets/backgrounds/1.jpg")'
    }
    if(localStorage.getItem("intervalValue")) {
        intervalValue = localStorage.getItem("intervalValue")
    }
    if(JSON.parse(localStorage.getItem("bgCycleHistory"))) {
        bgCycleHistory = JSON.parse(localStorage.getItem("bgCycleHistory"));
    }
    if (bgCycleHistory.length >= 10) {
        bgCycleHistory.splice(0,1);
    }
    nextBG = bgPathArray[Math.round(Math.random()*bgCount)];
    while (bgCycleHistory.includes(nextBG)) {
        nextBG = bgPathArray[Math.round(Math.random()*bgCount)];
    }
    bgCycleHistory.push(nextBG);
    localStorage.setItem("bgCycleHistory", JSON.stringify(bgCycleHistory));
    body.style.backgroundImage = `url(${nextBG})`;
    if (body.style.backgroundImage == 'url("undefined")') {
        body.style.backgroundImage = 'url("../src/assets/backgrounds/1.jpg")'
    }
}
backgroundChanger();
setInterval(backgroundChanger, intervalValue)