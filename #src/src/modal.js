import ShowModal from '@src/models/ShowModal.js'

window.addEventListener('DOMContentLoaded', e => {

  const otherOptionsModal = {
    openButton: document.querySelector('.booking__button'),
    closeButton: document.querySelector('.modal__close'),
    overlay: document.querySelector('.modal__overlay'),
    overlayClickCloseModal: true, 
    pressEscCloseModal:true,
    modal: document.querySelector('.modal__dialog'),
    activeClass:'modal--active'
  }

  const contactFormModal = new ShowModal(otherOptionsModal)
  contactFormModal.init() 

})