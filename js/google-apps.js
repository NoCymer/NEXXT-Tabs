document.addEventListener("translated", () => { 
    const googleAppsPannel = $("#google-apps-pannel");
    const googleAppsButton = $("#google-apps-button");
    const googleAppsContainer = $("#google-apps");
    const googleAppsLinks = $(".google-apps-link-container");
    const googleAppsBooleanStorage = new Storage("google-apps-activated-boolean", true);
    const googleAppsNewTabBooleanStorage = new Storage("google-apps-new-page-boolean", true);

    googleAppsButton.click((e) => {
        googleAppsPannel.addClass("active");
        googleAppsContainer.addClass("active");
    })

    //Closes menu if clicked away
    $("body").click((e) => {
        if (!googleAppsPannel.is(e.target) && !googleAppsPannel.has(e.target).length) {
            if (!googleAppsButton.is(e.target) && !googleAppsButton.has(e.target).length) {
                googleAppsPannel.removeClass("active");
            }
        }
    })

    const updateGoogleAppsBehaviour = () => {
        googleAppsBooleanStorage.getValue() ? googleAppsButton.addClass("active") : googleAppsButton.removeClass("active");
        googleAppsBooleanStorage.getValue() ? googleAppsContainer.removeClass("active") : googleAppsContainer.removeClass("active");
        if(googleAppsNewTabBooleanStorage.getValue()) {
            googleAppsLinks.children().each(function() {
                $(this).attr("target", "_blank");
            })
        }
        else{
            googleAppsLinks.children().each(function() {
                $(this).attr("target", "");
            })
        }
    }
    updateGoogleAppsBehaviour();

    document.addEventListener("google-apps-storage-change", () => {
        updateGoogleAppsBehaviour();
    
    })

})