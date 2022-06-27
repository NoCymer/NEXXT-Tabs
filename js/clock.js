document.addEventListener("translated", () => {
    const clockFormatStorage = new Storage("time-format-string", "24h");
    const clockHours = $(".clock-hours");
    const clockMinutes = $(".clock-minutes");
    const clockPeriods = $(".clock-period");
    
    switch(clockFormatStorage.getValue()) {
        case "24h": 
            $(".clock-container").each(function() { $(this).addClass('twenty-four') });
            $(".clock-container").each(function() { $(this).removeClass('twelve') });
            break;
        case "12h": 
            $(".clock-container").each(function() { $(this).addClass('twelve') });
            $(".clock-container").each(function() { $(this).removeClass('twenty-four') });
            break;
    }
    
    const updateTime = () => {
        let time = new Date();
        switch(clockFormatStorage.getValue()) {
            case "24h":
                time = time.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                })
                break;
            case "12h":
                time = time.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                })
                break;
        }
        let hours = time.slice(0,2)
        let minutes = time.slice(3,5)
        let period = time.slice(6,8)
        clockHours.each(function() { $(this).text(hours) });
        clockMinutes.each(function() { $(this).text(minutes) });
        clockPeriods.each(function() { $(this).text(period) });
    }
    updateTime()
    setInterval(updateTime,100)
});

