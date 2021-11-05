const body = document.querySelector("body");
const backgroundsPath = '../src/img/backgrounds';
let intervalValue = 600000; //default value of 10 minutes
let bgCycleHistory = [];

for(background in backgroundsPath)

const backgroundChanger = () => {
    let nextBG = 
    body.style.backgroundImage = `url(${backgroundsPath}/${nextBG})`;
}

setInterval(backgroundChanger, intervalValue)
