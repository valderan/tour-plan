import sendForm from '@src/models/sendForm'

const phoneValidation = (input) => {
  const re = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/
  return re.test(input)
}

const nameValidation = (name) => {
  return /^.+\s.+\s?.*$/i.test(name)
}

const validateEmail = (email) =>  {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!re.test(String(email).toLowerCase())) console.error('Некорректный EMAIL!'); 
  return re.test(String(email).toLowerCase());
}

const contactValidation = (body) => {
  if (!phoneValidation(body.phone)) console.error('Некорректный номер телефона!');
  if (!nameValidation(body.name)) console.error('Некорректное заполнение поля:"NAME"');
  return (phoneValidation(body.phone) && nameValidation(body.name)) ? true : false 
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