import 'jquery-validation'
import 'jquery-mask-plugin'

const validSettings = {
  errorClass: "invalid",
  rules: {
    name: {
      required: true,
      minlength: 2
    },
    email: {
      required: true,
    }
  },
  messages:{
    name: {
      required: 'Please enter a Full Name',
      minlength: 'The name must be at least two letters'
    }, 
    email: {
      required: 'Please enter EMAIL', 
      email: 'Email must be in the format name@domain.com'
    },
    phone: {
      required: 'Please enter phone number'
    },
  }
}

$('.form').each(function (){
  $(this).validate(validSettings)
})

$('.phone').each(function (){
  $(this).mask('+0(000)000-00-00', {selectOnFocus: true})
})





