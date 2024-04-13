const supportedLanguages = ["ar", "de", "en", "es", "fr", "it", "pl", "ru", "sw", "ur", "zh-HK", "zh-CN"];
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
                if (document.title === "About") return e()
                let r = "ar" === a || "ur" === a,
                    n = r ? `/assets/image/arrowLeft_${document.body.classList.contains('light') ? 'light' : 'dark'}.png` : `/assets/image/arrowRight_${document.body.classList.contains('light') ? 'light' : 'dark'}.png`,
                    g = r ? `/assets/image/arrowRight_${document.body.classList.contains('light') ? 'light' : 'dark'}.png` : `/assets/image/arrowLeft_${document.body.classList.contains('light') ? 'light' : 'dark'}.png`;
                keystrokes.src = `/assets/image/keystrokes${r ? '_ar' : ''}_${silent}_${document.body.classList.contains('light') ? 'light' : 'dark'}.png`;
                document.body.classList.toggle("rtl", r), [...arrowRights].forEach(a => {
                    a.src = n, a.classList.toggle("arrowLeft", r), a.classList.toggle("arrowRight", !r)
                }), [...arrowLefts].forEach(a => {
                    a.src = g, a.classList.toggle("arrowLeft", !r), a.classList.toggle("arrowRight", r)
                })
                e()
                if (localStorage.betaTranslations && localStorage.betaTranslations === languageCode) {
                } else {
                    if (languageCode == "sw" || languageCode == "ur") {
                        alert(translate('beta_translations'));
                        localStorage.betaTranslations = languageCode
                    }
                }
            } catch (l) {
                t(`Error parsing language file: ${l} `)
            } else t(`Error loading language file: ${s.statusText} `)
        }
    }, s.send()
}),
    translate = a => translations[a] || a,
    updateUIWithTranslations = () => {
        Array.from(document.querySelectorAll("[data-translate]")).forEach(a => {
            let e = a.getAttribute("data-translate");
            if (e.includes("html")) a.outerHTML = translate(e)
            e.includes("explanation") ? a.dataset.explanation = translate(e) : a.innerText = translate(e)
        })
        if (document.title !== "About") batteryStats();
    },
    isLanguageSupported = a => supportedLanguages.includes(a),
    loadAndTranslate = a => {
        isLanguageSupported(a) ? loadLanguageFile(a).then(updateUIWithTranslations).catch(a => console.error(a)) : console.error(`Unsupported language: ${a} `)
    };
loadAndTranslate(languageCode);