class Storage{
    constructor(storageKey, defaultValue = undefined) {
        if (defaultValue == undefined) throw new Error("Default value must not be undefined !") ;
        this.storageKey = storageKey;
        let temp = localStorage.getItem(`${this.storageKey}`)
        
        if(temp != "undefined" && temp != "null") {
            if (temp) {
                try {
                    this.value = JSON.parse(temp);
                    this.setValue(this.value);
                }
                catch {
                    temp = `"${temp}"`;
                    this.value = JSON.parse(temp);
                    this.setValue(this.value);
                }
            }
            else {
                this.setValue(defaultValue);
            }
        }
        else {
            localStorage.setItem(`${this.storageKey}`, JSON.stringify(defaultValue));
        }
    }
    setValue(newValue) {
        this.value = newValue;
        localStorage.setItem(`${this.storageKey}`, JSON.stringify(this.value));
    }
    getValue() {
        this.value = JSON.parse(localStorage.getItem(`${this.storageKey}`))
        return this.value;
    }
}

class OptionSelector {
    constructor(optionsContainerID, localStorageID, defaultValue = 0, callOnInstantiate = false, selectCallback = () => {}) {
        this.optionsContainer = $(`#${optionsContainerID}`);
        this.defaultValue = defaultValue
        this.selectCallback = selectCallback;
        this.selectorLocalStorage = new Storage(localStorageID, !isNaN(defaultValue) ? Number(defaultValue) : defaultValue);
        let optionsContainer = this.optionsContainer;
        let selectorLocalStorage = this.selectorLocalStorage;
        optionsContainer.children().each(function() {
            if((!isNaN($(this).attr("value")) ? Number($(this).attr("value")) : $(this).attr("value"))  === selectorLocalStorage.getValue()) {
                $(this).addClass("active");
            }
        })
        optionsContainer.children().each(function() {
            $(this).click(function() {
                optionsContainer.children().each(function() {
                    $(this).removeClass("active");
                })
                $(this).addClass("active");
                !isNaN($(this).attr("value")) ? selectorLocalStorage.setValue(Number($(this).attr("value"))) : selectorLocalStorage.setValue($(this).attr("value"));
                selectCallback($(this));
            })
        })
        callOnInstantiate ? selectCallback(optionsContainer.find(".active")) : "";
    }
}

class SwitchButton {
    constructor(switchElID, localStorageKey, defaultState = true, clickCallback = () => { }, checkedCallback = () => { }, uncheckedCallback = () => { }) {
        this.element = $(`#${switchElID}`);
        this.localStorageKey = localStorageKey;
        this.switchBool = defaultState;
        this.checkedCallback = checkedCallback;
        this.uncheckedCallback = uncheckedCallback;
        this.storage = new Storage(localStorageKey, defaultState);
        this.element[0].checked = this.switchBool = this.storage.getValue();
        this.switchBool ? this.checkedCallback() : this.uncheckedCallback();
        this.element.click(() => {
            this.switchBool = this.element[0].checked ? true : false;
            this.storage.setValue(this.switchBool);
            this.switchBool ? checkedCallback() : uncheckedCallback();
            clickCallback();
        });
        return this;
    }
}

class Button{
    constructor(buttonID, clickCallback = () => {}) {
        this.element = $(`#${buttonID}`);
        this.element.click(clickCallback);
    }
}

class DualChoiceButton{
    constructor(
        buttonsContainerID,
        storageKey = "",
        defaultValue = "",
        clickLeftButtonCallback = () => {},
        clickRightButtonCallback = () => {}
        ) {
        this.storage = new Storage(`${storageKey}`, defaultValue);
        this.element = $(`#${buttonsContainerID}`);
        let instance = this;
        this.element.children().each(function() {
            if (instance.storage.getValue() === $(this).attr("value")) {
                $(this).addClass("active");
            }
        })
        this.element.children(":first").click(function() {
            clickLeftButtonCallback();
            instance.element.children(":first").addClass("active");
            instance.element.children(":last-child").removeClass("active");
            instance.storage.setValue(instance.element.children(":first").attr("value"));
        });
        this.element.children(":last-child").click(function() {
            clickRightButtonCallback();
            instance.element.children(":first").removeClass("active");
            instance.element.children(":last-child").addClass("active");
            instance.storage.setValue(instance.element.children(":last-child").attr("value"));
        });
    }
}

