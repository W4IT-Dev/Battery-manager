const supportedLanguages = ['ar', 'de', 'en', 'es', 'fr', 'it', 'ru', 'zh'];
let translations = {};
const userLanguage = navigator.language || navigator.userLanguage;
const languageCode = userLanguage.split('-')[0];

const loadLanguageFile = language => new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/translation/${language}.json`, true);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                try {
                    translations = JSON.parse(xhr.responseText);
                    const arrowRights = document.querySelectorAll('.arrowRight')
                    const arrowLefts = document.querySelectorAll('.arrowLeft')
                    const isArabic = language === 'ar';
                    console.log(isArabic)

                    const arrowRightSrc = isArabic ? '/assets/image/arrowLeft.png' : '/assets/image/arrowRight.png';
                    const arrowLeftSrc = isArabic ? '/assets/image/arrowRight.png' : '/assets/image/arrowLeft.png';

                    document.body.classList.toggle('rtl', isArabic);

                    [...arrowRights].forEach(element => {
                        element.src = arrowRightSrc;
                        element.classList.toggle('arrowLeft', isArabic);
                        element.classList.toggle('arrowRight', !isArabic);
                    });

                    [...arrowLefts].forEach(element => {
                        element.src = arrowLeftSrc;
                        element.classList.toggle('arrowLeft', !isArabic);
                        element.classList.toggle('arrowRight', isArabic);
                    });
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
            element.dataset.explanation = translate(key)
        } else element.innerText = translate(key);
    });

};

const isLanguageSupported = language => supportedLanguages.includes(language);

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