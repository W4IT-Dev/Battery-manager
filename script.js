let alarm = new Audio("/assets/alarm.mp3");
localStorage.maxCharge ? maxCharge.value = localStorage.maxCharge : localStorage.maxCharge = maxCharge.value
localStorage.minCharge ? minCharge.value = localStorage.minCharge : localStorage.minCharge = minCharge.value
document.addEventListener('keydown', (e) => {
  if (e.key.includes('Arrow')) e.preventDefault();
  if (document.activeElement.id == "max-charge" && e.key == "ArrowLeft") document.activeElement.stepDown(), localStorage.maxCharge = maxCharge.value;
  if (document.activeElement.id == "max-charge" && e.key == "ArrowRight") document.activeElement.stepUp(), localStorage.maxCharge = maxCharge.value;
  if (document.activeElement.id == "min-charge" && e.key == "ArrowLeft") document.activeElement.stepDown(), localStorage.minCharge = minCharge.value;
  if (document.activeElement.id == "min-charge" && e.key == "ArrowRight") document.activeElement.stepUp(), localStorage.minCharge = minCharge.value;
  if (!alarm.paused) alarm.pause()
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

let navElems = document.querySelectorAll('.nav');
let divs = document.querySelectorAll('.div');
let timeout;

for (let i = 0; i < navElems.length; i++) {
  navElems[i].addEventListener('focus', () => {
    divs[i].classList.add('focus');
    timeout = setTimeout(() => {
      if (divs[i].classList.contains('focus')) divs[i].classList.add('showinfo')
    }, 1500)
  });

  navElems[i].addEventListener('blur', () => {
    divs[i].classList.remove('focus')
    divs[i].classList.remove('showinfo')
    clearTimeout(timeout)
  });

  document.addEventListener('keydown', e => {
    if (e.key == "Enter") divs[i].classList.remove('showinfo')
  });
}

function nav(move) {
  let currentIndex = document.activeElement;
  const items = document.querySelectorAll('.nav')
  let currentElemIdx = [...items].indexOf(currentIndex);
  const next = currentElemIdx + move;
  const targetElement = items[next];
  if (move < 0 && !document.activeElement.classList.contains('nav')) return items[items.length - 1].focus();
  if (targetElement) targetElement.focus();
  else document.activeElement.blur();
}

document.addEventListener('keydown', e => {
  if (e.key.includes('Arrow')) e.preventDefault();
  if (e.key == "ArrowUp") nav(-1)
  if (e.key == "ArrowDown") nav(1);
  if (e.key == "#") window.open('/about.html')
})


let pushLocalNotification = function (title, text, icon) {
  window.Notification.requestPermission().then((result) => {
    const options = {
      body: text,
      icon: icon,
      mozbehavior: {
        vibrationPattern: [30, 200, 30],
      },
    };

    var notification = new window.Notification(title, options);

    notification.onerror = function (err) {
      console.log(err);
    };
    notification.onclick = function (event) {
      if (window.navigator.mozApps) {
        var request = window.navigator.mozApps.getSelf();
        request.onsuccess = function () {
          if (request.result) {
            notification.close();
            request.result.launch();
          }
        };
      } else {
        window.open(document.location.origin, "_blank");
      }
    };
    notification.onshow = function () {
    };
  });
};
