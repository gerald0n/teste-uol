axios.defaults.headers.common['Authorization'] = 'uJX299kMVSRkCCZKpm2zjOlQ'
const URL_MESSAGES = 'https://mock-api.driven.com.br/api/vm/uol/messages'
const URL_LOGIN = 'https://mock-api.driven.com.br/api/vm/uol/participants'
const URL_STATUS = 'https://mock-api.driven.com.br/api/vm/uol/status'

const inputLogin = document.querySelector('#login')
const btnLogin = document.querySelector('#btnLogin')
const loginRender = document.querySelector('.login-render')
const chatRender = document.querySelector('.chat-render')
const containerMain = document.querySelector('.container-messages')
let arrMessages = []
const user = {
    from: '',
    to: 'Todos',
    text: '',
    type: 'message'
}

if (inputLogin)
    inputLogin.addEventListener('focus', () => {
        onkeyup = () => {
            if (inputLogin.value.length > 0) btnLogin.disabled = false
            else {
                document.querySelector('.error-login').classList.add('disabled')
                btnLogin.disabled = true
            }

            if (event.key === 'Enter') loginRoom()
        }
    })

if (btnLogin) btnLogin.addEventListener('click', loginRoom)

// ENTRAR NA SALA
function loginRoom() {
    user.from = inputLogin.value
    axios
        .post(URL_LOGIN, { name: user.from })
        .then(response => {
            console.log(response.data)
            // inputLogin.value = ''
            chatRender.classList.remove('off')
            getMessages()
            setInterval(getMessages, 3000, URL_MESSAGES)
            setInterval(authentication, 3000, URL_STATUS, user)
            loginRender.classList.add('off')

            // document.querySelector('.loading').classList.remove('disabled')
        })
        .catch(error => {
            console.log(error)
            // document.querySelector('.error-login').classList.remove('disabled')
        })
}

// BUSCAR MENSAGENS
function getMessages() {
    axios
        .get(URL_MESSAGES)
        .then(response => {
            arrMessages = response.data
            showMessages()
        })
        .catch(error => console.log(error))
}

function showMessages() {
    containerMain.innerHTML = ''
    arrMessages.forEach(message => {
        if (message.type === 'status')
            containerMain.innerHTML += `<li data-test="message" class = "bg-grey">(${message.time}) ${message.from} para ${message.to} ${message.text}</li>`
        else if (message.type === 'private_message')
            containerMain.innerHTML += `<li data-test="message" class = "bg-pink">(${message.time}) ${message.from} para ${message.to} ${message.text}</li>`
        else
            containerMain.innerHTML += `<li data-test="message">(${message.time}) ${message.from} para ${message.to} ${message.text}</li>`
    })

    document.querySelector('#scrollar').scrollIntoView()
}

// ENVIAR MENSAGEM AO SERVIDOR
function setMessage() {
    user.text = inputMessage.value
    axios
        .post(URL_MESSAGES, user)
        .then(response => console.log(user))
        .catch(error => {
            console.log('MENSAGEM VAZIA.')
        })
}

// BUSCAR PARTICIPANTES
function getParticipants() {
    axios.get(URL_LOGIN).then(response => {
        console.log(response.data)
    })
}

// MANTER CONEXÃO
function authentication(url, user) {
    axios
        .post(url, { name: user.from })
        .then(response => console.log(response.data))
        .catch(error => {
            console.log(
                `Erro ${error.response.data}: usuário desconectado por inatividade!`
            )
        })
}
