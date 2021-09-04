window.addEventListener('DOMContentLoaded', () => {
  let ritualRaccoons = document.getElementById('ritual-page-raccoons');
  let selectedRaccoons = [];
  const raccoonsQuantity = 7;

  if (raccoonsQuantity) {
    ritualRaccoons.style.display = 'flex';
  }
  for (let i = 0; i < raccoonsQuantity; i++) {
    const raccoonImgSrc = '/img/ritual-page-raccoon.jpg';
    const raccoonName = '#5';
    let raccoon = document.createElement('div');
    raccoon.className = 'ritual-page-raccoon'
    raccoon.innerHTML = `
      <img src="${raccoonImgSrc}" alt="">
      <div class="ritual-page-raccoon-name">${raccoonName}</div>
    `;
    raccoon.onclick = () => {
      const toggleTo = !selectedRaccoons.includes(raccoon);
      raccoon.classList.toggle('ritual-page-selected-raccoon', toggleTo);
      if (toggleTo) {
        selectedRaccoons.push(raccoon);
      } else {
        selectedRaccoons = selectedRaccoons.filter(selectedRaccoon => selectedRaccoon != raccoon);
      }
    };
    ritualRaccoons.append(raccoon);
  }

  let connectBtn = document.getElementById('ritual-connect-btn');
  connectBtn.onclick = () => {
    console.log('connect Btn click');
  };
  let ritualBtn = document.getElementById('ritual-main-button');
  let ritualLabel = document.getElementById('ritual-main-button-label');
  ritualBtn.onclick = () => {
    console.log('ritual Btn click');
    ritualLabel.innerHTML = ritualLabel.innerHTML ? '' : 'Success';
  };
});
