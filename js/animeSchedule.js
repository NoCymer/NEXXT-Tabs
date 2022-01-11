const monday = $("#Monday");
const tuesday = $("#Tuesday");
const wednesday = $("#Wednesday");
const thursday = $("#Thursday");
const friday = $("#Friday");
const saturday = $("#Saturday");
const sunday = $("#Sunday");
const scheduleStorage = new Storage("schedule");
const scheduleLastUpdateStorage = new Storage("scheduleLastUpdate", 0);
const scheduleMenu = new Menu(document.querySelector("#schedule-main-conatiner"), "", "80vh", "50%", 300, "60%");
let handleContainer = $("#schedule-handle");
let handleContainerOp = $("#schedule-handle-op");
let scheduleHandle = $("schedule-handle-el");
let scheduleHandleOp = $("schedule-handle-el-op");
handleContainer.hover(() => {
    scheduleHandle.attr("src", "src/assets/arrow-hc.svg")
}, () => {
    scheduleHandle.attr("src", "src/assets/arrow.svg")
})
handleContainerOp.hover(() => {
    scheduleHandleOp.attr("src", "src/assets/arrow-hc.svg")
})

handleContainer.on("click", () => {
    if (scheduleMenu.isShown) {
        scheduleMenu.hide();
    } else { scheduleMenu.show(); }
})
handleContainerOp.on("click", () => {
    if (scheduleMenu.isShown) {
        scheduleMenu.hide();
    } else { scheduleMenu.show(); }
})

const REFRESH_COOLDOWN = 10000;//in ms 
let current_day = new Date().getDay();
switch (current_day) {
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

const checkForDayChange = () => {

}

const displayInTable = (el, day) => {
    let newDiv;
    newDiv = $(`<div class="anime-entry"><h1 class="anime-title">${el["title"]}</h1></div></div>`);
    if (day === current_day) {
        newDiv = $(`<div class="anime-entry current-day"><h1 class="anime-title">${el["title"]}</h1></div></div>`);
    }
    newDiv.on("click", () => {
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
    scheduleLastUpdateStorage.setValue(new Date().getTime());
}
else {
    processResponse(scheduleStorage.getValue());
}

setInterval(() => checkForDayChange());