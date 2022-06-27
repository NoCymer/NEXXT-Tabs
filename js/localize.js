let translateString = () => { throw new Error("Translation Not Fetched")};
let translationJSON;
document.addEventListener("migration-complete", () => {
    const localREGEX = /__MSG_(\w+)__/g;
    const languageREGEX = /\w+/;
    const supportedLanguges = ["en", "fr", "es", "vi"];
    let currentLanguage = "";
    translateString = (string) => {
        let translation;
        string = string.replace(localREGEX,(match, extracted) => {
            translation = extracted ? translationJSON[extracted]["message"] : ""
        });
        return translation;
    }

    //checks if the language is supported if yes store it
    let match = navigator.language.match(languageREGEX)[0];
    const languageStorage = new Storage("language-string", (supportedLanguges.includes(match) ? match : "en"));
    let html = $("html");

    currentLanguage = languageStorage.getValue();
    fetch(`../_locales/${languageStorage.getValue()}/messages.json`).then((response)=> {
        return response.json();
    }).then(jsondata => {
        translationJSON = jsondata;
        strHtml = String(html.html());
        strHtml = strHtml.replace(localREGEX,(match, extracted) => {
            return extracted ? translationJSON[extracted]["message"] : "";
        });
        document.documentElement.innerHTML = strHtml;
        
        setTimeout(() => {  
            document.dispatchEvent(new CustomEvent('translated'));
        }, 50);
    });
})


