class GetURL {

  constructor (url = '', data = '', method = 'POST') {

      this.url = url;
      this.method = method;
      this.body = data;
      this.errorRequest = 'Не удалось получить данные от сервера!';

  };

  async request(url = this.url) {
    
      return fetch(url, {
              method: this.method,
              headers: {             
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: this.body        
          });
  }

}

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

const sendForm = ({ formName, url, token, dataValidation}) => {
  const form = document.getElementById(formName),
    btnSend = [...form.elements].filter(item => {
        return item.tagName.toLowerCase() === 'button' && item.type === 'submit';
    })[0], 
    btnText = btnSend.textContent;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const elementsForm = [...form.elements].filter(item => {
        return item.tagName.toLowerCase() !== 'button' && item.type !== 'button';
    });

    const formData = new FormData(form);
    formData.append('token',token)
    const fields = {}
    
    let body = new URLSearchParams();
    formData.forEach((val, key) => {
        body.append(key,val);
        fields[key]=val;
    })

    if (dataValidation(fields)) {
      btnSend.innerText = 'S...';
      
      const getUrl = new GetURL(url, body);
      getUrl.request()
      .then((response) => {
          
        if(response.status !== 200) {
              throw new Error(`Status network: ${response.status}`);
        };
          
        // очистим форму
        elementsForm.forEach(elem => {
          if (elem.type == 'text' || elem.type == 'tel' || elem.type == 'textarea') {
              elem.value = '';
          };
          btnSend.innerText = btnText;
        });
        return response.json()
      })
      .then((data) => {
        console.log(data.message);
      })
      .catch((err) => {
          btnSend.innerText = btnText;
          console.error(err);
      })
    }
  })
}

const contactFormDev = {
  formName: 'footer__contact-form',
  url: 'http://127.0.0.1:3000/sendMail/contact',
  token: '1a520b11-e67c-4f79-b3b3-8e1a91102cd2',
  dataValidation : contactValidation
}

const newsletterFormDev = {
  formName: 'newsletter__subscribe',
  url: 'http://127.0.0.1:3000/sendMail/newsletter',
  token: '1a520b11-e67c-4f79-b3b3-8e1a91102cd2',
  dataValidation : (body) => validateEmail(body.email)
}

const contactForm = {
  formName: 'footer__contact-form',
  url: 'https://dry-cliffs-93656.herokuapp.com/sendMail/contact',
  token: '1a520b11-e67c-4f79-b3b3-8e1a91102cd2',
  dataValidation : contactValidation
}

const newsletterForm = {
  formName: 'newsletter__subscribe',
  url: 'https://dry-cliffs-93656.herokuapp.com/sendMail/newsletter',
  token: '1a520b11-e67c-4f79-b3b3-8e1a91102cd2',
  dataValidation : (body) => validateEmail(body.email)
}

sendForm(contactForm)
sendForm(newsletterForm)