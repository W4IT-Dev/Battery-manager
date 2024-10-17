const supportedLanguages = ["ar", "de", "el", "en", "es", "fr", "he", "it", "pl", "pt", "ru", "sw", "tr", "ur", "zh-CN", "zh-HK"]
let translations = {};
const userLanguage = navigator.language || navigator.userLanguage;
let languageCode = userLanguage.split("-")[0];
userLanguage.includes("zh") && (languageCode = userLanguage.includes("TW") ? "zh-HK" : userLanguage);
const loadLanguageFile = a => new Promise((e, t) => {
    let s = new XMLHttpRequest;
    s.open("GET", `/translation/${a}.json`, !0), s.onreadystatechange = () => {
        if (4 === s.readyState) {
            if (200 === s.status) try {
                translations = JSON.parse(s.responseText);
                let r = ("ar" === a || "ur" === a || "he" === a);
                document.body.classList.toggle("rtl", r);
                if (document.title === "About") return e()
                n = r ? `/assets/image/arrowLeft_${document.body.classList.contains('light') ? 'light' : 'dark'}.png` : `/assets/image/arrowRight_${document.body.classList.contains('light') ? 'light' : 'dark'}.png`,
                    g = r ? `/assets/image/arrowRight_${document.body.classList.contains('light') ? 'light' : 'dark'}.png` : `/assets/image/arrowLeft_${document.body.classList.contains('light') ? 'light' : 'dark'}.png`;
                keystrokes.src = `/assets/image/keystrokes${r ? '_ar' : ''}_${silent}_${document.body.classList.contains('light') ? 'light' : 'dark'}.png`;
                [...arrowRights].forEach(a => {
                    a.src = n, a.classList.toggle("arrowLeft", r), a.classList.toggle("arrowRight", !r)
                }), [...arrowLefts].forEach(a => {
                    a.src = g, a.classList.toggle("arrowLeft", !r), a.classList.toggle("arrowRight", r)
                })
                e()
            } catch (l) {
                t(`Error parsing language file: ${l} `), batteryStats();
            } else t(`Error loading language file: ${s.statusText} `), batteryStats();
        }
    }, s.send()
}),
    translate = a => translations[a]
updateUIWithTranslations = () => {
    Array.from(document.querySelectorAll("[data-translate]")).forEach(a => {
        let e = a.getAttribute("data-translate");
        if (e.includes("html")) a.outerHTML = translate(e)
        e.includes("explanation") ? a.dataset.explanation = translate(e) : a.innerText = translate(e)
    })
},
    isLanguageSupported = a => supportedLanguages.includes(a),
    loadAndTranslate = a => {
        isLanguageSupported(a) ? loadLanguageFile(a).then(() => { updateUIWithTranslations(), document.title === "About" ? false : batteryStats() }).catch(a => console.error(a)) : (console.error(`Unsupported language: ${a} `))
    };
loadAndTranslate(languageCode)