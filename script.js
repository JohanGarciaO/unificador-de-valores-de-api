let currentPageUrl = ''
let token = ''
let uniqueList = []
let timeRequest = 0
let erroAPI = false

function searchArray(object) {
    if (Array.isArray(object)) {
        return object
    } else {
        const keys = Object.keys(object)
        for (let i = 0; i < keys.length; i++) {
            if (Array.isArray(object[keys[i]])) {
                return object[keys[i]]
            } else if (typeof (object[keys[i]]) == 'object' && object[keys[i]] != null && object[keys[i]] != undefined) {
                return searchArray(object[keys[i]])
            }
        }
    }
}

async function catchUniqueData(url, token) {

    if (!url) return ''

    try {
        const response = await fetch(url)
        const data = await response.json()
        let arrayList = []

        arrayList = searchArray(data)

        let uniqueValues = arrayList.map((planeta) => {
            return planeta[token]
        })

        uniqueValues = valuesUniques(uniqueValues)

        uniqueValues = uniqueValues.concat(await catchUniqueData(data.next, token))
        uniqueList = await uniqueValues
        callReunificar()
        erroAPI = false
        return uniqueList
    } catch (error) {
        console.log('erro na api', error)
        uniqueList = ['Não foi possível bater seu endpoint, verifique se você digitou corretamente e tente novamente.', '']
        disabledReunificar()
        erroAPI = true
    }
}

function valuesUniques(arr) {
    arr = arr.filter((value, index) => {
        return arr.indexOf(value) === index
    })
    return arr.sort()
}

function clearResult() {
    const container = document.querySelector(".container-result")
    container.style.justifyContent = 'flex-start'

    const content = document.getElementById('content')
    content.style.alignItems = 'flex-start'
    content.style.transform = 'scale(1)'
    content.innerHTML = ''
}

function writeValues(arr) {
    clearResult()

    arr.forEach((value) => {
        const content = document.getElementById('content')
        const span = document.createElement("span")
        span.className = 'itemList'
        span.innerText = value

        const div = document.createElement("div")
        div.className = 'div'

        content.appendChild(span)
        content.appendChild(div)
    })
    btn.disabled = false
}

function qtdResult() {
    let res = 0

    if (uniqueList[0] == undefined) {
        res = 0
    } else {
        res = uniqueList.length
    }

    const content = document.getElementById('content')
    const span = document.createElement("span")
    span.className = 'itemList resultsTotal'
    span.innerText = `${res} resultados (${timeRequest} segundos)`

    const div = document.createElement("div")
    div.className = 'div'
    content.insertBefore(div, content.firstChild)
    content.insertBefore(span, content.firstChild)
}

function loading() {
    clearResult()
    const container = document.querySelector(".container-result")
    container.style.justifyContent = 'center'

    const content = document.getElementById('content')
    content.style.alignItems = 'center'
    content.style.transform = 'scale(1.8)'

    const loadElement = document.createElement("div")
    loadElement.className = "loading"

    content.appendChild(loadElement)
}

async function catchArrayUnique() {
    loading()

    timeRequest = performance.now()
    await catchUniqueData(currentPageUrl, token)
    timeRequest = (((performance.now() - timeRequest) / 1000).toFixed(2)).replace('.', ',')

    uniqueList.pop()
    uniqueList = valuesUniques(uniqueList)

    if (!uniqueList[0]) {
        writeValues(['Atributo inexistente no endpoint'])
        disabledReunificar()
        qtdResult()
    } else if (erroAPI) {
        writeValues(uniqueList)
    } else {
        writeValues(uniqueList)
        qtdResult()
    }
}

const btn = document.getElementById('btn')
const keyword = document.getElementById('token')

function btnUnificar() {
    const api = document.getElementById('api')
    if (api.value && keyword.value) {
        currentPageUrl = api.value
        token = keyword.value
        catchArrayUnique()
        btn.disabled = true
    } else {
        uniqueList = ['Você não pode deixar nenhum campo em branco.']
        writeValues(uniqueList)
        disabledReunificar()
    }
}

btn.addEventListener('click', () => {
    btnUnificar()
})
keyword.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && btn.disabled == false) {
        btnUnificar()
    }
})

const btnReunificar = document.getElementById('btn-reunificar')

function callReunificar() {
    btnReunificar.className = 'btn btn-reunificar'
}

function disabledReunificar() {
    btnReunificar.className = 'btn btn-reunificar none'
}

function reunificar(arr) {
    arr = arr.join(',')
    arr = arr.replace(/,\s|\s,/g, ",")
    arr = arr.split(',')
    arr = valuesUniques(arr)

    uniqueList = arr
    return uniqueList
}

btnReunificar.addEventListener('click', () => {
    if (uniqueList[0]) {
        reunificar(uniqueList)
        writeValues(uniqueList)
        qtdResult()
    }
})

// correção do bug do Scoll

const containerResult = document.getElementById('container-result')

containerResult.addEventListener(('mouseover'), () => {
    const content = document.getElementById('content')
    const body = document.getElementsByTagName('body')[0]
    if (content.clientHeight >= 417 && body.clientWidth > 580) content.style.width = 'calc(100% + 16px)'
})

containerResult.addEventListener(('mouseout'), () => {
    const content = document.getElementById('content')
    const body = document.getElementsByTagName('body')[0]
    if (content.clientHeight >= 417 && body.clientWidth > 580) content.style.width = '100%'
})
