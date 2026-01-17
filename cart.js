// Clean, robust cart rendering and form prefill
console.clear();

const cartContainer = document.getElementById('cartContainer')

// For collecting order items to prefill the embedded form
let orderItems = []

const boxContainerDiv = document.createElement('div')
boxContainerDiv.id = 'boxContainer'

// Helper to safely read cart info from cookie (expected format: "items=1 2 3,counter=3")
function readCartCookie(){
    try{
        const ck = document.cookie || ''
        if(!ck || ck.indexOf('counter=') === -1) return null
        const parts = ck.split(',').map(p=>p.trim())
        let counterPart = parts.find(p=>p.includes('counter=')) || ''
        let itemsPart = parts.find(p=>p.includes('=') && !p.includes('counter=')) || ''
        const counter = Number(counterPart.split('=')[1]) || 0
        const items = itemsPart ? (itemsPart.split('=')[1]||'').trim().split(/\s+/).filter(Boolean) : []
        return { counter, items }
    }catch(err){
        console.warn('readCartCookie failed', err)
        return null
    }
}

// Render a single cart item card
function dynamicCartSection(product, qty){
    const boxDiv = document.createElement('div')
    boxDiv.className = 'box'

    const img = document.createElement('img')
    img.src = product.preview
    img.alt = product.name
    boxDiv.appendChild(img)

    const h3 = document.createElement('h3')
    h3.textContent = `${product.name} × ${qty}`
    boxDiv.appendChild(h3)

    const h4 = document.createElement('h4')
    h4.textContent = `Amount: Rs ${product.price}`
    boxDiv.appendChild(h4)

    boxContainerDiv.appendChild(boxDiv)
}

// Populate the embedded order form with items and quantities
function populateOrderForm(items){
    try{
        const summaryEl = document.getElementById('productsSummary')
        const hiddenInput = document.getElementById('orderItems')
        if(!summaryEl || !hiddenInput) return
        summaryEl.innerHTML = ''
        items.forEach(it=>{
            const li = document.createElement('li')
            li.textContent = `${it.name} × ${it.quantity}  —  Rs ${it.price}`
            summaryEl.appendChild(li)
        })
        hiddenInput.value = JSON.stringify(items)
        const form = document.getElementById('orderForm')
        if(form) form.dataset.orderItems = hiddenInput.value
    }catch(err){
        console.error('populateOrderForm error', err)
    }
}

const totalContainerDiv = document.createElement('div')
totalContainerDiv.id = 'totalContainer'

const totalDiv = document.createElement('div')
totalDiv.id = 'total'
totalContainerDiv.appendChild(totalDiv)

const totalh2 = document.createElement('h2')
totalh2.textContent = 'Total Amount'
totalDiv.appendChild(totalh2)

// To update the total amount and add the place-order button
function amountUpdate(amount){
    // clear previous total children
    while(totalDiv.childNodes.length>1) totalDiv.removeChild(totalDiv.lastChild)
    const totalh4 = document.createElement('h4')
    totalh4.id = 'toth4'
    totalh4.textContent = `Amount: Rs ${amount}`
    totalDiv.appendChild(totalh4)
    // append button area
    totalDiv.appendChild(buttonDiv)
}

const buttonDiv = document.createElement('div')
buttonDiv.id = 'button'
const buttonTag = document.createElement('button')
buttonTag.type = 'button'
buttonDiv.appendChild(buttonTag)
const buttonLink = document.createElement('a')
buttonLink.href = '#orderPanel'
buttonTag.appendChild(buttonLink)
const buttonText = document.createTextNode('Place Order')
buttonTag.appendChild(buttonText)

buttonTag.addEventListener('click', function(e){
    e.preventDefault()
    const panel = document.getElementById('orderPanel')
    if(panel){
        if(panel.classList.contains('hidden')){
            panel.classList.remove('hidden')
            setTimeout(()=>{
                panel.scrollIntoView({behavior:'smooth', block:'center'})
                const first = panel.querySelector('input,select,button')
                if(first) first.focus()
            },120)
        } else {
            panel.scrollIntoView({behavior:'smooth', block:'center'})
        }
    }
})

// Close order panel button (if present)
document.addEventListener('click', function(ev){
    if(ev.target && ev.target.id === 'closeOrderPanel'){
        const panel = document.getElementById('orderPanel')
        if(panel) panel.classList.add('hidden')
    }
})

// BACKEND CALL
const httpRequest = new XMLHttpRequest()
httpRequest.onreadystatechange = function(){
    if(this.readyState !== 4) return
    if(this.status !== 200){ console.log('call failed!'); return }
    const contentTitle = JSON.parse(this.responseText)

    const cartInfo = readCartCookie()
    const counter = cartInfo ? Number(cartInfo.counter)||0 : 0
    document.getElementById('totalItem').innerHTML = ('Total Items: ' + counter)
    const itemsArray = cartInfo ? cartInfo.items : []

    // reset container
    boxContainerDiv.innerHTML = ''
    orderItems = []

    if(!itemsArray || itemsArray.length === 0){
        boxContainerDiv.innerHTML = '<p style="color:#6b7280;padding:20px">Votre panier est vide.</p>'
        cartContainer.appendChild(boxContainerDiv)
        return
    }

    // build frequency map
    const freq = {}
    itemsArray.forEach(id => { if(id) freq[id] = (freq[id]||0)+1 })

    let totalAmount = 0
    Object.keys(freq).forEach(id => {
        const idx = Number(id)-1
        const product = contentTitle[idx]
        if(!product) return
        const qty = freq[id]
        totalAmount += Number(product.price) * qty
        dynamicCartSection(product, qty)
        orderItems.push({ id: product.id, name: product.name, price: product.price, quantity: qty })
    })

    cartContainer.appendChild(boxContainerDiv)
    cartContainer.appendChild(totalContainerDiv)
    amountUpdate(totalAmount)
    populateOrderForm(orderItems)
}

httpRequest.open('GET','https://5d76bf96515d1a0014085cf9.mockapi.io/product', true)
httpRequest.send()




