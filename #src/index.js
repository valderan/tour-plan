// Подключим normalize.css
import 'normalize.css'
// Подключим основные стили
import './sass/style.sass'

import AOS from 'aos'
import 'aos/dist/aos.css'

// Импорт библиотеки parallax 
import '@public/parallax.min'

AOS.init({
  disable: false,
  startEvent: 'DOMContentLoaded',
  duration: 600,
})

// Загрузка основоных файлов скриптов
import '@src/modal'
import '@src/validation'
import '@src/main'
import '@src/sendData'
