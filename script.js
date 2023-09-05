document.body.focus();
let alarm = new Audio("/alarm.mp3");
let alarming = false;
if (navigator.getBattery) navigator.getBattery().then(function (battery) {
    function updateAllBatteryInfo() {
        updateChargeInfo();
        updateLevelInfo();
        updateChargingInfo();
        updateDischargingInfo();
        document.querySelector('#temperature').innerText = battery.temperature + '°';

    }
    updateAllBatteryInfo();
    //events
    battery.addEventListener('chargingchange', function () {
        updateChargeInfo();
    });

    battery.addEventListener('levelchange', function () {
        updateLevelInfo();
    });

    battery.addEventListener('chargingtimechange', function () {
        updateChargingInfo();
    });

    battery.addEventListener('dischargingtimechange', function () {
        updateDischargingInfo();
    });

    //functions
    function updateChargeInfo() {
        a = document.querySelector('#container');
        battery.charging ? a.classList.add('charging') : a.classList.remove('charging');
    }
    function updateLevelInfo() {
        if (battery.level >= document.querySelector('#max-charge').value / 100 && battery.charging || battery.level <= document.querySelector('#min-charge').value / 100) alarm.play();
        document.querySelector('#level #progress').style.width = battery.level * 100 + "px";
        document.querySelector('#level p').innerText = parseInt(battery.level * 100) + "%";
    }
    function updateChargingInfo() {
        if (battery.chargingTime !== Infinity) {
            document.querySelector('#charge').parentNode.style.display = "flex"
            document.querySelector('#charge').innerText = parseInt(battery.chargingTime / 60) + " min"
            document.querySelector('#charge').parentNode.classList.add('nav')
        } else document.querySelector('#charge').parentNode.style.display = "none", document.querySelector('#charge').parentNode.classList.remove('nav')
    }
    function updateDischargingInfo() {
        if (battery.dischargingTime !== Infinity) {
            document.querySelector('#discharge').parentNode.style.display = "flex"
            document.querySelector('#discharge').innerText = parseInt(battery.dischargingTime / 60) + " min"
            document.querySelector('#discharge').parentNode.classList.add('nav')
        } else document.querySelector('#discharge').parentNode.style.display = "none", document.querySelector('#discharge').parentNode.classList.remove('nav')
    }

});
document.addEventListener('keydown', (e) => {
    if (e.key.includes('Arrow')) e.preventDefault();
    if (document.activeElement.id == "max-charge" && e.key == "ArrowLeft") document.activeElement.stepDown()
    if (document.activeElement.id == "max-charge" && e.key == "ArrowRight") document.activeElement.stepUp()
    if (document.activeElement.id == "min-charge" && e.key == "ArrowLeft") document.activeElement.stepDown()
    if (document.activeElement.id == "min-charge" && e.key == "ArrowRight") document.activeElement.stepUp()
    if (alarming) alarm.pause(), alarming = false;
})
getKaiAd({
    publisher: 'fe2d9134-74be-48d8-83b9-96f6d803efef',
    app: 'batterymanager',
    test: 1,
    onerror: err => console.error('error getting ad: ', err),
    onready: ad => {
        ad.call('display')
    }
})

let divs = document.querySelectorAll('#info .nav, #info * .nav')
for (let i = 0; i < divs.length; i++) {
    let a;
    divs[i].addEventListener('focus', () => {
        a = setTimeout(() => {
            document.querySelectorAll('.div')[i].classList.add('showinfo')
        }, 1000)
    })
    divs[i].addEventListener('blur', () => {
        clearTimeout(a);
        document.querySelectorAll('.div')[i].classList.remove('showinfo')
    })
    divs[i].addEventListener('keydown', e => {
        if (e.key == "Enter") document.querySelectorAll('.div')[i].classList.remove('showinfo')
    })
}

function nav(move) {
    let currentIndex = document.activeElement;
    const items = document.querySelectorAll('.nav')

    // console.log
    let currentElemIdx = [...items].indexOf(currentIndex);
    const next = currentElemIdx + move;
    const targetElement = items[next];
    if (move < 0 && !document.activeElement.classList.contains('nav')) return items[items.length - 1].focus();
    if (targetElement) { targetElement.focus(); } else document.activeElement.blur();
}

document.addEventListener('keydown', e => {
    e.preventDefault();
    if (e.key == "ArrowUp") nav(-1)
    if (e.key == "ArrowDown") nav(1);
    if(e.key == "ArrowRight") document.querySelector('.active').classList.remove('active'), document.querySelector('#slider div').classList.add('active')
})