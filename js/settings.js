document.addEventListener("translated", () => {

    //Background tab animation

    const bgTab = $(".side-pannel-large.backgrounds");
    const bgShowBtn = $(".background-button-wrapper");
    const bgSaveBtn = $("#bg-save");
    const bgCancelBtn = $("#bg-cancel");
    const bgContainer = $(".background-container");
    const settingPannel = $("#settings-pannel")

    let bgTabState = false;

    const switchBgTabState = () => {
        bgTabState = !bgTabState;
        bgTabState ? bgTab.addClass("active") : bgTab.removeClass("active");
        bgTabState ? bgSaveBtn.addClass("active") : bgSaveBtn.removeClass("active");
        bgTabState ? bgCancelBtn.addClass("active") : bgCancelBtn.removeClass("active");
        if(bgTabState) {
            let bgContainerCurrentIndex = 1;
            bgContainer.children().each(function() {
                $(this).css("transition-delay", `${bgContainerCurrentIndex * .05}s`)
                $(this).css("opacity", 1);
                setTimeout(() => {
                    $(this).css("transition-delay", `0s`)
                },bgContainerCurrentIndex * .05 / 1000);
                bgContainerCurrentIndex++;
            })
            bgTab.scrollTop(0);
            settingPannel.removeClass("small");
            settingPannel.addClass("large");
        } 
        else {
            settingPannel.removeClass("large");
            settingPannel.addClass("small");
            bgContainer.children().each(function() {
                $(this).css("transition-delay", `0s`)
                $(this).css("opacity", 0);
            })
        }
    }

    const hideBgTab = () => {
        bgTab.removeClass("active");
        bgSaveBtn.removeClass("active");
        bgCancelBtn.removeClass("active");
        settingPannel.removeClass("large");
        settingPannel.addClass("small");
        bgTabState = false;
        bgContainer.children().each(function() {
            $(this).css("transition-delay", `0s`)
            $(this).css("opacity", 0);
        })
        const backgroundSelectedIDsStorage = new Storage("background-id-selected-array", []);
        const backgroundCycleBooleanStorage = new Storage("background-cycle-boolean", true);
        setTimeout(() => {
            if (!backgroundCycleBooleanStorage.getValue()) return;
            $(".background-container .background-entry-switch").each(function() {
                this.checked = false;
                if (backgroundSelectedIDsStorage.getValue().includes(Number($(this).attr("id")))) {
                    this.checked = true;
                }
            })
        }, 200)
    }

    bgShowBtn.on("click", () => {
        switchBgTabState();
    })

    bgSaveBtn.on("click", () => {
        hideBgTab();
    })

    bgCancelBtn.on("click", () => {
        hideBgTab();
    })
    /**/



    /*Settings pannel state engine*/

    let settingsPannelState = false;
    const openSettings = $("#settings-wheel");
    openSettings.on("click", () => {
        settingPannel.addClass("active");
        settingsPannelState = !settingsPannelState;
    })

    let activeTabIndex = 0;
    let indexIdPannels = {
        0 : "general-settings-pannel",
        1 : "language-settings-pannel",
        2 : "background-settings-pannel",
        3 : "time-settings-pannel",
        4 : "style-settings-pannel",
        5 : "infos-pannel"
    }




    /*sidebar animation*/

    const sideBar = $(".side-bar.left");
    const activeEffect = $(".side-bar .active-effect");
    const sidePannelContent = $(".side-pannel-content");


    /*Close menu if clicked outside*/

    $(".main-content").on("click", (e) => {
        if(!settingPannel.is(e.target) && !settingPannel.has(e.target).length) {
            if (!openSettings.is(e.target) && !openSettings.has(e.target).length) {
                settingsPannelState = false;
                hideBgTab();
                settingPannel.removeClass("active");
            }
        }
    })

    const activate = (element) => {
        sideBar.children().each(function() {
            $(this).removeClass("active");
        });
        $(element).addClass("active");
        
    }

    sideBar.children().each(function() {
        if(!$(this).hasClass("interactible")) return;
        $(this).on("click",() => {
            activate(this);
            //sets the active tab index to the matching id
            activeTabIndex = Object.keys(indexIdPannels).find(key => indexIdPannels[key] === `${$(this).attr("id")}-pannel`);
            sidePannelContent.children().each(function() {
                $(this).removeClass("active");
            })
            $(`#${indexIdPannels[activeTabIndex]}`).addClass("active");
            sidePannelContent.scrollTop(0);
            if ($(this).attr("id") != "") hideBgTab();
        })
        
    });


    /* Delay Input Field */

    let delayInput = new UserInput("delay-input", "background-cycle-interval-integer", 30).setFieldValidator(function (value) {
        if (isNaN(value)) {
            return false;
        }
        if (value < 0){
            return false;
        }
        return true;
    }).setOnType(function() {
        if (!this.fieldValidator(this.field.val())) {
            this.field.val(this.previousValue);
        }
        else {
            this.previousValue = this.field.val();
            this.storage.setValue(Number(this.field.val()));       
        }
        if ( this.field.val() == "" || this.field.val() == 0)  this.storage.setValue(1);
        this.field.on("focusout", () => {
            if ( this.field.val() == "" || this.field.val() == 0) this.field.val(1);
            this.previousValue = this.field.val();
            this.storage.setValue(Number(this.field.val()));
            document.dispatchEvent(new Event("cycle-delay-modified"));
        })
    });

    /* Delay Dropdown Menu */

    let delayDropDown = new DropDownMenu(
        "delay-dd",
        "delay-dda",
        "delay-open",
        "delay-unit-value",
        "sec",
        "background-cycle-interval-unit-string"
    ).setOnChange(function() {
        document.dispatchEvent(new Event("cycle-delay-modified"));
    });

    /* General page intitialization */

    let searchEngineSelector = new OptionSelector("search-engine-selector", "search-engine-string", "google");

    let googleAppsSwitch = new SwitchButton("google-apps-switch", "google-apps-activated-boolean", true, 
        () => { document.dispatchEvent(new Event("google-apps-storage-change")) }, 
        () => { $("#google-apps-nt").addClass("active") }, 
        () => { $("#google-apps-nt").removeClass("active") }
    );

    let googleAppsNTSwitch = new SwitchButton("google-apps-nt-switch", "google-apps-new-page-boolean", true, 
        () => { document.dispatchEvent(new Event("google-apps-storage-change")) }, 
        () => { }, 
        () => { }
    );

    let bookmarkSwitch = new SwitchButton("bookmark-switch", "bookmark-activated-boolean", true, 
        () => { document.dispatchEvent(new Event("bookmark-storage-change")) }, 
        () => { $("#bookmark-nt").addClass("active") }, 
        () => { $("#bookmark-nt").removeClass("active") }
    );

    let bookmarkNTSwitch = new SwitchButton("bookmark-nt-switch", "bookmark-new-page-boolean", true, 
        () => { document.dispatchEvent(new Event("bookmark-storage-change")) }, 
        () => { }, 
        () => { }
    );
    let particleSwitch = new SwitchButton("particle-switch", "particles-activated-boolean", false, 
        () => { document.dispatchEvent(new Event("particles-storage-change")) }, 
        () => { }, 
        () => { }
    );

    let scheduleSwitch = new SwitchButton("schedule-switch", "schedule-activated-boolean", true, 
        () => { document.dispatchEvent(new Event("schedule-storage-change")) }, 
        () => { }, 
        () => { }
    );

    /* Language page intitialization */

    let languageSelector = new OptionSelector("language-selector", "language-string", `${navigator.language}`, false, (choice) => {
        $(".language-warning").each(function() {
            $(this).addClass("active")
        })
    });

    $("#contact-button").click(function() { window.location.reload(); })

    /* Background Tab initialization */

    let cycleSwitch = new SwitchButton("cycle-switch", "background-cycle-boolean", true, 
        () => { document.dispatchEvent(new Event("background-cycle-storage-change")) }, 
        () => { }, 
        () => { }
    );
    document.addEventListener("background-cycle-storage-change", () => {
        const backgroundCycleBooleanStorage = new Storage("background-cycle-boolean", true);
        const backgroundCurrentIDStorage = new Storage("background-id-current-integer", 0);
        const backgroundSelectedIDsStorage = new Storage("background-id-selected-array", []);
        if (backgroundCycleBooleanStorage.getValue()) {
            $(".background-container .background-entry-switch").each(function() {
                this.checked = false;
                $(this).show();
                $(this).siblings("span").show();
                if (backgroundSelectedIDsStorage.getValue().includes(Number($(this).attr("id")))) {
                    this.checked = true
                }
            })
        }
        else {
            $(".background-container .background-entry-switch").each(function() {
                $(this).hide();
                $(this).siblings("span").hide();
                this.checked = false;
                if (backgroundCurrentIDStorage.getValue() == Number($(this).attr("id"))) {
                    this.checked = true;
                    $(this).show();
                    $(this).siblings("span").show();
                }
            })
        }
    })
    let dispatch = () => {document.dispatchEvent(new Event("background-cycle-storage-change"))}
    setTimeout(dispatch, 1000)

    let shuffleSwitch = new SwitchButton("shuffle-switch", "background-shuffle-boolean", true, 
    () => { document.dispatchEvent(new Event("background-cycle-shuffle-storage-change")) }, 
    () => { }, 
    () => { }
    );

    let backgroundSelectAllButton = new Button("select-all-button", () => {
        $(".background-entry-switch").each(function() {
            this.checked = true;
        })
    });
    let backgroundDeselectAllButton = new Button("deselect-all-button", () => {
        $(".background-entry-switch").each(function() {
            this.checked = false;
        })
        $(".background-entry-switch#0")[0].checked = true;
    });

    let backgroundSaveButton = new Button("bg-save", () => {
        const backgroundSelectedIDsStorage = new Storage("background-id-selected-array", []);
        //save behaviour
        
        const backgroundCycleBooleanStorage = new Storage("background-cycle-boolean", true);
        if (!backgroundCycleBooleanStorage.getValue()) return;
        let temp = [];
        let totalChecked = 0;
        $(".background-entry-switch").each(function() {
            if(this.checked) {
                totalChecked++;
                temp.push(Number($(this).attr("id")));
                temp.sort(function (a, b) {  return a - b;  });
            }
        })
        if (totalChecked <= 0) {
            $(".background-entry-switch#0")[0].checked = true;
            temp = [0];
        }
        backgroundSelectedIDsStorage.setValue(temp);
    });
    let backgroundCancelButton = new Button("bg-cancel", () => {
    });

    /* */

    let upperDisplaySelector = new OptionSelector("upper-display-selector", "display-upper-selection", `none`, true, (choice) => {
        switch(choice.attr("value")) {
            case "none":
                $("#top-clock").removeClass("active");
                $("#top-countdown").removeClass("active");
                break;
            case "clock":
                $("#top-countdown").removeClass("active");
                $("#top-clock").addClass("active");
                break;
            case "countdown":
                $("#top-clock").removeClass("active");
                $("#top-countdown").addClass("active");
                break;
        }
    });
    let lowerDisplaySelector = new OptionSelector("lower-display-selector", "display-lower-selection", `none`, true, (choice) => {
        switch(choice.attr("value")) {
            case "none":
                $("#bottom-clock").removeClass("active");
                $("#bottom-countdown").removeClass("active");
                break;
            case "clock":
                $("#bottom-countdown").removeClass("active");
                $("#bottom-clock").addClass("active");
                break;
            case "countdown":
                $("#bottom-clock").removeClass("active");
                $("#bottom-countdown").addClass("active");
                break;
        }
    });


    let labelInput = new UserInput("countdown-label-input", "countdown-label-string", "").setOnType(function() {
        this.previousValue = this.field.val();
        this.storage.setValue(this.field.val());
        document.dispatchEvent(new Event("countdown-label-change"))
    });

    let dateInput = new UserInput("countdown-date-input", "countdown-datetime", `${new Date().getFullYear()}-12-24T00:00`).setOnDateChange(function() {
        this.storage.setValue(this.field[0].value);
        document.dispatchEvent(new Event("countdown-date-change"))
    });

    let timeFormatChocie = new DualChoiceButton(
        "time-format-dual-choice",
        "time-format-string",
        "24h",
        () => {
            document.dispatchEvent(new Event("date-format-change"))
            $(".clock-container").each(function() { $(this).addClass('twelve') });
            $(".clock-container").each(function() { $(this).removeClass('twenty-four') });
        },
        () => {
            document.dispatchEvent(new Event("date-format-change"))
            $(".clock-container").each(function() { $(this).addClass('twenty-four') });
            $(".clock-container").each(function() { $(this).removeClass('twelve') });
        }
    );


    // Customisation Page

    let mainAccentPalette = new ColorPalette(
        "main-accent-default-palette",
        "main-accent-color-display",
        "main-accent-color",
        "#68b6ff",
        "--accent-secondary-color",
        "main-accent-custom-palette"
    );

    let customColorPopup = new Button("main-accent-popup-open", () => {
        $("#main-accent-popup .inline-button-wrapper").children().each(function () {
            $(this).toggleClass("active")
        })
        $("#main-accent-popup").toggleClass("active");
    })
    $(document).click(function(e) {
        var obj = $("#main-accent-popup-open");
        var secObj = $("#main-accent-popup");
        if($("#main-accent-popup").hasClass("active")) {
            if (!obj.is(e.target) && !obj.has(e.target).length) {
                if (!secObj.is(e.target) && !secObj.has(e.target).length) {
                    $("#main-accent-popup .inline-button-wrapper").children().each(function () {
                        $(this).toggleClass("active")
                    })
                    $("#main-accent-popup").toggleClass("active");
                }
            }
        } 
    })

    let customColorStorage = new Storage("customization-color-list", []);


    //Custom Color initialization

    let e = customColorStorage.getValue()
    e.forEach(function(f) {
        $( `<div style='--color-var: ${f};' class='color-entry'><span></span></div>` )
        .insertBefore("#main-accent-popup-open");
    })

    let customMainAccentPalette = new ColorPalette(
        "main-accent-custom-palette",
        "main-accent-color-display",
        "main-accent-color",
        "#68b6ff",
        "--accent-secondary-color",
        "main-accent-default-palette"
    );

    let customMainColorSaveButton = new Button("color-save", () => {
        $("#main-accent-popup").toggleClass("active");
        $("#main-accent-popup .inline-button-wrapper").children().each(function () {
            $(this).toggleClass("active")
        })
        let i = customColorStorage.getValue();
        if(i.includes($("#main-accent-popup .color-entry.custom")[0].value.trim())) { return; }
        i.push($("#main-accent-popup .color-entry.custom")[0].value);
        customColorStorage.setValue(i);
        customMainAccentPalette.addColor($("#main-accent-popup .color-entry.custom")[0].value);
    })

    let customColorCancelButton = new Button("color-cancel", () => {
        $("#main-accent-popup").toggleClass("active");
        $("#main-accent-popup .inline-button-wrapper").children().each(function () {
            $(this).toggleClass("active")
        })
    }) 
});
