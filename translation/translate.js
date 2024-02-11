const supportedLanguages = ['ar', 'de', 'en', 'es', 'fr', 'it', 'ru', 'zh'];
let translations = {};

const loadLanguageFile = language => new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/translation/${language}.json`, true);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                try {
                    translations = JSON.parse(xhr.responseText);
                    language === "ar" ? document.body.classList.add('rtl') : document.body.classList.remove('rtl')
                    resolve();
                } catch (error) {
                    reject(`Error parsing language file: ${error}`);
                }
            } else {
                reject(`Error loading language file: ${xhr.statusText}`);
            }
        }
    };
    xhr.send();
});

const translate = key => translations[key] || key;

const updateUIWithTranslations = () => {
    const elementsToTranslate = Array.from(document.querySelectorAll('[data-translate]'));
    elementsToTranslate.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (key.includes('explanation')) {
            //translate
            element.dataset.explanation = translate(key)
        } else element.innerText = translate(key);
    });

};

const isLanguageSupported = language => supportedLanguages.includes(language);

const userLanguage = navigator.language || navigator.userLanguage;
const languageCode = userLanguage.split('-')[0];

const loadAndTranslate = language => {
    if (isLanguageSupported(language)) {
        loadLanguageFile(language)
            .then(updateUIWithTranslations)
            .catch(error => console.error(error));
    } else {
        console.error(`Unsupported language: ${language}`);
    }
};

loadAndTranslate(languageCode);