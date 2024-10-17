const alarm = new Audio("/assets/alarm.mp3");
alarm.mozAudioChannelType = 'alarm';
let silent = false;
let HUDvisible = false;
let adShowing = false;

maxCharge.value = localStorage.maxCharge || 80
minCharge.value = localStorage.minCharge || 30

document.addEventListener('keydown', (e) => {
  if (e.key.includes('Arrow')) e.preventDefault();
  if (!alarm.paused) alarm.pause();

  if (navigator.volumeManager && e.key === "1" || e.key === "3" && document.activeElement.nodeName !== "INPUT") {
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
    input.stepDown(e.key === "ArrowLeft" ? 1 : -1);
    localStorage[input.id] = input.value;
  }
});

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

function nav(move) {
  const currentIndex = document.activeElement;
  const items = document.querySelectorAll('.nav');
  const currentElemIdx = [...items].indexOf(currentIndex);
  const next = currentElemIdx + move;
  const targetElement = items[next];
  if (move === -1 && !currentIndex.classList.contains('nav')) return items[items.length - 1].focus();
  targetElement ? targetElement.focus() : currentIndex.blur();
}
let toggleSecretBackground = 0;
document.addEventListener('keydown', e => {
  if (HUDvisible) return
  if (["ArrowUp", "ArrowDown"].includes(e.key)) nav(e.key === "ArrowUp" ? -1 : 1);
  if (e.key === "#") window.open('/about.html');
  if (e.key === "*") {
    silent = !silent;
    const text = `${translate('silent_alarm')} ${translate(silent ? 'enabled' : 'disabled')}`;
    keystrokes.src = `/assets/image/keystrokes${languageCode === "ar" ? '_ar' : ''}_${silent}_${localStorage.mode}.png`;
    toastMessage(text)
  }
  if (e.key == "0" && !["maxCharge", "minCharge"].includes(document.activeElement.id)) toggleMode();
  let b;
  if (e.key == "0") {
    clearTimeout(b)
    toggleSecretBackground++
    if (toggleSecretBackground >= 3) document.body.classList.add('secretBackground'), toggleSecretBackground = 0;
    b = setTimeout(() => { toggleSecretBackground = 0 }, 340)
  }
});

function toastMessage(text) {
  if (!navigator.mozApps) return false, console.log(`%c${text}`, "background: #444; color: white;");
  navigator.mozApps.getSelf().onsuccess = (e) => {
    const app = e.target.result;
    app.connect('systoaster').then(conns => conns.forEach(conn => conn.postMessage({ message: text })));
  }
}

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

function setMode() {
  document.body.classList.remove('secretBackground')
  let rtl = document.body.classList.contains('rtl')
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