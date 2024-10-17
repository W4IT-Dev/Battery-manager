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
            updateHealth();
            temperatureUpdateInterval = setInterval(() => { updateTemperatureInfo(); }, 60000 * 5);
        }
        updateAllBatteryInfo();
        //events
        battery.addEventListener('chargingchange', updateChargeInfo);
        battery.addEventListener('levelchange', updateLevelInfo);
        battery.addEventListener('chargingtimechange', updateChargingInfo);
        battery.addEventListener('dischargingtimechange', updateDischargingInfo);
        battery.addEventListener('healthchange', updateHealth);

        function updateChargeInfo() {
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
                    const title = `${translate('battery_over')} ${maxCharge.value}% `;
                    const body = (languageCode == "el" ? "Το " : "") + batteryLevel + translate('is_current_level')
                    pushLocalNotification(title, body, "charge", "/assets/image/fullCharge.png");
                } catch (e) { toastMessage(title), console.error(e); }
            } else if (batteryLevel <= minCharge.value && !battery.charging) {
                if (!silent) alarm.play();
                try {
                    const title = ` ${translate('battery_below')} ${minCharge.value}% `;
                    const body = (languageCode == "el" ? "Το " : "") + batteryLevel + translate('is_current_level')
                    pushLocalNotification(title, body, "charge", "/assets/image/lowBattery.png");
                } catch (e) { toastMessage(title), console.error(e) }
            }

            if (batteryLevel <= 10) return progress.style.backgroundColor = "red";
            if (batteryLevel <= 20) return progress.style.backgroundColor = "orange";
            if (batteryLevel <= 30) return progress.style.backgroundColor = "yellow";
            progress.style.backgroundColor = "green"
        }
        function updateChargingInfo() {
            let wrapper = charge.parentNode;
            if (battery.chargingTime !== Infinity) {
                wrapper.style.display = "flex"
                charge.innerText = parseInt(battery.chargingTime / 60) + " " + minTranslation;
                wrapper.classList.add('nav')
            } else wrapper.style.display = "none", wrapper.classList.remove('nav')
        }
        function updateDischargingInfo() {
            let wrapper = dischargingTime.parentNode;
            if (battery.dischargingTime !== Infinity) {
                wrapper.style.display = "flex"
                dischargingTime.innerText = parseInt(battery.dischargingTime / 60) + " " + minTranslation
                wrapper.classList.add('nav')
            } else wrapper.style.display = "none", wrapper.classList.remove('nav')

        }
        function updateTemperatureInfo() {
            let wrapper = temperature.parentNode
            if (battery.temperature !== undefined) wrapper.style.display = "flex", wrapper.classList.add('nav'), temperature.innerText = battery.temperature + '°'
            else toastMessage('Unable to get battery temperature.'), wrapper.style.display = "none", wrapper.classList.remove('nav')
        }
        function updateHealth() {
            let health = battery.health ? battery.health : false;
            console.log(health)
            if (!health) return toastMessage('Unable to get battery health.');
            if (health == "Overheat" || health == "Cold") {
                let title = a ? translate('overheatAlert') : translate('coldAlert');
                let body = (languageCode == "el" ? "Το " : "") + battery.temperature + translate('currentTemperature')
                if (languageCode == "tr") {
                    let trTranslation = translate('currentTemperature').split('x', 2)
                    body = trTranslation[0] + battery.temperature + trTranslation[1]
                }
                let icon = a ? "/assets/image/overheat.png" : "/assets/image/lowTemp.png"
                try { pushLocalNotification(title, body, "temp", icon) } catch (e) { toastMessage(title || "temp alert"), console.error(e) }
            }
        }


        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState == "hidden") {
                clearInterval(temperatureUpdateInterval)
            } else {
                updateTemperatureInfo();
                battery.charging ? temperatureUpdateInterval = setInterval(() => { updateTemperatureInfo(); }, 60000 * 2) : temperatureUpdateInterval = setInterval(() => { updateTemperatureInfo(); }, 60000 * 5);
            }
        })

        temperature.parentNode.addEventListener('focus', () => {
            updateTemperatureInfo();
        })
    });
}