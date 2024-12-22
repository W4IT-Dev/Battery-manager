const alarm = new Audio("/assets/alarm.mp3");
alarm.mozAudioChannelType = 'alarm';
let silent = false;
let HUDvisible = false;
let adShowing = false;

// set max/minCharge values
maxCharge.value = localStorage.maxCharge || 80
minCharge.value = localStorage.minCharge || 30


// KaiAd
getKaiAd({
  publisher: 'fe2d9134-74be-48d8-83b9-96f6d803efef',
  app: 'batterymanager',
  onerror: err => console.error('error getting ad: ', err),
  onready: ad => {
    ad.on('click', () => adShowing = false)

    ad.on('close', () => adShowing = false)

    ad.on('display', () => adShowing = true)

    ad.call('display');
  }
});

// === KEYDOWN (sounds) ===
document.addEventListener('keydown', (e) => {
  if (e.key.includes('Arrow')) e.preventDefault();
  if (!alarm.paused) alarm.pause();

  if (navigator.volumeManager && (e.key === "1" || e.key === "3") && document.activeElement.nodeName !== "INPUT") {
    if (e.key === "1") {
      navigator.volumeManager.requestDown();
    } else {
      navigator.volumeManager.requestUp();
    }
    HUDvisible = true;
    setTimeout(() => HUDvisible = false, 2000);
  }

  if (HUDvisible || !["maxCharge", "minCharge"].includes(document.activeElement.id)) return;
  const input = document.activeElement;
  if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
    // input.stepDown(e.key === "ArrowLeft" ? 1 : -1);
    // localStorage[input.id] = input.value;
  }
});


// === FOCUS ===
const navElems = document.querySelectorAll('.nav');
const divs = document.querySelectorAll('.div');

for (let i = 0; i < navElems.length; i++) {
  navElems[i].addEventListener('focus', () => {
    divs[i].classList.add('focus');
    setTimeout(() => divs[i].classList.contains('focus') && divs[i].classList.add('showinfo'), 1500);
  });

  navElems[i].addEventListener('blur', () => {
    divs[i].classList.remove('focus', 'showinfo');
    clearTimeout(timeout);
  });

  let timeout;
  document.addEventListener('keydown', e => {
    if (e.key === "Enter") divs[i].classList.remove('showinfo');
  });
}

// === INPUTS ===
let inputs = document.querySelectorAll('input');

for (let i = 0; i < inputs.length; i++) {
  const elem = inputs[i];

  // Event listener for keydown event
  elem.addEventListener('keydown', (event) => {
    handleKey(event, elem);
  });

  // Event listener for ArrowLeft and ArrowRight
  elem.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      changeValue(elem, -1); // Decrease value by 1
      event.preventDefault();
    } else if (event.key === 'ArrowRight') {
      changeValue(elem, 1); // Increase value by 1
      event.preventDefault();
    }
  });

  function handleKey(event, elem) {
    const key = event.key;

    // Ensure the key pressed is a number between 0 and 9
    if (!isNaN(key) && key >= '0' && key <= '9') {
      let value = parseInt(elem.value) || 0;

      if (value < 10) {
        // If the value is less than 10, append the new key
        elem.value = value.toString() + key; // Concatenate the new digit
      } else {
        // If value is 10 and key is 0, set value to 100
        if (value === 10 && key === '0') {
          elem.value = '100'; // Set to 100 if pressing 0 while value is 10
        } else {
          // Replace the entire value with the new key
          elem.value = key;
        }
      }

      // Ensure the new value is within bounds of min/max
      validate(elem);
      event.preventDefault(); // Prevent default behavior of number key input
    }
  }

  function changeValue(elem, change) {
    let value = parseInt(elem.value) || 0;
    let newValue = value + change;

    // Ensure the new value is within bounds of min/max
    if (newValue < elem.min) {
      newValue = elem.min;
    } else if (newValue > elem.max) {
      newValue = elem.max;
    }

    // Update the input value
    elem.value = newValue;
  }

  function validate(elem) {
    let v = parseInt(elem.value);

    // Check for NaN and enforce min/max limits
    if (isNaN(v) || v < elem.min) {
      elem.value = elem.min;
    } else if (v > elem.max) {
      elem.value = elem.max;
    }
  }
}
function nav(move) {
  const currentIndex = document.activeElement;
  const items = document.querySelectorAll('.nav');
  const currentElemIdx = [...items].indexOf(currentIndex);
  const next = currentElemIdx + move;
  const targetElement = items[next];
  if (move === -1 && !currentIndex.classList.contains('nav')) return items[items.length - 1].focus();
  targetElement ? targetElement.focus() : currentIndex.blur();
}

