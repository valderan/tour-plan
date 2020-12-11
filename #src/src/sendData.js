import sendForm from '@src/models/sendForm'

const nameValidation = (name) => {
  return /^.+\s.+\s?.*$/i.test(name)
}

const validateEmail = (email) =>  {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!re.test(String(email).toLowerCase())) console.error('Некорректный EMAIL!'); 
  return re.test(String(email).toLowerCase());
}

const contactValidation = (body) => {
  if (!nameValidation(body.name)) console.error('Некорректное заполнение поля:"NAME"');
  return nameValidation(body.name) ? true : false 
} 

const contactForm = {
  formName: 'footer__contact-form',
  url: 'https://agrosumka.ru/sendMail/contact',
  token: '1a520b11-e67c-4f79-b3b3-8e1a91102cd2',
  dataValidation : contactValidation
}

const newsletterValid = (email) => {
  const result = validateEmail(email)
  const error = document.querySelector('.error');
  if (!result) 
    error.classList.add('error--visible')
  else
    error.classList.remove('error--visible')
  return result
}

const newsletterForm = {
  formName: 'newsletter__subscribe',
  url: 'https://agrosumka.ru/sendMail/newsletter',
  token: '1a520b11-e67c-4f79-b3b3-8e1a91102cd2',
  dataValidation : (body) => newsletterValid(body.email)
}

sendForm(contactForm)
sendForm(newsletterForm)