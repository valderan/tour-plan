const hotelSlider = new Swiper('.hotel-slider', {
  // Зацикленность
  loop: true,

  // Навигация лево - право
  navigation: {
    nextEl: '.hotel-slider__button--next',
    prevEl: '.hotel-slider__button--prev',
  },

  // Управление клавиатурой
  keyboard: {
    enable: true,
    onlyInViewport: true,
    pageUpDown: true
  },
  
})