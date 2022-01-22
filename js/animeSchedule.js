const SCHEDULE_FADE_DURATION = "200";
const regexDate = /(.+?)(?=at)at ([\d|:]+)/
const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const scheduleSwitch = $("#schedule-switch");
const scheduleContainer = $("#schedule-main-conatiner");
const monday = $("#Monday");
const tuesday = $("#Tuesday");
const wednesday = $("#Wednesday");
const thursday = $("#Thursday");
const friday = $("#Friday");
const saturday = $("#Saturday");
const sunday = $("#Sunday");
const weekEls = [monday, tuesday, wednesday, thursday, friday, saturday, sunday];
const scheduleStorage = new Storage("schedule");
const scheduleLastUpdateStorage = new Storage("scheduleLastUpdate", 0);
const scheduleMenu = new Menu(scheduleContainer.get(0), "", "80vh", "50%", 250, "60%", false);
const scheduleLoading = $("#schedule-loading");
let handleContainer = $("#schedule-handle");
let handleContainerOp = $("#schedule-handle-op");
let scheduleHandle = $("#schedule-handle-el");
let scheduleHandleOp = $("#schedule-handle-el-op");

// Showcase the new feature needs to be remove in further versions
const scheduleFeature = $("#schedule-feature");
const scheduleFeatureClose = $("#schedule-feature-close");
if(JSON.parse(localStorage.getItem("newUser"))) {
    localStorage.setItem("newScheduleFeatureShowed", true);
}
if(!localStorage.getItem("newScheduleFeatureShowed") && !JSON.parse(localStorage.getItem("newUser"))) {
    scheduleFeature.css("animation-play-state", "running");
    localStorage.setItem("newScheduleFeatureShowed", true);
}
scheduleFeatureClose.on("click", () => scheduleFeature.remove())
handleContainer.on("click", () => scheduleFeature.remove())
///////////////////////////////////////////////////////////////////

scheduleSwitchBtn = new switchButton(
    scheduleSwitch.get(0),
    "scheduleBool",
    true,
    () => {},
    () => {
        scheduleHandle.css("display", "block");
        handleContainer.css("display", "block");
        setTimeout(() => {
            scheduleHandle.css("opacity", "1");
            handleContainer.css("opacity", "1");
        }, 1);
        
    },
    () => {
        scheduleMenu.hide()
        scheduleHandle.css("opacity", "0");
        setTimeout(() => {
            scheduleHandle.css("display", "none");
            handleContainer.css("display", "none");
        }, SCHEDULE_FADE_DURATION);
    } 
)

handleContainer.mouseenter(function () { 
    scheduleHandle.attr("src", "src/assets/arrow-hc.svg");
    scheduleHandle.width("35px");
    scheduleHandle.height("35px");
    scheduleHandle.css("right", "15px");
}).mouseleave(function () { 
    scheduleHandle.attr("src", "src/assets/arrow.svg");
    scheduleHandle.width("30px");
    scheduleHandle.height("30px");
    scheduleHandle.css("right", "0px");
});
handleContainerOp.mouseenter(function () { 
    scheduleHandleOp.attr("src", "src/assets/arrow-hc.svg");
    scheduleHandleOp.width("35px");
    scheduleHandleOp.height("35px");
}).mouseleave(function () { 
    scheduleHandleOp.attr("src", "src/assets/arrow.svg")
    scheduleHandleOp.width("30px");
    scheduleHandleOp.height("30px");
});

handleContainer.on("click", () => {
    if(scheduleSwitchBtn.switchBool) {
        if (scheduleMenu.isShown) {
            scheduleMenu.hide();
        } else { scheduleMenu.show(); }
    }
})
handleContainerOp.on("click", () => {
    if (scheduleMenu.isShown) {
        scheduleMenu.hide();
    } else { scheduleMenu.show(); }
})

const REFRESH_COOLDOWN = 10000;//in ms 10 seconds
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
    $(".anime-entry").remove();
    res.list.forEach((entry) => {
        for ([key, value] of Object.entries(entry)) {
            let broadcast = value["broadcast"]
            let startDate = value["aired"]["prop"]["from"];
            let date = new Date(`${startDate["month"]}/${startDate["day"]}/${startDate["year"]} ${broadcast["time"]}:00 UTC+9`)
            switch (date.getDay()) {
                case 0: //sunday
                    displayInTable(value, "#Sunday");
                    break;
                case 1: 
                    displayInTable(value, "#Monday");  
                    break;
                case 2: 
                    displayInTable(value, "#Tuesday");
                    break;
                case 3: 
                    displayInTable(value, "#Wednesday");
                    break;
                case 4: 
                    displayInTable(value, "#Thursday");
                    break;
                case 5: 
                    displayInTable(value, "#Friday");
                    break;
                case 6: 
                    displayInTable(value, "#Saturday");
                    break;
            }
        }
    })
    scheduleLoading.hide();
}

if (scheduleStorage.getValue() == "undefined" || new Date().getTime() >= (scheduleLastUpdateStorage.getValue() + REFRESH_COOLDOWN)) {
    if(scheduleStorage.getValue() != "undefined") processResponse(scheduleStorage.getValue());
    let i = 0;
    let week = {
        list: []
    };
    days.forEach((day) => {
        setTimeout(() => {
            $.ajax({
                type: "GET",
                url: `https://api.jikan.moe/v4/schedules/${day}`,
                dataType: "json",
                success: (response) => {
                    week.list.push(response["data"])
                    if (day == "sunday") {
                        scheduleStorage.setValue(week);
                        processResponse(week);
                        scheduleLastUpdateStorage.setValue(new Date().getTime());
                        scheduleLoading.hide();
                    } 
                }
            });
        }, i*1000)    
        i++
    })     
}
else {
    processResponse(scheduleStorage.getValue());
}
