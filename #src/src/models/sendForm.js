import GetURL from './GetUrl'

const sendForm = ({ formName, url, token, dataValidation, isOK}) => {
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
        isOK()
      })
      .catch((err) => {
          btnSend.innerText = btnText;
          console.error(err);
      })
    }
  })
}

export default sendForm;