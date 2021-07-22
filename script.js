window.onload = () => {
  let scene1Style = document.getElementById('scene-1').style;
  let hallStyle = document.getElementById('scene-1-hall').style;
  let contentStyle = document.getElementById('scene-1-content').style;
  let wallStyle = document.getElementById('scene-1-wall').style;
  const docElem = document.documentElement;
  let viewportHeight = docElem.clientHeight;
  let position = 0;

  let rendering = () => {
    position = docElem.scrollTop / viewportHeight;

    scene1Style.backgroundPositionY = `${position<.7 ? position*100 : 70}%`
    hallStyle.transform = `scale(${ position<.7 ? position/.7+1 : 2 }) translateY(${ position<.7 ? position*35 : 24.5 }%)`;
    contentStyle.opacity = position<.69 ? 0 : 1;
    wallStyle.transform = `translateY(${ position<.5 ? position*125 : 62.5 }%)`;
    wallStyle.opacity = position<.5 ? 1-position*2 : 0;
    wallStyle.display = position<.51 ? 'block' : 'none';
  }

  window.onresize = () => {
    viewportHeight = docElem.clientHeight;
    docElem.scrollTop = position * viewportHeight;
  }

  window.onscroll = rendering;

  rendering();

  const arrow = document.getElementById('scene-1-arrow');
  arrow.onclick = () => { docElem.scrollTop = .7 * viewportHeight; }
  const about = document.getElementById('scene-1-btn-about');
  const aboutTo = document.getElementById(about.dataset.href);
  about.onclick = () => { aboutTo.scrollIntoView(); }


  let raccoons = document.getElementById('scene-2-raccoons');
  const lastRaccoonFileNumber = 9;
  let isLookingLeft = false;

  let addRaccoon = () => {
    const linkNumber = Math.floor(Math.random() * lastRaccoonFileNumber) + 1;
    const link = `img/Scene2/Coon${String(linkNumber).padStart(3, 0)}N.png`;
    let raccoon = document.createElement('img');
    raccoon.setAttribute('src', link);
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