const alarm = new Audio("/assets/alarm.mp3");
alarm.mozAudioChannelType = 'alarm';
let silent = false;
let HUDvisible = false;
localStorage.maxCharge = localStorage.maxCharge || maxCharge.value;
localStorage.minCharge = localStorage.minCharge || minCharge.value;

document.addEventListener('keydown', (e) => {
  if (e.key.includes('Arrow')) e.preventDefault();
  if (!alarm.paused) alarm.pause();

  if (navigator.volumeManager && e.key === "1" || e.key === "3") {
    if (e.key === "1") {
      navigator.volumeManager.requestDown();
    } else {
      navigator.volumeManager.requestUp();
    }
    HUDvisible = true;
    setTimeout(() => HUDvisible = false, 2000);
  }

  if (HUDvisible || !["max-charge", "min-charge"].includes(document.activeElement.id)) return;
  const { value } = document.activeElement;
  if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
    document.activeElement.stepDown(e.key === "ArrowLeft" ? 1 : -1);
    localStorage[document.activeElement.id] = value;
  }
});

getKaiAd({
  publisher: 'fe2d9134-74be-48d8-83b9-96f6d803efef',
  app: 'batterymanager',
  onerror: err => console.error('error getting ad: ', err),
  onready: ad => ad.call('display')
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

document.addEventListener('keydown', e => {
  if(HUDvisible) return
  if (["ArrowUp", "ArrowDown"].includes(e.key)) nav(e.key === "ArrowUp" ? -1 : 1);
  if (e.key === "#" || e.key === "*") window.open(e.key === "#" ? '/about.html' : document.location.origin);
  if (e.key === "*") {
    silent = !silent;
    const text = `${translate('silent_alarm')} ${translate(silent ? 'enabled' : 'disabled')}`;
    if (!navigator.mozApps) return false;
    navigator.mozApps.getSelf().onsuccess = (e) => {
      const app = e.target.result;
      app.connect('systoaster').then(conns => conns.forEach(conn => conn.postMessage({ message: text })));
    }
  }
});

const pushLocalNotification = function (title, text, icon) {
  window.Notification.requestPermission().then(result => {
    const options = {
      body: text,
      icon,
      tag: "charge",
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
    getKaiAd({
      publisher: 'fe2d9134-74be-48d8-83b9-96f6d803efef',
      app: 'batterymanager',
      onerror: err => console.error('error getting ad: ', err),
      onready: ad => ad.call('display')
    });
    alarm.pause();
  }
});