class DropDownMenu{
    constructor(
        dropDownContainerID,
        dropDownArrowID,
        dropDownSwitchID,
        outputElementID, 
        defaultValue,
        localStorageKey) {

        this.shown = false;
        this.dropDownContainer = $(`#${dropDownContainerID}`);
        this.dropDownArrow = $(`#${dropDownArrowID}`);
        this.dropDownSwitch = $(`#${dropDownSwitchID}`);
        this.outputElement = $(`#${outputElementID}`);
        this.defaultValue = defaultValue;
        this.localStorageKey = localStorageKey;
        this.valueStorage = new Storage(`${localStorageKey}`, defaultValue);
        this.onChange = () => {};
        this.loadFromLocalStorage();
        let instance = this;

        this.dropDownSwitch.on("click", () => {
            instance.switchDropDownState();
        })

        $(`#${dropDownContainerID} ul`).children().each(function() {
            $(this).on("click", () => {
                instance.switchDropDownState();
                instance.outputElement.text($(this).text());
                instance.valueStorage.setValue($(this).attr("value"));
                instance.onChange();
            })
        })
        
        $(document).click(function(e) {
            var obj = instance.dropDownSwitch;
            var secObj = instance.dropDownContainer;
            if(instance.shown) {
                if (!obj.is(e.target) && !obj.has(e.target).length) {
                    if (!secObj.is(e.target) && !secObj.has(e.target).length) {
                        instance.shown = false;
                        instance.hideDropDown();
                    }
                }
                
            }
            
        })
        return this;
    }

    switchDropDownState() {
        this.shown = !this.shown;
        this.shown ? this.showDropDown() : this.hideDropDown();
    }

    hideDropDown() {
        this.shown = false;
        this.dropDownContainer.removeClass("active");
        this.dropDownArrow.removeClass("active");
    }
    showDropDown() {
        this.shown = true;
        this.dropDownContainer.addClass("active");
        this.dropDownArrow.addClass("active");
    }

    loadFromLocalStorage() {
        let valueStorage = this.valueStorage.getValue();
        let instance = this;
        $(`#${this.dropDownContainer.attr("id")} ul`).children().each(function() {
            if (valueStorage === $(this).attr("value")) instance.outputElement.text($(this).text());
        })
    }
    setOnChange(onChange = () => {}) {
        this.onChange = onChange;
        return this;
    }
}

class UserInput{
    constructor(fieldID, storageKey, defaultValue) {
        this.field = $(`#${fieldID}`);
        this.defaultValue = defaultValue;
        this.storage = new Storage(`${storageKey}`, defaultValue);
        this.field.val(this.storage.getValue());
        this.previousValue = this.field.val();
        this.onDateChange = () => {};
        this.fieldValidator = () => {};
        this.onType = () => {};
        this.field.on("keydown", (e) => {
            // Timeout needed to bypass the event that gave back its previous value instead of the new one
            setTimeout(() => {
                this.onType();
            }, 50)
        })
        if (this.field.attr("type") === "datetime-local") this.field.on("change", (e) => {
            // Timeout needed to bypass the event that gave back its previous value instead of the new one
            setTimeout(() => {
                this.onDateChange();
            }, 50)
        })
    }
    // Defines a function that will be run at each keypress
    setOnType(onType = () => {}) {
        this.onType = onType;
        return this;
    }

    // Defines the validation protocol for the input field, function must always return a boolean.
    setFieldValidator(fieldValidator = () => {}) {
        this.fieldValidator = fieldValidator;
        return this;
    }