// === KEYDOWN (tutti) ===
let toggleSecretBackground = 0;
document.addEventListener('keydown', e => {
  if (HUDvisible) return
  if (["ArrowUp", "ArrowDown"].includes(e.key)) nav(e.key === "ArrowUp" ? -1 : 1);
  if (e.key === "#") window.open('/about.html');
  if (e.key === "*") {
    let rtl = languageCode === "ar" || languageCode === "ur" || languageCode === "he"
    silent = !silent;
    const text = `${translate('silent_alarm')} ${translate(silent ? 'enabled' : 'disabled')}`;
    keystrokes.src = `/assets/image/keystrokes${rtl ? '_ar' : ''}_${silent}_${localStorage.mode}.png`;
    toastMessage(text)
  }
  if (e.key == "0" && !["maxCharge", "minCharge"].includes(document.activeElement.id)) toggleMode();
  let b;
  if (e.key == "0") {
    clearTimeout(b)
    toggleSecretBackground++
    if (toggleSecretBackground >= 5) document.body.classList.add('secretBackground'), toggleSecretBackground = 0;
    b = setTimeout(() => { toggleSecretBackground = 0 }, 540)
  }
});

// === TOAST ===
function toastMessage(text) {
  if (!navigator.mozApps) return false, console.log(`%c${text}`, "background: #444; color: white;");
  navigator.mozApps.getSelf().onsuccess = (e) => {
    const app = e.target.result;
    app.connect('systoaster').then(conns => conns.forEach(conn => conn.postMessage({ message: text })));
  }
}

// === NOTIFICATION ===
const pushLocalNotification = function (title, text, tag, icon) {
  window.Notification.requestPermission().then(result => {
    const options = {
      body: text,
      icon: icon || "/assets/image/icons/icon_112.png",
      tag,
      mozbehavior: { vibrationPattern: [30, 200, 30] }
    };

    const notification = new window.Notification(title, options);
    notification.onerror = e => console.warn(e);
    notification.onclick = () => {
      if (window.navigator.mozApps) {
        const request = window.navigator.mozApps.getSelf();
        request.onsuccess = () => request.result && (notification.close(), request.result.launch());
      } else window.open(document.location.origin, "_blank");
    };
    document.addEventListener('visibilitychange', () => document.visibilityState === "visible" && notification.close());
  });
};

// === KaiAd visibilitychange ===
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === "visible") {
    if (!adShowing) {
      getKaiAd({
        publisher: 'fe2d9134-74be-48d8-83b9-96f6d803efef',
        app: 'batterymanager',
        onerror: err => console.error('error getting ad: ', err),
        onready: ad => {
          ad.on('click', () => adShowing = false)

          ad.on('close', () => adShowing = false)

          ad.on('display', () => adShowing = true)

          ad.call('display');
        }
      });
    }
    alarm.pause();
  }
});

// === dark/light mode ===
function setMode() {
  document.body.classList.remove('secretBackground')
  let rtl = languageCode === "ar" || languageCode === "ur" || languageCode === "he"
  if (!localStorage.mode) localStorage.mode = "dark"
  // document.body.classList.toggle('light', localStorage.mode === "light");
  localStorage.mode === "light" ? document.body.classList.add('light') : document.body.classList.remove('light');
  keystrokes.src = `/assets/image/keystrokes${rtl ? '_ar' : ''}_${silent}_${localStorage.mode}.png`;
  document.querySelector('meta[name="theme-color"]').setAttribute('content', localStorage.mode === "dark" ? 'rgb(45, 45, 45)' : 'rgb(235, 235, 235)');
  [...arrowRights].forEach(element => {
    element.src = `/assets/image/${rtl ? 'arrowLeft' : 'arrowRight'}_${document.body.classList.contains('light') ? "light" : "dark"}.png`;
  });
  [...arrowLefts].forEach(element => {
    element.src = `/assets/image/${rtl ? 'arrowRight' : 'arrowLeft'}_${document.body.classList.contains('light') ? "light" : "dark"}.png`;
  });
}

function toggleMode() {
  if (localStorage.mode) localStorage.mode = localStorage.mode === "light" ? "dark" : "light";
  else localStorage.mode = "light"
  setMode();
}