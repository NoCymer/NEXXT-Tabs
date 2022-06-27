document.addEventListener("translated", () => {
    const BACKGROUNDS_PATH = '../assets/backgrounds';
    const body = $("body");
    
    const changeBackgroundImageToID = (index) => {
        body.css("background-image" , `url(${BACKGROUNDS_PATH}/${index}.jpg)`);
    }
    
    //Fetches background count then activates background cycling logic
    fetch(`${BACKGROUNDS_PATH}/index.json`).then((response)=> {
        return response.json();
    }).then((jsondata) => {
        let count = 0;
        let tempArray = []
        for(key in jsondata) { 
            count++; 
            $(".background-container").append(
            `<div class="background-entry" style="background-image : url('${BACKGROUNDS_PATH}/${key}.jpg')">
                <div class="standard-checkbox background-checker">
                    <label class="checkbox" title="${jsondata[key].anime}">
                        <input type="checkbox" class="background-entry-switch" id="${key}">
                        <span class="checkmark"></span>
                    </label>
                </div>
            </div>`);
            tempArray.push(Number(key));
            tempArray.sort(function (a, b) {  return a - b;  });
        }
        
        const BACKGROUND_COUNT = count;
        const backgroundSelectedIDsStorage = new Storage("background-id-selected-array", tempArray);
        const backgroundCurrentIDStorage = new Storage("background-id-current-integer", 0);
        const backgroundCycleHistoryStorage = new Storage("background-id-cycle-history-array", []);
        const backgroundCycleIntervalStorage = new Storage("background-cycle-interval-integer", 0);
        const backgroundCycleIntervalUnitStorage = new Storage("background-cycle-interval-unit-string", "min");
        const cycleBooleanStorage = new Storage("background-cycle-boolean", true);
        const cycleShuffleBooleanStorage = new Storage("background-shuffle-boolean", true);
    
        
        $(".background-container .background-entry-switch").each(function() {
            $(this).click(function(e) {
                if(cycleBooleanStorage.getValue()) return;
                $(".background-container .background-entry-switch").each(function() {
                    $(this).hide();
                    $(this).siblings("span").hide();
                    this.checked = false;
                })
                $(this).show();
                $(this).siblings("span").show();
                backgroundCurrentIDStorage.setValue(Number($(this).attr("id")))
                changeBackgroundImageToID(backgroundCurrentIDStorage.getValue());
                this.checked = true
            })
    
            
            
        })
    
        //Background function declarations 
    
        const storedIntervalToMS = () => {
            //Converts stored interval value in MS depending on the selected unit
            switch (backgroundCycleIntervalUnitStorage.getValue()) {
                case "sec":
                    return backgroundCycleIntervalStorage.getValue() * 1000;
                case "min":
                    return backgroundCycleIntervalStorage.getValue() * 60000;
                case "hr":
                    return backgroundCycleIntervalStorage.getValue() * 3600000;
            }
        }
    
        //Returns the ID of the next background in the selected list
        const getNextID = () => {
            let selectedBackgroundArray = backgroundSelectedIDsStorage.getValue();
            let selectedBackgroundIndex = selectedBackgroundArray.indexOf(backgroundCurrentIDStorage.getValue());
    
            if(selectedBackgroundIndex + 1 >= selectedBackgroundArray.length) {
                selectedBackgroundIndex = 0;
            } else {
                selectedBackgroundIndex++;
            }
            return selectedBackgroundArray[selectedBackgroundIndex];
        }
    
        //Returns a random ID of a background in the selected list
        const getNextIDRandom = () => {
            let selectedBackgroundArray = backgroundSelectedIDsStorage.getValue();
            let backgroundCycleHistory = backgroundCycleHistoryStorage.getValue()
        
            let random = Math.floor(Math.random() * selectedBackgroundArray.length);
    
            if (backgroundCycleHistory.length == 0 ) { return selectedBackgroundArray[random]; }
    
            if(selectedBackgroundArray.length >= 3) {
                while (backgroundCycleHistory.includes(selectedBackgroundArray[random])) {
                    random = Math.floor(Math.random() * selectedBackgroundArray.length);
                }
            }
            return selectedBackgroundArray[random];
        }
     
        const changeBackgroundToID = (nextID) => {
            changeBackgroundImageToID(nextID);
            backgroundCurrentIDStorage.setValue(nextID);
            let cycleHistory = backgroundCycleHistoryStorage.getValue();
            cycleHistory.push(nextID);
            if (cycleHistory.length > 2) cycleHistory.shift();
            backgroundCycleHistoryStorage.setValue(cycleHistory);
        }
    
        const cycleBackground = () => {
            if(!cycleBooleanStorage.getValue()) {
                changeBackgroundToID(backgroundCurrentIDStorage.getValue());
                return;
            }
    
            if(cycleShuffleBooleanStorage.getValue()) {
                let nextID = getNextIDRandom()
                changeBackgroundToID(nextID);
            } else {
                let nextID = getNextID()
                changeBackgroundToID(nextID);
            }
        }
        
        $(".background-container .background-entry-switch").each(function() {
            if (backgroundSelectedIDsStorage.getValue().includes(Number($(this).attr("id")))) {
                this.checked = true;
            }
        })
    
    
        // Start of background logic
        cycleBackground();
    
        let interval = setInterval(cycleBackground, storedIntervalToMS());
        
    
        //Restarts an interval when delay value changes while clearing previously started one
        document.addEventListener("cycle-delay-modified", () => {
            clearInterval(interval);
            interval = setInterval(cycleBackground, storedIntervalToMS());
        })
    }); 
})
