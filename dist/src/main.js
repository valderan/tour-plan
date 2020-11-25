"use strict";

var mySwiper = new Swiper('.swiper-container', {
  // Зацикленность
  loop: true,
  // Навигация лево - право
  navigation: {
    nextEl: '.slider-button--next',
    prevEl: '.slider-button--prev'
  },
  // Управление клавиатурой
  keyboard: {
    enable: true,
    onlyInViewport: true,
    pageUpDown: true
  }
});
$('.newsletter').parallax({
  imageSrc: 'img/newsletter-bg.jpeg'
});
ymaps.ready(init);

function init() {
  // Создание карты.
  var myMap = new ymaps.Map("map", {
    center: [7.83820496, 98.29882894],
    // Уровень масштабирования. Допустимые значения:
    // от 0 (весь мир) до 19.
    zoom: 17
  });
}