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

const rewiewSlider = new Swiper('.reviews-slider', {
  // Зацикленность
  loop: true,

  // Навигация лево - право
  navigation: {
    nextEl: '.reviews-slider__button--next',
    prevEl: '.reviews-slider__button--prev',
  },

  // Управление клавиатурой
  keyboard: {
    enable: true,
    onlyInViewport: true,
    pageUpDown: true
  },
  
})

ymaps.ready(init);
function init(){
    // Создание карты.
    var myMap = new ymaps.Map("map", {
        center: [7.83820496, 98.29882894],
        // Уровень масштабирования. Допустимые значения:
        // от 0 (весь мир) до 19.
        zoom: 17
    });
}

// Parallax-effect for newsletter block
$('.newsletter').parallax({imageSrc: 'img/newsletter-bg.jpeg'});
