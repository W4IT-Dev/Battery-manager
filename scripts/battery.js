let temperatureUpdateInterval = null;
function batteryStats() {
    if (navigator.getBattery) navigator.getBattery().then(function (battery) {
        let minTranslation = translate("min")

        function updateAllBatteryInfo() {
            updateChargeInfo();
            updateLevelInfo();
            updateChargingInfo();
            updateDischargingInfo();
            updateTemperatureInfo();
            temperatureUpdateInterval = setInterval(() => { updateTemperatureInfo(); }, 60000 * 5);
        }
        updateAllBatteryInfo();
        //events
        battery.addEventListener('chargingchange', updateChargeInfo);

        battery.addEventListener('levelchange', updateLevelInfo);

        battery.addEventListener('chargingtimechange', updateChargingInfo);

        battery.addEventListener('dischargingtimechange', updateDischargingInfo);

        function updateChargeInfo() {
            if(navigator.usb) {
                if(navigator.usb.deviceAttached && !battery.charging){
                    let a = translate('not_charging');
                    let b = translate('usb_attached_but_not_charging');
                    pushLocalNotification(a,b)
                    // "/assets/image/notCharging.png"
                }
                    
            }
            a = document.querySelector('#container');
            battery.charging ? (a.classList.add('charging'), temperatureUpdateInterval = setInterval(() => { temperature.innerText = battery.temperature + '°' }, 60000 * 2)) : (a.classList.remove('charging'), alarm.pause(), temperatureUpdateInterval = setInterval(() => { temperature.innerText = battery.temperature + '°' }, 60000 * 5));
        }
        function updateLevelInfo() {
            batteryLevel = parseInt(battery.level * 100)
            progress.style.width = batteryLevel + "px";
            document.querySelector('#level p').innerText = batteryLevel + "%";
            if (batteryLevel >= maxCharge.value && battery.charging) {
                if (!silent) alarm.play();
                try {
                    const title = `${translate('battery_over')} ${maxCharge.value}%`;
                    const body = batteryLevel + translate('is_current_level')
                    pushLocalNotification(
                        title,
                        body,
                        "/assets/image/fullCharge.png"
                    )
                } catch (e) { }
            } else if (batteryLevel <= minCharge.value && !battery.charging) {
                if (!silent) alarm.play();
                try {
                    const title = `${translate('battery_below')} ${minCharge.value}%`;
                    const body = batteryLevel + translate('is_current_level')
                    pushLocalNotification(
                        title,
                        body,
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
                charge.innerText = parseInt(battery.chargingTime / 60) + " " + minTranslation;
                charge.parentNode.classList.add('nav')
            } else charge.parentNode.style.display = "none", charge.parentNode.classList.remove('nav')
        }
        function updateDischargingInfo() {
            if (battery.dischargingTime !== Infinity) {
                dischargingTime.parentNode.style.display = "flex"
                dischargingTime.innerText = parseInt(battery.dischargingTime / 60) + " " + minTranslation
                dischargingTime.parentNode.classList.add('nav')
            } else dischargingTime.parentNode.style.display = "none", dischargingTime.parentNode.classList.remove('nav')
        }
        function updateTemperatureInfo() {
            if (battery.temperature !== undefined) temperature.parentNode.style.display = "flex", temperature.innerText = battery.temperature + '°'
            else toastMessage('Unable to get battery temperature.'), temperature.parentNode.style.display = "none";
        }

        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState == "hidden") {
                clearInterval(temperatureUpdateInterval)
            } else {
                updateTemperatureInfo();
                battery.charging ? temperatureUpdateInterval = setInterval(() => { updateTemperatureInfo(); }, 60000 * 2) : temperatureUpdateInterval = setInterval(() => { updateTemperatureInfo(); }, 60000 * 5);
            }
        })

        temperature.parentNode.addEventListener('focus', ()=>{
            updateTemperatureInfo();
        })
    });
}