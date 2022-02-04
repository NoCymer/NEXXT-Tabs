const localREGEX = /__MSG_(\w+)__/g
const languageREGEX = /\w+/
const supportedLanguges = ["en", "fr", "es", "vi"]
let currentLanguage = ""
//checks if the language is supported if yes store it
let match = navigator.language.match(languageREGEX)[0]
const languageStorage = new Storage("language", (supportedLanguges.includes(match) ? navigator.language : "en"))
const localizeHtml = () => {
    let html = document.querySelector("html")
    currentLanguage = languageStorage.getValue();
    fetch(`../_locales/${languageStorage.getValue()}/messages.json`).then((response)=> {
        return response.json();
    }).then(jsondata => {

        strHtml = String(html.innerHTML)
        strHtml = strHtml.replace(localREGEX,(match, extracted) => {
            return extracted ? jsondata[extracted]["message"] : "";
        })
        html.innerHTML = strHtml;
        setTimeout(() => {
            document.dispatchEvent(new CustomEvent('translated'))
            const languageEl = document.querySelector("#language-choice")
            languageEl.value = languageStorage.getValue()
            $("#refresh-txt").hide()
            languageEl.onchange = () => {
                $("#refresh-txt").show()
                languageStorage.setValue(languageEl.value)
                if (languageEl.value == currentLanguage) {$("#refresh-txt").hide()}
            }
        }, 50)
    });
}
localizeHtml();

