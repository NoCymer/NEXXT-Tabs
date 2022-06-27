document.addEventListener("translated", () => {
    const updatePopupContainer = $(".update-popup-container");
    const updatePopup = $(".update-popup");
    const closeUpdatePopup = $("#close-update-popup");
    
    class Paragraph {
        constructor(title,content = undefined) {
            this.title = title;
            this.content = content;
            if (this.title == undefined){
                this.element = $(`<p class="update-paragraph">${this.content}</p>`);
                return this.element;
            }
            if (this.content == undefined){
                this.element = $(`<h4 class="update-paragraph-title">${this.title}</h4>`);
                return this.element;
            }
            this.element = $(`
            <h4 class="update-paragraph-title">${this.title}</h4>
            <p class="update-paragraph">${this.content}</p>
            `)
            return this.element;
        }
    }
    
    class List {
        constructor(entries) {
            this.entries = entries;
            this.element = $(`
            <ul class="update-list">
            
            </ul>
            `)
            for(let entry in this.entries) {
                this.element.append(`
                <li>${this.entries[entry]}</li>
                `);
            }
            return this.element;
        }
    }
    
    //Checks for the last version showcased
    fetch("../manifest.json").then((response)=> {
        return response.json();
    }).then(manifestdata => {
        const lastVersionShowcasedStorage = new Storage("last-version-showcased-string", `${manifestdata.version}`);
            fetch(`../assets/patch-notes/${manifestdata.version}-patch-notes.json`).then((response)=> {
                if(response.ok ) return response.json();
                else return undefined;
            }).then(patchdata => {
    
                //Interpret the patch note as a Jquery object then appends it to the popup
    
                if(patchdata == undefined) return;
    
                const lastVersionShowcasedStorage = new Storage("last-version-showcased-string", `${manifestdata.version}`);
    
                let popup = $(`
                <div class="update-title">${patchdata.title}</div>
                    <div class="youtube-embed" value="${patchdata.videoURL}">
                        <img class="thumbnail-placeholder" src="${patchdata.videoThumbnail}"></img>
                        <div class="play-button"></div>
                    </div>
                    <div class="update-footer">
                        <p class="social-media-paragraph">See us on social medias</p>
                        <div class="social-media-container">
                            <a href="https://github.com/NoCymer" target="_blank" title="Github" id="github"></a>
                            <a href="https://twitter.com/NEXXT_Tabs" target="_blank" title="Twitter" id="twitter"></a>
                            <a href="https://discord.gg/x5EbcbrCQG" target="_blank" title="Discord" id="discord"></a>
                        </div>
                    </div>
                `)
                $(".popup-content").append(popup);
                let popupFooter = popup.siblings(".update-footer");
                for(el in patchdata.content) {
                    switch(patchdata.content[el]["type"]) {
                        case "paragraph": 
                            $(new Paragraph(patchdata.content[el]["title"],patchdata.content[el]["content"])).insertBefore(popupFooter);
                            break;
                        case "list":
                            $(new List(patchdata.content[el]["array"])).insertBefore(popupFooter);
                            break;
                    }
                }
    
                //Displays popup if never shown for current version
                if(lastVersionShowcasedStorage.getValue() != manifestdata.version) {
                    updatePopupContainer.addClass("active");
                    lastVersionShowcasedStorage.setValue(manifestdata.version);
                }
            }).catch(() => {
                updatePopupContainer.removeClass("active");
                lastVersionShowcasedStorage.setValue(manifestdata.version);
            })

        closeUpdatePopup.click(() => {
            updatePopupContainer.removeClass("active")
        })
        //Closes popup if clicked away
        updatePopupContainer.on("click", (e) => {
            const youtubeEmbed = $(".youtube-embed");
            if (!updatePopup.is(e.target) && !updatePopup.has(e.target).length) {
                if (!youtubeEmbed.is(e.target) && !youtubeEmbed.has(e.target).length) {
                    updatePopupContainer.removeClass("active");
                }
            }
        })
        
    });
})