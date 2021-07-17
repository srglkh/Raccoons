{window.onload = () => {
  let wrapper = document.querySelector('.wrapper');
  let screen01hall = document.querySelector('.screen01hall');
  let screen01wall = document.querySelector('.screen01wall');
  let screen02 = document.querySelector('.screen02');
  let state = {
    width: 0,
    height: 0,
    position: 0
  };
  
  let rendering = () => {
    screen01hall.style.display = state.position<2.5 ? 'block' : 'none';
    screen01hall.style.transform = `scale(${state.position<2 ? state.position/2+1 : 2}) translateY(${state.position<1 ? state.position*25 : 25}%)`;
    screen01hall.style.opacity = state.position<1.5 ? 1 : state.position>2.5 ? 0 : 2.5-state.position;
  
    screen01wall.style.display = state.position<1 ? 'block' : 'none';
    screen01wall.style.transform = `translateY(${state.position<1 ? state.position*50 : 50}%)`;
    screen01wall.style.opacity = state.position<1 ? 1-state.position : 0;
  
    screen02.style.display = state.position<1.5 ? 'none' : 'block';
    screen02.style.opacity = state.position<1.5 ? 0 : state.position>3.5 ? 1 : (state.position-1.5)/2;
  };
  
  window.onresize = () => {
    state.width = document.documentElement.clientWidth;
    state.height = document.documentElement.clientHeight;
  
    if (state.height/state.width < .5625) {
      wrapper.style.width = state.height/.5625 + 'px';
      wrapper.style.height = state.height + 'px';
    } else {
      wrapper.style.width = state.width + 'px';
      wrapper.style.height = state.width*.5625 + 'px';
    }
  
    document.body.style.height = 6*state.height + 'px';
    document.documentElement.scrollTop = state.position * state.height;
  
    rendering();
  };

  window.onscroll = () => {
    state.position = document.documentElement.scrollTop / state.height;
    rendering();
  };

  window.onresize(true);
};}