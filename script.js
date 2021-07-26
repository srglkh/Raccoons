window.onload = () => {
  let raccoons = document.getElementById('animated-raccoons');
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
