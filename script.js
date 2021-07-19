{window.onload = () => {
  let hall = document.querySelector('.screen-1-hall');
  let wall = document.querySelector('.screen-1-wall');
  let height = 0;
  let position = 0;

  let rendering = () => {
    hall.style.transform = `scale(${position<.75 ? position/.75+1 : 2}) translateY(${position<.75 ? position*32 : 24}%)`;
    wall.style.transform = `translateY(${position<.5 ? position*80 : 40}%)`;
    wall.style.opacity = position<.5 ? 1-position*2 : 0;
  };

  window.onresize = () => {
    height = document.documentElement.clientHeight;
    document.documentElement.scrollTop = position * height;
    rendering();
  };

  window.onscroll = () => {
    position = document.documentElement.scrollTop / height;
    rendering();
  };

  window.onresize();
};}