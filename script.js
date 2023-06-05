let currentPageUrl = 'https://swapi.dev/api/planets'
let token = 'climate'
let listUnique = []

async function catchUniqueData(url, token) {

    if (!url) return ''

    try {
        const response = await fetch(url)
        const data = await response.json()

        let planetas = data.results.map((planeta) => {
            return planeta[token]
        })

        planetas = valuesUniques(planetas)

        planetas = planetas.concat(await catchUniqueData(data.next, token))
        listUnique = await planetas
        callReunificar()
        return listUnique
    } catch (error) {
        console.log('erro na api', error)
        listUnique = ['Não foi possível bater seu endpoint, verifique se você digitou corretamente e tente novamente.', '']
        disabledReunificar()
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
    await catchUniqueData(currentPageUrl, token)
    listUnique.pop()
    listUnique = valuesUniques(listUnique)
    writeValues(listUnique)
}

const btn = document.getElementById('btn')
const api = document.getElementById('api')
const keyword = document.getElementById('token')

btn.addEventListener('click', () => {
    if (api.value && keyword.value) {
        currentPageUrl = api.value
        token = keyword.value
        catchArrayUnique()
    } else {
        writeValues(['Você não pode deixar nenhum campo em branco.'])
        disabledReunificar()
    }
})
keyword.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        if (api.value && keyword.value) {
            currentPageUrl = api.value
            token = keyword.value
            catchArrayUnique()
        } else {
            writeValues(['Você não pode deixar nenhum campo em branco.'])
            disabledReunificar()
        }
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

    listUnique = arr
    return listUnique
}

btnReunificar.addEventListener('click', () => {
    reunificar(listUnique)
    writeValues(listUnique)
})
