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
        progress.style.width = battery.level * 100 + "px";
        document.querySelector('#level p').innerText = parseInt(battery.level * 100) + "%";
        if (battery.level >= document.querySelector('#max-charge').value / 100 && battery.charging || battery.level <= document.querySelector('#min-charge').value / 100) alarm.play();
        if (battery.level <= .10) return progress.style.backgroundColor = "red"
        if (battery.level <= .20) return progress.style.backgroundColor = "orange"
        if (battery.level <= .30) return progress.style.backgroundColor = "yellow"
        progress.style.backgroundColor = "green"

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