    setOnDateChange(onDateChange = () => {}) {
        this.onDateChange = onDateChange;
        return this;
    }
}

class ColorPalette{
    constructor(colorContainerID, colorDisplayID, storageKey, defaultValue, linkedCSSVariable , linkedPaletteID) {
        this.colorPaletteElement = $(`#${colorContainerID}`);
        this.colorContainerID = colorContainerID;
        this.defaultValue = defaultValue;
        this.linkedCSSVariable = linkedCSSVariable;
        this.storageKey = storageKey;
        this.linkedPalette = $(`#${linkedPaletteID}`);
        this.colorDisplayID = colorDisplayID;
        this.storage = new Storage(`${storageKey}`, defaultValue);
        
        let instance = this;

        this.colorPaletteElement.children().each(function() {
            //Checks if one of the contained color matches the stored one and then apply or not the active state
            if(instance.storage.getValue() == $(this)[0].style.getPropertyValue("--color-var").trim()) {
                $(this).addClass("active");
                $(`#${instance.colorDisplayID}`)
                    .css("--color-var", `${instance.storage.getValue().trim()}`);
                
                //Changes the root variable of the linked CSS Variable to the stored color
                $(':root').css(`${instance.linkedCSSVariable}`, instance.storage.getValue().trim());
            }

            //Adds remove listener for custom colros
            $(this).children("span").click((e) => {
                e.stopPropagation()
                instance.removeColor($(this)[0].style.getPropertyValue("--color-var").trim())
            })

            //Adds click listener to all of the color elements
            $(this).click(function() {
                if($(this).hasClass("add-color-entry")) {return;}
                
                instance.onClick(this)
            })
            

        })
        return this;
    }
    
    onClick (clickedColor) {
        let instance = this;
        if(!$(this).hasClass("active")) {
            //Adds active state to the clicked element inside of the palette
            instance.colorPaletteElement.children().each( function() {
                if(clickedColor == this) {
                    $(clickedColor).addClass("active")

                    //Changes the color display color
                    $(`#${instance.colorDisplayID}`)
                        .css("--color-var", `${$(clickedColor)[0].style.getPropertyValue("--color-var")}`);
                    instance.storage.setValue($(clickedColor)[0].style.getPropertyValue("--color-var").trim());

                    //Changes the root variable of the linked CSS Variable to the clicked element color
                    $(':root').css(`${instance.linkedCSSVariable}`, $(clickedColor)[0].style.getPropertyValue("--color-var").trim());
                }
                else $(this).removeClass("active")
            })
        }

        //Removes active state from linked palete previously selected element
        instance.linkedPalette.children().each(function() {
            if(instance.storage.getValue() != $(this)[0].style.getPropertyValue("--color-var").trim()) {
                $(this).removeClass("active");
            }
        })
    }

    addColor(hex) {
        //Creates a new color element from hexadecimal color value and adds it to the palette
        let instance = this;
        let newColor = $( `<div style='--color-var: ${hex};' class='color-entry'><span></span></div>` )
        .insertBefore(`#${this.colorContainerID} .add-color-entry`)
        
        newColor.on("click", function() {
            //Adds click listener to the newly created color element
            instance.onClick(this)
        }) ;

        //Adds remove listener
        $(newColor).children("span").click((e) => {
            e.stopPropagation()
            instance.removeColor($(newColor)[0].style.getPropertyValue("--color-var").trim())
        })
    }

    removeColor(hex) {
        let instance = this;
        instance.colorPaletteElement.children().each(function() {
            if ($(this)[0].style.getPropertyValue("--color-var").trim() == hex) {
                let customColorStorage = new Storage("customization-color-list", []);
                let e = customColorStorage.getValue()
                e.splice(e.indexOf(hex), 1)
                customColorStorage.setValue(e)
                this.remove()
            }
        })
    }

    setOnChange(onChange = function() {}) {
        this.onChange = onChange;
        return this;
    }
}

