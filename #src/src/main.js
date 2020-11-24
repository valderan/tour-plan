var mySwiper = new Swiper('.swiper-container', {
  // Зацикленность
  loop: true,

  // Навигация лево - право
  navigation: {
    nextEl: '.slider-button--next',
    prevEl: '.slider-button--prev',
  },

  // Управление клавиатурой
  keyboard: {
    enable: true,
    onlyInViewport: true,
    pageUpDown: true
  },

  // Управление колесом мыши
  mousewheel: {
    sensitivity: 1, 
    eventsTarget: ".slider"
  },

})