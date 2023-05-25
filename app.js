const paymentLogo = {
    'MasterCard': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Mastercard_2019_logo.svg/200px-Mastercard_2019_logo.svg.png',
    'VISA': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Visa_2021.svg/220px-Visa_2021.svg.png',
    'МИР': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Mir-logo.SVG.svg/330px-Mir-logo.SVG.svg.png'
};

function throttle(cb, delay = 1000) {
    let shouldWait = false
    let waitingArgs
    const timeoutFunc = () => {
        if (waitingArgs == null) {
            shouldWait = false
        } else {
            cb(...waitingArgs)
            waitingArgs = null
            setTimeout(timeoutFunc, delay)
        }
    }

    return (...args) => {
        if (shouldWait) {
            waitingArgs = args
            return
        }
        cb(...args)
        shouldWait = true
        setTimeout(timeoutFunc, delay)
    }
}

const searchBankLogo = async function (name) {
    const apiUrl = `https://bing-image-search1.p.rapidapi.com/images/search?count=1&q=${name + ' банк логотип'}`
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '1ce446ec08msh4e34b3a413983cap1aa7cdjsn0e7d7430f162',
            'X-RapidAPI-Host': 'bing-image-search1.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(apiUrl, options)
        const v = await response.json()
        if (v.value && v.value.length > 0) {
            return v.value[0].contentUrl
        }
    } catch (err) {
        console.error(err)
    }
};

function splitCardNumber(val) {
    let newval = ''
    val = val.replace(/\s/g, '')
    for (var i = 0; i < val.length; i++) {
        if (i % 4 == 0 && i > 0) newval = newval.concat(' ');
        newval = newval.concat(val[i]);
    }
    return newval
}

const cardNumber = document.getElementById('card_number')
const cardHolder = document.getElementById('card_holder')
const cardExpiration = document.getElementById('card_expiration')
const cardBank = document.getElementById('card_bank')
const cardPayment = document.getElementById('card_payment')
const itable = document.getElementById('itable').children[0]
const card = document.forms.card
card.addEventListener("submit", e => {
    e.preventDefault()
    const row = itable.insertRow()
    for (let i = 0; i < card.elements.length; i++) {
        let el = card.elements[i]
        if (!el.name) {
            continue
        }
        const cell = row.insertCell()
        cell.innerHTML = el.value
        el.value = ''
    }
    cardNumber.innerText = ''
    cardHolder.innerText = ''
    cardExpiration.innerText = ''
    cardBank.src = ''
    cardPayment.src = ''
})

const throttleInputBank = throttle(value => {
    searchBankLogo(value).then(imgUrl => { cardBank.src = imgUrl })
}, 2000)

card.addEventListener('input', e => {
    const name = e.target.name
    const value = e.target.value
    switch (name) {
        case 'card':
            cardNumber.innerText = splitCardNumber(value)
            break
        case 'holder':
            cardHolder.innerText = value
            break
        case 'expiration':
            cardExpiration.innerText = value
            break
        case 'bank':
            throttleInputBank(value)
            break
        case 'payment':
            cardPayment.src = paymentLogo[value]
            break
    }
})
