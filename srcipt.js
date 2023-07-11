document.body.focus();
let alarm = new Audio("/alarm.mp3")
let wakelock = navigator.requestWakeLock('screen');
wakelock.lock();
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
        console.log("Battery charging? "
            + (battery.charging ? "Yes" : "No"));
    }

    battery.addEventListener('levelchange', function () {
        updateLevelInfo();
    });
    function updateLevelInfo() {
        console.log("Battery level: "
            + battery.level * 100 + "%");
        if (battery.level >= .85 || battery.level <= .30) { alarm.play(); }
        if (battery.level > .75) return document.querySelector('img').src = "/100.png"
        if (battery.level > .50) return document.querySelector('img').src = "/75.png"
        if (battery.level > .25) return document.querySelector('img').src = "/50.png"
        if (battery.level > .10) return document.querySelector('img').src = "/25.png"
        if (battery.level <= .10) return document.querySelector('img').src = "/10.png"
    }

    battery.addEventListener('chargingtimechange', function () {
        updateChargingInfo();
    });
    function updateChargingInfo() {
        console.log("Battery charging time: "
            + battery.chargingTime / 60 + " minutes");
            document.querySelector('#charg').innerText = "Battery charging time: "
            + battery.chargingTime / 60 + " minutes"
    }

    battery.addEventListener('dischargingtimechange', function () {
        updateDischargingInfo();
    });
    function updateDischargingInfo() {
        console.log("Battery discharging time: "
            + battery.dischargingTime / 60 + " minutes");
            document.querySelector('#discharg').innerText = "Battery discharging time: "
            + battery.dischargingTime / 60 + " minutes"
    }

});

getKaiAd({
    publisher: 'fe2d9134-74be-48d8-83b9-96f6d803efef',
    app: 'batterymanager',
    onerror: err => console.error('Custom catch:', err),
    onready: ad => {
        // Ad is ready to be displayed
        // calling 'display' will display the ad
        ad.call('display')
    }
})
