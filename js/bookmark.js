document.addEventListener("translated", () => {

    const addBookmarkElement = $("#add-bookmark");
    const bookmarkContainer = $("#bookmark-container");
    const bookmarkPopup = $("#bookmark-form");
    const bookmarkActiveBooleanStorage = new Storage("bookmark-activated-boolean", true)
    const bookmarkStorage = new Storage("bookmark-list", []) ;
    const BOOKMARK_LOGO_URL = "https://icons.duckduckgo.com/ip3";
    const REGEX_URL = /[A-z]+:\/\/(w{3}\.)?([\W\w]+)/;
    const REGEX_SIMPLIFY_URL = /(.+?(?=\/))/;
    
    let REGEX_WWW_URL = /www\.(.+)/;
    
    
    //Creates and displays a bookmark by its url and title before the addBookmarkElement 
    const displayBookmark = (url, title) => {
        let logoURL = "";
        try { logoURL = url.match(REGEX_SIMPLIFY_URL)[1] ; } catch { logoURL = url; }
        logoURL = logoURL.toLowerCase();
        let el = $(
            `<div class="bookmark" id="${url}" title="${title}">
                <span></span>
                <img src="${BOOKMARK_LOGO_URL}/${logoURL}.ico"">
            </div>`
        );
    
        el.insertBefore(addBookmarkElement);
    
        //Click delete behaviour
        el.find("span").click(function() {
            deleteBookmark($(this).parent().attr("id"));
        })
    
        //Click open behaviour
        el.click(function() {
            const bookmarkNewTabBoolStorage = new Storage("bookmark-new-page-boolean", true);
            let url = $(this).attr("id");
    
            if (bookmarkNewTabBoolStorage.getValue()) {
                window.open(`https://${url}`, "_blank");
            } else window.location = `https://${url}`;
        })
    }
    
    // Simplifies the url 
    const parseUrl = (url) => {
        url = url.trim();
        if (url.includes("http")) {
            url = url.match(REGEX_URL)[2];
        }
        let char = url.charAt(url.length - 1);
        if (char == "/") {
            url = url.substring(0, url.length - 1);
        }
        try { url = url.match(REGEX_WWW_URL)[1]; } catch {}
    
        return url;
    }
    
    
    //Initializes all stored bookmarks and displays them
    const initBookmarks = () => {
        let bookmarks = bookmarkStorage.getValue();
        for(bookmark in bookmarks) {
            displayBookmark(bookmarks[bookmark].url, bookmarks[bookmark].title);
        }
    }
    
    //Creates and store a new bookmark from its title and url
    const addBookmark = (url, title) => {
        url = parseUrl(url);
        let array = [];
        let bookmarks = bookmarkStorage.getValue();
        for(bookmark in bookmarks) array.push(bookmarks[bookmark]);
        array.push({"title": title, "url": url});
        bookmarkStorage.setValue(array);
    
        displayBookmark(url, title);
    }
    
    const deleteBookmark = (url) => {
        let array = [];
        let bookmarks = bookmarkStorage.getValue();
        for(bookmark in bookmarks) {
            if(bookmarks[bookmark].url != url) array.push(bookmarks[bookmark]);
        }
        bookmarkStorage.setValue(array);
    
        bookmarkContainer.children().each(function() {
            if($(this).attr("id") == url) $(this).remove();
        })
    }
    
    //First Initialization on page load
    initBookmarks();
    bookmarkActiveBooleanStorage.getValue() ? bookmarkContainer.addClass("active") : bookmarkContainer.removeClass("active")
    
    
    /* Bookmark popup internal logic */
    
    addBookmarkElement.click(function() {
        bookmarkPopup.addClass("active");
    })
    
    const bookmarkTitle = bookmarkPopup.find("#bookmark-title");
    const bookmarkURL = bookmarkPopup.find("#bookmark-url");
    
    const closeBookmarkPopup = () => {
        bookmarkPopup.removeClass("active");
        bookmarkTitle[0].value = "";
        bookmarkURL[0].value = "";
    }
    
    //Closes popup if clicked away
    $("body").on("click", (e) => {
        if (!bookmarkPopup.is(e.target) && !bookmarkPopup.has(e.target).length) {
            if (!addBookmarkElement.is(e.target) && !addBookmarkElement.has(e.target).length) {
                closeBookmarkPopup();
            }
        }
    })
    
    const saveBookmark = () => {
        if(bookmarkURL[0].value.trim() == "") {
            closeBookmarkPopup();
            return;
        }
        addBookmark(bookmarkURL[0].value, bookmarkTitle[0].value)
        closeBookmarkPopup();
    }
    
    //Save behaviour
    bookmarkPopup.find("#bookmark-save").click(function() {
        saveBookmark();
    })
    
    //Cancel behaviour
    bookmarkPopup.find("#bookmark-discard").click(function() {
        closeBookmarkPopup();
    })
    
    document.addEventListener("bookmark-storage-change", () => {
        bookmarkActiveBooleanStorage.getValue() ? bookmarkContainer.addClass("active") : bookmarkContainer.removeClass("active")
    })
    
    bookmarkPopup.on("submit", (e) => {
        e.preventDefault();
        e.stopPropagation();
        saveBookmark();
    })

})
