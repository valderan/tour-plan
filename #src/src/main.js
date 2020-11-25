const mySwiper = new Swiper('.swiper-container', {
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
  
})

$('.newsletter').parallax({imageSrc: 'img/newsletter-bg.jpeg'});
