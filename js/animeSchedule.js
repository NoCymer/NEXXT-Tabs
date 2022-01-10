const monday = $("#Monday");
const tuesday = $("#Tuesday");
const wednesday = $("#Wednesday");
const thursday = $("#Thursday");
const friday = $("#Friday");
const saturday = $("#Saturday");
const sunday = $("#Sunday");
const scheduleStorage = new Storage("schedule");
const scheduleLastUpdateStorage = new Storage("scheduleLastUpdate", 0);
const REFRESH_COOLDOWN = 10000;//in ms 
let current_day = new Date().getDay();
switch(current_day) {
    case 0:
        current_day = "#Sunday";
        break;
    case 1:
        current_day = "#Monday";
        break;
    case 2:
        current_day = "#Tuesday";
        break;
    case 3:
        current_day = "#Wednesday";
        break;
    case 4:
        current_day = "#Thursday";
        break;
    case 5:
        current_day = "#Friday";
        break;
    case 6:
        current_day = "#Saturday";
        break;
}

const displayInTable = (el, day) => {
    let newDiv;
    newDiv = $(`<div class="anime-entry"><h1 class="anime-title">${el["title"]}</h1></div></div>`);
    if(day === current_day) {
        newDiv = $(`<div class="anime-entry current-day"><h1 class="anime-title">${el["title"]}</h1></div></div>`);
    }
    newDiv.on("click",() => {
        window.open(el["url"], "_blank");
    })
    $(`${day}`).append(newDiv)
}

const processResponse = (res) => {
    res["monday"].forEach((e) => displayInTable(e, "#Monday"))
    res["tuesday"].forEach((e) => displayInTable(e, "#Tuesday"))
    res["wednesday"].forEach((e) => displayInTable(e, "#Wednesday"))
    res["thursday"].forEach((e) => displayInTable(e, "#Thursday"))
    res["friday"].forEach((e) => displayInTable(e, "#Friday"))
    res["saturday"].forEach((e) => displayInTable(e, "#Saturday"))
    res["sunday"].forEach((e) => displayInTable(e, "#Sunday"))
}

if (scheduleStorage.getValue() == "undefined" || new Date().getTime() >= (scheduleLastUpdateStorage.getValue() + REFRESH_COOLDOWN)) {
    $.ajax({
        type: "GET",
        url: "https://api.jikan.moe/v3/schedule",
        dataType: "json",
        success: (response) => {
            scheduleStorage.setValue(response);
            console.log(response)
            processResponse(response);

        }
    });
    console.log(new Date().getTime() >= (scheduleLastUpdateStorage.getValue() + REFRESH_COOLDOWN))
    scheduleLastUpdateStorage.setValue(new Date().getTime());
}
else {
    processResponse(scheduleStorage.getValue());  
}