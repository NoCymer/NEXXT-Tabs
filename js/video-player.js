document.addEventListener("translated",() => {
    //Timeout needed for popup initialization
    setTimeout(() => {
        $(".youtube-embed").each(function() {
            let embed = $(this);
            let embedUrl = embed.attr("value");
            let playButton = embed.find(".play-button");
            let thumbnailPlaceholder = embed.find(".thumbnail-placeholder");
            
            const loadIframe = () => {
                //Timeout needed for close when clicked away
                setTimeout(() => {
                    thumbnailPlaceholder.remove();
                    playButton.remove();
                    embed.append(`
                        <iframe
                        style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; border-radius: 15px;"
                        src="${embedUrl}?autoplay=1"
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen>
                        </iframe>
                    `);
                }, 200)
            }
            thumbnailPlaceholder.click(loadIframe);
        })
    },1500)
})
