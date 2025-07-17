window.addEventListener('DOMContentLoaded', () => {
  let header = document.getElementById('header-section');
  if (header) {
    let toggleHeader = () => {
      header.classList.toggle('header-hidden', window.pageYOffset < window.innerHeight);
    };

    window.addEventListener('scroll', toggleHeader);
    toggleHeader();
  }

  let raccoons = document.getElementById('animated-raccoons');
  if (raccoons) {
    const lastRaccoonFileNumber = 26;
    let nextRaccoon = 1;
    let isLookingLeft = false;

    let addRaccoon = () => {
      let raccoon = document.createElement('img');
      raccoon.setAttribute('src', `./img/animated-section/${nextRaccoon}.png`);
      raccoon.style.transform = isLookingLeft ? 'scaleX(-1)' : '';
      isLookingLeft = !isLookingLeft;
      raccoons.append(raccoon);
      nextRaccoon = nextRaccoon % lastRaccoonFileNumber + 1;
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
});
