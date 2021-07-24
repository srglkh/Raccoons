window.onload = () => {
  /////////////////// temporary code
  let backgroundNumber = 0;
  document.body.ondblclick = () => {
    backgroundNumber = ++backgroundNumber % 3;
    document.body.className = ['body-purple', 'body-darkblue', 'body-black'][backgroundNumber];
  }
  //////////////////////////////////

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

  for (let i = 0; i < 19; i++) {
    addRaccoon();
  }

  setTimeout(toggleRaccoons, 20);
  setInterval(toggleRaccoons, 1500);
}