document.addEventListener("translated", () => { 
    const daysTEl = document.getElementById("tD");
    const hoursTEl = document.getElementById("tH");
    const minutesTEl = document.getElementById("tM");
    const secondsTEl = document.getElementById("tS");
    const daysBEl = document.getElementById("bD");
    const hoursBEl = document.getElementById("bH");
    const minutesBEl = document.getElementById("bM");
    const secondsBEl = document.getElementById("bS");
    let date;
    let label;
    let currentTimeout;
    let nextTimeout;
    function setLabel() {
        document.getElementById("labelT").textContent = label;
        document.getElementById("labelT").innerText = label;
        
        document.getElementById("labelB").textContent = label;
        document.getElementById("labelB").innerText = label;
    }
    
    const checkForDateLabel = () => {
        clearTimeout(currentTimeout);
        clearTimeout(nextTimeout);
        if(localStorage.getItem('ctDateTime')){
            date = localStorage.getItem('ctDateTime');
            setDate();
        }
        if(localStorage.getItem('ctLabel')){
            label = localStorage.getItem('ctLabel');
            setLabel();
        }
    }
    checkForDateLabel();
    function setDate(){
        let parsedDate = new Date(date);
        currentTimeout = countdown(parsedDate);
    }	
    function countdown(nbr){
        let number = nbr;
        let now = new Date();
        let eventDate = new Date(nbr);
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
                       
        daysTEl.innerText = d;
        hoursTEl.innerText = h;
        minutesTEl.innerText = m;
        secondsTEl.innerText = s;
        daysBEl.innerText = d;
        hoursBEl.innerText = h;
        minutesBEl.innerText = m;
        secondsBEl.innerText = s;
    
        if (eventDate <= now) {
            daysTEl.innerText = '00';
            hoursTEl.innerText = '00';
            minutesTEl.innerText = '00';
            secondsTEl.innerText = '00';
    
            daysBEl.innerText = '00';
            hoursBEl.innerText = '00';
            minutesBEl.innerText = '00';
            secondsBEl.innerText = '00';
        }
        if (d >= 0 && h >= 0 && m >= 0 && s >= 0) {
            nextTimeout = setTimeout(countdown,1000,nbr=number);
        }						
    }				          
})