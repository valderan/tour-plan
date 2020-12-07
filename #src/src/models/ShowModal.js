export default class ShowModal {
  
  constructor (param) {
    this.data = param
  }

  static display ( param, show = true ) {    
    if (show) {
      param.overlay.classList.add(param.activeClass)
      param.modal.classList.add(param.activeClass)
    } else {
      param.overlay.classList.remove(param.activeClass)
      param.modal.classList.remove(param.activeClass)
    }
  }

  pressEsc = (e) => {
    const key = e.key; 
    if (key === "Escape") {
      this.hide()    
    }
  }

  show() {
    ShowModal.display(this.data)
    if (this.data.pressEscCloseModal) document.addEventListener('keydown', this.pressEsc)
  }

  hide() {
    ShowModal.display(this.data, false)
    if (this.data.pressEscCloseModal) document.removeEventListener('keydown', this.pressEsc)
  }

  init(modal = this.data) {
    
    modal.openButton.addEventListener('click', e => {
      e.preventDefault()
      this.show()
    })

    if (modal.overlayClickCloseModal) {
      modal.overlay.addEventListener('click', e => {
        e.preventDefault()
        this.hide()
      })  
    }
    
    modal.closeButton.addEventListener('click', e => {
      e.preventDefault()
      this.hide()
    }) 

  }

}