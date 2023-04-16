axios.defaults.headers.common['Authorization'] = 'uJX299kMVSRkCCZKpm2zjOlQ'
const URL_MESSAGES = 'https://mock-api.driven.com.br/api/vm/uol/messages'
const URL_LOGIN = 'https://mock-api.driven.com.br/api/vm/uol/participants'
const URL_STATUS = 'https://mock-api.driven.com.br/api/vm/uol/status'

const inputLogin = document.querySelector('#login')
const btnLogin = document.querySelector('#btnLogin')
const loginRender = document.querySelector('.login-render')
const chatRender = document.querySelector('.chat-render')
const containerMain = document.querySelector('.container-messages')
const containerParticipants = document.querySelector('.loggedUsers ul')
const selectVisibility = document.querySelectorAll('.visibility ul li')
const btnSend = document.querySelector('#btnSendMessage')
const inputMessage = document.querySelector('#inputMessage')
document.querySelector('#scrollar').scrollIntoView()
let arrMessages = []
let arrParticipants = []
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

if (inputMessage)
    inputMessage.addEventListener('focus', () => {
        onkeyup = event => {
            if (event.key === 'Enter') setMessage()
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
            if (response.status === 200) {
                chatRender.classList.remove('off')
                if (btnSend) btnSend.addEventListener('click', setMessage)
                listParticipants()
                getMessages()
                setInterval(getMessages, 3000, URL_MESSAGES)
                setInterval(authentication, 3000, URL_STATUS, user)
                loginRender.classList.add('off')
            } else return
            // inputLogin.value = ''
            // document.querySelector('.loading').classList.remove('disabled')
        })
        .catch(error => {
            alert(`Erro ${error.code}: username já utilizado. Tente novamente.`)
            document.querySelector('.error-login').classList.remove('disabled')
            inputLogin.value = ''
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
    listParticipants()
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
        arrParticipants = response.data
        arrParticipants.unshift({ name: 'Todos' })
    })
}

// MANTER CONEXÃO
function authentication(url, user) {
    axios
        .post(url, { name: user.from })
        .then(response => console.log(response.data))
        .catch(error => {
            console(
                `Erro ${error.response.data}: usuário desconectado por inatividade!`
            )
        })
}

// ---------------------------

function listParticipants() {
    getParticipants()
    containerParticipants.innerHTML = ''
    arrParticipants.forEach(participant => {
        if (participant.name !== user.from) {
            if (participant.name === 'Todos')
                containerParticipants.innerHTML += `
          <li data-test="all" class="user">
              <span><ion-icon name="people"></ion-icon>${participant.name}</span
              ><ion-icon data-test="check"
                  class="check checked"
                  name="checkmark-sharp"
              ></ion-icon>
          </li>`
            else
                containerParticipants.innerHTML += `
      <li data-test="participant" class="user">
          <span><ion-icon name="person-circle"></ion-icon
          >${participant.name}</span
          ><ion-icon data-test="check"
              class="check"
              name="checkmark-sharp"
          ></ion-icon>
      </li>`
        }
    })
    const selectUser = document.querySelectorAll('.user')
    if (selectUser) {
        selectUser.forEach(User => {
            if (User)
                User.addEventListener('click', () => {
                    let checked
                    for (const currentUser of selectUser) {
                        if (
                            currentUser.childNodes[2].classList.contains(
                                'checked'
                            )
                        )
                            checked = currentUser
                    }
                    if (User !== checked) {
                        checked.childNodes[2].classList.remove('checked')
                        User.childNodes[2].classList.add('checked')
                        user.to = User.childNodes[1].innerText
                        sendTo.innerText = `Enviando para ${user.to} (${
                            user.type === 'message'
                                ? 'público'
                                : 'reservadamente'
                        })`
                    }
                })
        })
    }
}

selectVisibility.forEach(type => {
    type.addEventListener('click', () => {
        let checked
        for (const currentType of selectVisibility) {
            if (currentType.childNodes[2].classList.contains('checked'))
                checked = currentType
        }
        if (type !== checked) {
            checked.childNodes[2].classList.remove('checked')
            type.childNodes[2].classList.add('checked')
            if (type.childNodes[1].innerText === 'Público') {
                sendTo.innerText = `Enviando para ${user.to} (público)`
                user.type = 'message'
            }
            if (type.childNodes[1].innerText === 'Reservadamente') {
                sendTo.innerText = `Enviando para ${user.to} (reservadamente)`
                user.type = 'private_message'
            }
        }
    })
})

const closeSidebar = document.querySelector('.return')
const sidebar = document.querySelector('.sidebar')
const openSidebar = document.querySelector('#header-icon')

closeSidebar.addEventListener('click', () => {
    sidebar.classList.add('disabled')
})

if (openSidebar)
    openSidebar.addEventListener('click', () => {
        sidebar.classList.remove('disabled')
    })
