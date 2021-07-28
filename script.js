window.onload = () => {
  let raccoons = document.getElementById('animated-raccoons');
  if (raccoons) {
    const lastRaccoonFileNumber = 9;
    let isLookingLeft = false;

    let addRaccoon = () => {
      const linkNumber = Math.floor(Math.random() * lastRaccoonFileNumber) + 1;
      let raccoon = document.createElement('img');
      raccoon.setAttribute('src', `/img/animated-section/${linkNumber}.png`);
      raccoon.style.transform = isLookingLeft ? 'scaleX(-1)' : '';
      isLookingLeft = !isLookingLeft;
      raccoons.append(raccoon);
    }

    let toggleRaccoons = () => {
      raccoons.firstChild.remove();
      addRaccoon();
    }

    for (let i = 0; i < 12; i++) {
      addRaccoon();
    }

    setTimeout(toggleRaccoons, 20);
    setInterval(toggleRaccoons, 3000);
  }


  let initiateInput = document.getElementById('initiate-input');
  if (initiateInput) {
    let checkValueRange = () => {
      if (initiateInput.value < 1) {
        initiateInput.value = 1;
      }
      if (initiateInput.value > 10) {
        initiateInput.value = 10;
      }
    };

    document.getElementById('initiate-minus').onclick = () => {
      initiateInput.value--;
      checkValueRange();
    };
    document.getElementById('initiate-plus').onclick = () => {
      initiateInput.value++;
      checkValueRange();
    };
    initiateInput.oninput = () => {
      if (initiateInput.value == '' + +initiateInput.value) {
        checkValueRange();
      } else {
        initiateInput.value = 1;
      }
    };

    document.getElementById('initiate-confirm').onclick = () => {
        console.log("Press");
    };
  }
}
