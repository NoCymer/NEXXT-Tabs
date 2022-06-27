document.addEventListener("translated", () => { 
    const daysElements = $(".ct-days");
    const hoursElements = $(".ct-hours");
    const minutesElements = $(".ct-minutes");
    const secondsElements = $(".ct-seconds");
    const countdownLabels = $(".countdown-label");
    const countdownLabelStorage = new Storage("countdown-label-string" ,"");
    
    const countdownDateStorage = new Storage("countdown-datetime", `${new Date().getFullYear()}-12-24T00:00`);

    //Countdown labels initialization and change behaviour
    countdownLabels.each(function() { $(this).text(countdownLabelStorage.getValue()) });
    document.addEventListener("countdown-label-change", () => {
        countdownLabels.each(function() { $(this).text(countdownLabelStorage.getValue()) });
    })
    countdown(countdownDateStorage.getValue())
    setInterval(function() {
        countdown(countdownDateStorage.getValue())
    }, 500);

    function countdown(datetime){
        let now = new Date();
        let eventDate = new Date(datetime);
        let currentTime = now.getTime();
        let eventTime = eventDate.getTime() ;
        let remTime = eventTime - currentTime;
        let s = Math.floor(remTime / 1000);
        let m = Math.floor(s / 60);
        let h = Math.floor(m / 60);
        let d = Math.floor(h / 24);						
        
        h %= 24;
        m %= 60;
        s %= 60;
        h = (h < 10) ? "0" + h : h;
        m = (m < 10) ? "0" + m : m;
        s = (s < 10) ? "0" + s : s;
        
        const zeroesValues = () => {
            daysElements.each(function() { $(this).text('00') });
            hoursElements.each(function() { $(this).text('00') });
            minutesElements.each(function() { $(this).text('00') });
            secondsElements.each(function() { $(this).text('00') });
        }

        if (eventDate <= now || eventDate == "Invalid Date") {
            zeroesValues();
            return;
        }
        
        daysElements.each(function() { $(this).text(d) });
        hoursElements.each(function() { $(this).text(h) });
        minutesElements.each(function() { $(this).text(m) });
        secondsElements.each(function() { $(this).text(s) });					
    }				          
})
