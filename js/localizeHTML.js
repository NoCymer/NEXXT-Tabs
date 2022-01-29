const localREGEX = /__MSG_(\w+)__/g
const supportedLanguges = ["en", "fr", "es", "vi"]

//checks if the language is supported if yes store it
const languageStorage = new Storage("language", (supportedLanguges.includes(window.navigator.language) ? window.navigator.language : "en"))

const localizeHtml = () => {
    let html = document.querySelector("html")
    fetch(`../_locales/${languageStorage.getValue()}/messages.json`).then((response)=> {
        return response.json();
    }).then(jsondata => {

        strHtml = String(html.innerHTML)
        strHtml = strHtml.replace(localREGEX,(match, extracted) => {
            return extracted ? jsondata[extracted]["message"] : "";
        })
        html.innerHTML = strHtml;
    });
}
localizeHtml();
setTimeout(() => {
    const languageEl = document.querySelector("#language-choice")
    languageEl.value = languageStorage.getValue()
    $("#refresh-txt").hide()
    languageEl.onchange = () => {
        languageStorage.setValue(languageEl.value)
        $("#refresh-txt").show()
    }
}, 500);
