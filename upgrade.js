window.addEventListener('DOMContentLoaded', () => {
  let upgradeRaccoonsSacrifice = document.getElementById('upgrade-page-raccoons-sacrifice');
  let upgradeRaccoonsUpgrade = document.getElementById('upgrade-page-raccoons-upgrade');
  let selectedRaccoonsSacrifice = [];
  let selectedRaccoonsUpgrade = [];
  const raccoonsSacrificeQuantity = 10;
  const raccoonsUpgradeQuantity = 1;

  [
    [upgradeRaccoonsSacrifice, selectedRaccoonsSacrifice, raccoonsSacrificeQuantity],
    [upgradeRaccoonsUpgrade, selectedRaccoonsUpgrade, raccoonsUpgradeQuantity]
  ].forEach(([raccons, selected, quantity]) => {
    if (quantity) {
      raccons.style.display = 'flex';
    }
    for (let i = 0; i < quantity; i++) {
      const raccoonImgSrc = '/img/ritual-page-raccoon.jpg';
      const raccoonName = '#5';
      let raccoon = document.createElement('div');
      raccoon.className = 'upgrade-page-raccoon'
      raccoon.innerHTML = `
        <img src="${raccoonImgSrc}" alt="">
        <div class="upgrade-page-raccoon-name">${raccoonName}</div>
      `;
      raccoon.onclick = () => {
        const toggleTo = !selected.includes(raccoon);
        raccoon.classList.toggle('upgrade-page-selected-raccoon', toggleTo);
        if (toggleTo) {
          selected.push(raccoon);
        } else {
          selected = selected.filter(selectedRaccoon => selectedRaccoon != raccoon);
        }
      };
      raccons.append(raccoon);
    }
  });

  let sacrificeBtn = document.getElementById('upgrade-sacrifice-btn');
  sacrificeBtn.onclick = () => {
    console.log('sacrifice Btn click');
  };
  let updateBtn = document.getElementById('upgrade-update-btn');
  let sacrificedQuantityLabel = document.getElementById('upgrade-page-sacrificed-quantity');
  updateBtn.onclick = () => {
    console.log('update Btn click');
    sacrificedQuantityLabel.innerHTML++;
  };
  let connectBtn = document.getElementById('upgrade-connect-btn');
  connectBtn.onclick = () => {
    console.log('connect Btn click');
  };
  let upgradeBtn = document.getElementById('upgrade-main-btn');
  upgradeBtn.onclick = () => {
    console.log('upgrade Btn click');
  };
});
