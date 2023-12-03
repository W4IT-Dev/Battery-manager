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
    battery.addEventListener('chargingchange', updateChargeInfo);

    battery.addEventListener('levelchange', updateLevelInfo);

    battery.addEventListener('chargingtimechange', updateChargingInfo);

    battery.addEventListener('dischargingtimechange', updateDischargingInfo);

    function updateChargeInfo() {
        alarm.pause();
        a = document.querySelector('#container');
        battery.charging ? a.classList.add('charging') : a.classList.remove('charging');
    }
    function updateLevelInfo() {
        batteryLevel = parseInt(battery.level * 100)
        progress.style.width = batteryLevel + "px";
        document.querySelector('#level p').innerText = batteryLevel + "%";
        if (batteryLevel >= maxCharge.value && battery.charging) {
            if (!silent) alarm.play();
            try {
                pushLocalNotification(
                    "Battery over " + maxCharge.value + "%",
                    batteryLevel + "% is your current battery level.",
                    "/assets/image/fullCharge.png"
                )
            } catch (e) { }
        } else if (batteryLevel <= minCharge.value && !battery.charging) {
            if (!silent) alarm.play();
            try {
                pushLocalNotification(
                    "Battery below " + minCharge.value + "%",
                    batteryLevel + "% is your current battery level.",
                    "/assets/image/lowBattery.png"
                );
            } catch (e) { }
        }

        if (batteryLevel <= 10) return progress.style.backgroundColor = "red"
        if (batteryLevel <= 20) return progress.style.backgroundColor = "orange"
        if (batteryLevel <= 30) return progress.style.backgroundColor = "yellow"
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