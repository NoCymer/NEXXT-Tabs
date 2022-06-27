document.addEventListener("translated", () => {
    const scheduleButton = $("#schedule-button");
    const schedulePannel = $("#schedule-pannel");
    const loadingElement = $("#schedule-loading");
    const weekdayMultipleSelector = $("#weekday-multiple-selector");
    const scheduleStorage = new Storage("schedule-weekday-entries-array", {});
    
    const scheduleBooleanStorage = new Storage("schedule-activated-boolean", true);
    const scheduleLastUpdateStorage = new Storage("schedule-last-update-integer", 0);
    const REFRESH_COOLDOWN = 30000; // 30sec
    const WEEK_DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    const quarterDict = {
        1: "one",
        2: "two",
        3: "three",
        4: "four",
        5: "five",
        6: "six",
        7: "seven",
        8: "eight"
    }
    const quarterListTwelve = [
        "0:00am ~ 3:00am",
        "3:00am ~ 6:00am",
        "6:00am ~ 9:00am",
        "9:00am ~ 0:00pm",
        "0:00pm ~ 1:00pm",
        "3:00pm ~ 6:00pm",
        "6:00pm ~ 9:00pm",
        "6:00pm ~ 0:00am"
    ]
    const quarterListTwentyFour = [
        "00:00 ~ 3:00",
        "3:00 ~ 6:00",
        "6:00 ~ 9:00",
        "9:00 ~ 12:00",
        "12:00 ~ 15:00",
        "15:00 ~ 18:00",
        "18:00 ~ 21:00",
        "21:00 ~ 00:00"
    ]
    const timeFormatStorage = new Storage("time-format-string", "24h");
    const TIME_REGEX = /(\d+)/

    scheduleButton.click(function() {
        schedulePannel.addClass("active");
        $("#anime-schedule").addClass("active");
    })

    //Closes menu if clicked away
    $("body").click((e) => {
        if (!schedulePannel.is(e.target) && !schedulePannel.has(e.target).length) {
            if (!scheduleButton.is(e.target) && !scheduleButton.has(e.target).length) {
                schedulePannel.removeClass("active");
            }
        }
    })

    const dayIntToString = (int) => {
        switch (int) {
            case 0: //sunday
                return("sunday");
            case 1: 
                return("monday");
            case 2: 
                return("tuesday");
            case 3: 
                return("wednesday");
            case 4: 
                return("thursday");
            case 5: 
                return("friday");
            case 6: 
                return("saturday");
        }
    }

    //initialization
    for(day in WEEK_DAYS) {
        if (timeFormatStorage.getValue() == "24h") {

            let i = 1;
            for(time in quarterListTwentyFour) {

                let timeElement = $(`
                <div class="day-time quarter-${quarterDict[i]}">
                    <h1 class="day-time-value">${quarterListTwentyFour[time]}</h1>
                    <div class="animes-container">
                    </div>
                </div>
                `)
                $(`#${WEEK_DAYS[day]}`).append(timeElement);
                i++;
            }
        }
        else {
            let i = 1;
            for(time in quarterListTwelve) {
                let timeElement = $(`
                    <div class="day-time quarter-${quarterDict[i]}">
                        <h1 class="day-time-value">${quarterListTwelve[time]}</h1>
                        <div class="animes-container">
                        </div>
                    </div>
                `)
                $(`#${WEEK_DAYS[day]}`).append(timeElement);
                i++;
            }
        }
    }

    //date-format-change handler, changes the time format displayed for each quarter
    document.addEventListener("date-format-change", () => { 
        for(day in WEEK_DAYS) {
            if (timeFormatStorage.getValue() != "24h") {
                for(time in quarterDict) {
                    $(`#${WEEK_DAYS[day]}`).find(`.quarter-${quarterDict[time]} .day-time-value`).text(quarterListTwentyFour[time])
                }
            }
            else{
                for(time in quarterDict) {
                    $(`#${WEEK_DAYS[day]}`).find(`.quarter-${quarterDict[time]} .day-time-value`).text(quarterListTwelve[time])
                }

            }
            $(`#${WEEK_DAYS[day]}`).find(".broadcast-time").each(function() {
                let localizedBroadcast = new Date()
                let temp = $(this).attr("value").split(":");
                localizedBroadcast.setHours(temp[0])
                localizedBroadcast.setMinutes(temp[1])
                let options = timeFormatStorage.getValue() != "12h" ? {
                    hour12: true,
                    hour: '2-digit', 
                    minute:'2-digit'
                } : {
                    hour12: false,
                    hour: '2-digit', 
                    minute:'2-digit'
                }
                let broadCastHourLocalisedString = localizedBroadcast.toLocaleString([], options)
                $(this)[0].innerText = broadCastHourLocalisedString;
            })
        }
    })


    const localizeResponse = (list) => {
        let localizedList = list;
        for(day in list) {
            for(anime in list[day]) {
                let broadcast = list[day][anime]["broadcast"]
                let startDate = list[day][anime]["aired"]["prop"]["from"];
                let date = new Date(`${startDate["month"]}/${startDate["day"]}/${startDate["year"]} ${broadcast["time"]}:00 UTC+9`)

                localizedList[day][anime]["broadcast"]["localDay"] = dayIntToString(date.getDay());
                
                let hoursString = String(date.getHours()).length < 2 ? "0" + date.getHours() : date.getHours();
                let minutesString = String(date.getMinutes()).length < 2 ? date.getMinutes() + "0" : date.getMinutes()

                localizedList[day][anime]["broadcast"]["localTime"] = `${hoursString}:${minutesString}`;
            }
        }
        return localizedList;
    }
    
    const processResponse = (list) => {
        for(day in WEEK_DAYS) {
            $(`#${WEEK_DAYS[day]}`).find(".anime-schedule-entry").each(function() {$(this).remove()});
        }
        for(day in list) {
            for(anime in list[day]) {
                let animeImageURL = list[day][anime]["images"]["jpg"]["image_url"];
                let animeURL = list[day][anime]["url"];
                let animeTitle = list[day][anime]["title"];
                let broadcastHour = list[day][anime]["broadcast"]["localTime"];
                let broadcastDay = list[day][anime]["broadcast"]["localDay"];

                let broadcastHourParsed;
                try {
                    broadcastHourParsed = broadcastHour.match(TIME_REGEX)[0];
                }
                catch {
                    continue;
                }
                let localizedBroadcast = new Date()
                let temp = broadcastHour.split(":");
                localizedBroadcast.setHours(temp[0])
                localizedBroadcast.setMinutes(temp[1])
                let options = timeFormatStorage.getValue() != "24h" ? {
                    hour12: true,
                    hour: '2-digit', 
                    minute:'2-digit'
                } : {
                    hour12: false,
                    hour: '2-digit', 
                    minute:'2-digit'
                }
                let broadCastHourLocalisedString = localizedBroadcast.toLocaleString([], options)
                let animeEntry = $(`
                    <div class="anime-schedule-entry" style=' background-image: 
                    linear-gradient(180deg, rgba(59, 62, 75, 0) 8%, rgba(39, 40, 44, 0.9) 70%),
                    url("${animeImageURL}");'>
                        <h1 class="broadcast-time" value="${broadcastHour}">${broadCastHourLocalisedString}</h1>
                        <a class="anime-button" href="${animeURL}" target="_blank">${translateString("__MSG_view__")}</a>
                        <h1 class="title">${animeTitle}</h1>
                    </div>
                `)
                let quarter = Math.floor(broadcastHourParsed / 3) + 1;
                $(`#${broadcastDay}`).find(`.quarter-${quarterDict[quarter]}`).find(".animes-container").append(animeEntry)
            }
        };
        $(".day-time").each(function() {
            $(this).addClass("active");
            if(!$(this).has(".anime-schedule-entry").length > 0) {
                $(this).remove();
            }
        })
    }

    const isEmptyObject = (obj) => {
        return !Object.keys(obj).length;
    }

    const loadSchedule = () => {
        let i = 0;
        let week = {};
        WEEK_DAYS.forEach(day => {
            setTimeout(() => {
                $.ajax({
                    type: "GET",
                    url: `https://api.jikan.moe/v4/schedules/${day}`,
                    dataType: "json",
                    success: (response) => {
                        week[`${day}`] = response["data"]
                        if (day == "sunday") {
                            scheduleStorage.setValue(week);
                            processResponse(localizeResponse(scheduleStorage.getValue()));
                            scheduleLastUpdateStorage.setValue(new Date().getTime());
                            loadingElement.removeClass("active");
                        }
                    }
                });
            }, i*1700)    
            i++;
        })
    }

    if (isEmptyObject(scheduleStorage.getValue()) || new Date().getTime() >= (scheduleLastUpdateStorage.getValue() + REFRESH_COOLDOWN)) {
        if(!isEmptyObject(scheduleStorage.getValue())) {
            processResponse(localizeResponse(scheduleStorage.getValue()));
            if(new Date().getTime() >= (scheduleLastUpdateStorage.getValue() + REFRESH_COOLDOWN)) {
                loadSchedule();
            }
        }
        else{
            loadingElement.addClass("active");
            loadSchedule();
        }
    }
    else {
        processResponse(localizeResponse(scheduleStorage.getValue()));
    }

    
    let today = dayIntToString(new Date().getDay())
    weekdayMultipleSelector.children().each(function() {
        $(this).attr("value") == today ? $(this).addClass("active") : "";
        $(this).click(function () {
            if($(this).hasClass("active")) return;
            for(day in WEEK_DAYS) {
                weekdayMultipleSelector.children().each(function() {
                    $(this).removeClass("active")
                })
                $(this).addClass("active")
                $(`#${WEEK_DAYS[day]}`).removeClass("active")
            }
            $(`#${$(this).attr("value")}`).addClass("active")
        })
    })
    $(`#${today}`).addClass("active")
    if (!scheduleBooleanStorage.getValue()) {
        schedulePannel.removeClass("active");
        scheduleButton.removeClass("active");
    } else{
        scheduleButton.addClass("active");
    }
    document.addEventListener("schedule-storage-change", () => {
        console.log(scheduleBooleanStorage.getValue())
        if (!scheduleBooleanStorage.getValue()) {
            schedulePannel.removeClass("active");
            scheduleButton.removeClass("active");
        } else{
            scheduleButton.addClass("active");
        }
    })

});