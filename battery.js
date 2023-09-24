if (navigator.getBattery) navigator.getBattery().then(function (battery) {
    function updateAllBatteryInfo() {
        updateChargeInfo();
        updateLevelInfo();
        updateChargingInfo();
        updateDischargingInfo();
        temperature.innerText = battery.temperature + '°';
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
        if (battery.level >= maxCharge.value / 100 && battery.charging) {
            alarm.play();
            try {
                pushLocalNotification(
                    "Battery reached " + maxCharge.value + "%",
                    "Your battery is currently at " + battery.level * 100 + "%"
                )
            } catch (e) { console.log(e) }
        } else if (battery.level <= minCharge.value / 100 && !battery.charging) {
            alarm.play();
            try {
                pushLocalNotification(
                    "Battery dropped below " + maxCharge.value + "%",
                    "Your battery is currently at " + battery.level * 100 + "%"
                );
            } catch (e) { console.log(e) }
        }

        if (battery.level <= .10) return progress.style.backgroundColor = "red"
        if (battery.level <= .20) return progress.style.backgroundColor = "orange"
        if (battery.level <= .30) return progress.style.backgroundColor = "yellow"
        progress.style.backgroundColor = "green"

    }
    function updateChargingInfo() {
        if (battery.chargingTime !== Infinity) {
            charge.parentNode.style.display = "flex"
            charge.innerText = parseInt(battery.chargingTime / 60) + " min"
            charge.parentNode.classList.add('nav')
        } else charge.parentNode.style.display = "none", charge.parentNode.classList.remove('nav')
    }
    function updateDischargingInfo() {
        if (battery.dischargingTime !== Infinity) {
            dischargingTime.parentNode.style.display = "flex"
            dischargingTime.innerText = parseInt(battery.dischargingTime / 60) + " min"
            dischargingTime.parentNode.classList.add('nav')
        } else dischargingTime.parentNode.style.display = "none", dischargingTime.parentNode.classList.remove('nav')
    }

});