class Bookmark {
    static newTabBool;
    static addBookmarkEl;
    static REGEX_URL = /[A-z]+:\/\/(w{3}\.)?([\W\w]+)/;
    constructor(url, title, localStorageStr) {
        this.url = this.parseUrl(url);
        this.title = (title.charAt(0).toUpperCase() + title.slice(1));
        this.localStorageStr = localStorageStr;
        this.createElement();
        let createdBookmarkObj = {
            title: title,
            url: url
        }
        let temp = localStorage.getItem(this.localStorageStr);
        if (temp) {
            let tempArr = JSON.parse(temp);
            if (!tempArr.find(bookmark => bookmark.url === createdBookmarkObj.url)) {
                tempArr.push(createdBookmarkObj);
            }
            localStorage.setItem(this.localStorageStr, JSON.stringify(tempArr));
        } else {
            localStorage.setItem(this.localStorageStr, JSON.stringify([createdBookmarkObj]));
        }
        this.bookmarkElement.addEventListener("click", () => {
            if (String(this.bookmarkElement.dataset.url).includes("http")) {
                if (Bookmark.newTabBool) {
                    window.open(this.bookmarkElement.dataset.url, "_blank");
                }
                else window.location = this.bookmarkElement.dataset.url;
            }
            else {
                if (Bookmark.newTabBool) {
                    window.open(`https://${this.bookmarkElement.dataset.url}`, "_blank");
                }
                else window.location = `https://${this.bookmarkElement.dataset.url}`;
            }
        })
        this.bookmarkDel.addEventListener("click", (event) => {
            event.stopPropagation();
            this.bookmarkElement.remove();
            let arr = JSON.parse(localStorage.getItem(this.localStorageStr));
            arr.forEach((i) => {
                if (i.url == createdBookmarkObj.url) {
                    arr.splice(arr.indexOf(i), 1);
                }
            })
            localStorage.setItem(this.localStorageStr, JSON.stringify(arr));
        })
    }
    static retrieveBookmarks(localStorageStr) {
        let temp = localStorage.getItem(`${localStorageStr}`);
        let bookmarksArray = []
        if (temp) {
            let arr = JSON.parse(temp);
            arr.forEach((e) => {
                let newBookmark = new Bookmark(e.url, (e.title.charAt(0).toUpperCase() + e.title.slice(1)), localStorageStr);
                bookmarksArray.push(newBookmark);
            })
        }
        return bookmarksArray;
    }
    parseUrl(localUrl) {
        localUrl = localUrl.trim();
        if (localUrl.includes("http")) {
            localUrl = localUrl.match(Bookmark.REGEX_URL)[2];
        }
        let char = localUrl.charAt(localUrl.length - 1);
        if (char == "/") {
            localUrl = localUrl.substring(0, localUrl.length - 1);
        }
        return localUrl;
    }
    createElement() {
        let bookmarkImg = document.createElement("img");
        bookmarkImg.src = `https://icons.duckduckgo.com/ip3/${this.url}.ico`;
        bookmarkImg.className = "bookmark-icon";
        let bookmarkDel = document.createElement("img");
        bookmarkDel.src = "src/assets/plus.svg";
        bookmarkDel.className = "delBookmark";
        let bookmark = document.createElement("div");
        bookmark.className = "bookmark";
        bookmark.setAttribute("tabindex", "1");
        bookmark.title = this.title;
        bookmark.dataset.url = this.url;
        bookmark.appendChild(bookmarkDel);
        this.bookmarkDel = bookmarkDel;
        bookmark.appendChild(bookmarkImg);
        this.bookmarkElement = bookmark;
    }
    display() {
        Bookmark.addBookmarkEl.parentNode.insertBefore(this.bookmarkElement, Bookmark.addBookmarkEl);
    }
}

const minToMs = (minutes) => minutes * 60000;
const msToMin = (minutes) => minutes / 60000;