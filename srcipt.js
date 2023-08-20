document.body.focus();
let alarm = new Audio("/alarm.mp3");
let alarming = false;
navigator.getBattery().then(function (battery) {
    function updateAllBatteryInfo() {
        updateChargeInfo();
        updateLevelInfo();
        updateChargingInfo();
        updateDischargingInfo();
    }
    updateAllBatteryInfo();

    battery.addEventListener('chargingchange', function () {
        updateChargeInfo();
    });
    function updateChargeInfo() {
        a = document.querySelector('#container');
        battery.charging ? a.classList.add('charging') : a.classList.remove('charging');
    }

    battery.addEventListener('levelchange', function () {
        updateLevelInfo();
    });
    function updateLevelInfo() {
        document.querySelector('#level #progress').style.width = battery.level * 100 + "px"
        document.querySelector('#level p').innerText = battery.level * 100 + "%"
    }

    battery.addEventListener('chargingtimechange', function () {
        updateChargingInfo();
    });
    function updateChargingInfo() {
        if (battery.dischargingTime != Infinity) {
            document.querySelector('#charge').parentNode.style.display = "flex"
            document.querySelector('#charge').innerText = battery.dischargingTime / 60 + " min"
            console.log(battery.dischargingTime / 60 + " min")
            document.querySelector('#charge').parentNode.classList.add('nav')
        } else document.querySelector('#charge').parentNode.style.display = "none", document.querySelector('#charge').parentNode.classList.remove('nav')
    }

    battery.addEventListener('dischargingtimechange', function () {
        updateDischargingInfo();
    });
    function updateDischargingInfo() {
        if (battery.dischargingTime != Infinity) {
            document.querySelector('#discharge').parentNode.style.display = "flex"
            document.querySelector('#discharge').innerText = battery.dischargingTime / 60 + " min"
            console.log(battery.dischargingTime / 60 + " min")
            document.querySelector('#discharge').parentNode.classList.add('nav')
        } else document.querySelector('#discharge').parentNode.style.display = "none", document.querySelector('#discharge').parentNode.classList.remove('nav')
    }

});
// let wakelock = navigator.requestWakeLock('screen');
document.addEventListener('keydown', () => {
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



function nav(move) {

    let currentIndex = document.activeElement;
    const items = document.querySelectorAll('.nav')

    // console.log
    let currentElemIdx = [...items].indexOf(currentIndex);
    const next = currentElemIdx + move;
    const targetElement = items[next];
    if (targetElement) targetElement.focus();
}

document.addEventListener('keydown', e => {
    if (e.key == "ArrowUp") nav(-1)
    if (e.key == "ArrowDown") nav(1)
})