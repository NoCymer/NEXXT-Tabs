
const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

function setLabel() {
    let labelText = document.getElementById("lbl").value;
    document.getElementById("label").textContent = labelText;
    document.getElementById("label").innerText = labelText;
    setDate();
}
function removeUEntry() {
    let removeInput = document.getElementById("userentry");
    removeInput.parentNode.removeChild(userentry);
    let x = document.getElementById("personaltimer");
        x.style.display = "block";				
}
function setDate(){
    let date = document.getElementById("date").value;
    ds = date.split('T');
    date = date.split('-');
    ds = ds.slice(1);
    ds = ds.join('');
    ds = ds.split(':');
    let x = date[0];
    let y = date[1];
    let ds2 = date[2];
    ds2 = ds2.split('T');
    ds2.pop();
    let z = ds2[0];
    let hr = ds[0];
    let mn = ds[1];
    let parsedDate = x + "," + y + "," + z + "," + hr + "," + mn;
    parsedDate = parsedDate.split(',');
    let parsedDate = new Date(parsedDate[0],parsedDate[1] - 1 ,parsedDate[2],parsedDate[3],parsedDate[4]);
    removeUEntry();
    countdown(parsedDate);
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
                   
    daysEl.innerText = d;
    hoursEl.innerText = h;
    minutesEl.innerText = m;
    secondsEl.innerText = s;

    if (eventDate <= now) {
        daysEl.innerText = '00';
        hoursEl.innerText = '00';
        minutesEl.innerText = '00';
        secondsEl.innerText = '00';
    }
    if (d >= 0 && h >= 0 && m >= 0 && s >= 0) {
        setTimeout(countdown,1000,nbr=number);
    }						
}				          