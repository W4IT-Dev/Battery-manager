const supportedLanguages = ["ar", "de", "en", "es", "fr", "it", "pl", "ru", "sw", "ur", "zh-HK", "zh-CN"];
let translations = {
    "app_name": "Battery Manager",
    "battery_below": "Battery below",
    "battery_over": "Battery over",
    "charge_time": "Charge time:",
    "charge_time_explanation": "Estimated time to fully charge the battery",
    "disabled": "disabled",
    "discharge_time": "Discharge time:",
    "discharge_time_explanation": "Estimated time until the battery is fully depleted",
    "enabled": "enabled",
    "is_current_level": "% is your current battery level.",
    "max_charge": "Max charge:",
    "max_charge_explanation": "Alarm activates when the battery exceeds this level",
    "min": "min",
    "min_charge": "Min charge:",
    "min_charge_explanation": "Alarm activates when the battery drops below this level.",
    "silent_alarm": "Silent alarm",
    "temperature": "Temperature:",
    "temperature_explanation": "Estimated temperature of the battery in Celsius",
    "html": "<h1>About</h1><h2>Battery Manager v1.4.2</h2><p>Battery insights and custom alerts.<h2>What does the app do?</h2><p>Battery Manager is your go-to solution for efficient battery management on your KaiOS smartphone. Keep track of vital battery stats like discharge and charge times, temperature, and real-time level changes. Set personalized alerts for specific battery levels, both high and low, to ensure you never run out of power when you need it most. Download KaiOS Battery Manager now and take charge of your device's battery life for a worry-free mobile experience<h2>Keystrokes:</h2><p>1 - Volume down<p>3 - Volume up<p>0 - Toggle Light mode<p>* - Toggle silent alarm (only notification)<p># - Show this page<h2>License</h2><p>This code stands under the GNU General Public License v3.0<p>View code <a href=https://github.com/W4IT-Dev/Battery-Manager>here</a><h2>Credits</h2>Icon found on <a href=https://www.vecteezy.com/png/9394734-battery-charge-png-transparent>vecteezy</a><h3>Translators:</h3><p>Arabic: Mykle<p>French: swye<p>Polish: nuclear<p>Urdu: san<h2>Contact</h2><h3>If you found any issues within this app, you can contact me per <a href='mailto:w4it.dev.business@gmail.com?Subject=Battery%20Manager%20v1.4.2%20Issue%20report'>email</a></h3>"
};
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
                t(`Error parsing language file: ${l} `), batteryStats();
            } else t(`Error loading language file: ${s.statusText} `), batteryStats();
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
        isLanguageSupported(a) ? loadLanguageFile(a).then(updateUIWithTranslations).catch(a => console.error(a)) : (console.error(`Unsupported language: ${a} `), batteryStats())
    };
loadAndTranslate(languageCode);