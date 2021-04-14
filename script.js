const c = (el) =>  document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);

let modalQt = 1;
let precoUnitario;
let modalKey = 0;
let cart = [];

pizzaJson.map((item,index) => {
   let pizzaItem = c('.models .pizza-item').cloneNode(true);

   pizzaItem.setAttribute('data-key',index);
   pizzaItem.querySelector('.pizza-item--img img').src = pizzaJson[index].img;
   pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${pizzaJson[index].price.toFixed(2)}`;
   pizzaItem.querySelector('.pizza-item--name').innerHTML = pizzaJson[index].name;
   pizzaItem.querySelector('.pizza-item--desc').innerHTML = pizzaJson[index].description;

   pizzaItem.querySelector('a').addEventListener('click',(e) =>{
    e.preventDefault();
    let key = e.target.closest('.pizza-item').getAttribute('data-key');    
    modalQt = 1;
    modalKey = key;
    precoUnitario = pizzaJson[key].price;

    c('.pizzaBig img').src = pizzaJson[key].img;
    c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
    c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
    c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;   
    c('.pizzaInfo--qt').innerHTML = modalQt;   

    c('.pizzaInfo--size.selected').classList.remove('selected');

    cs('.pizzaInfo--size').forEach((size,sizeIndex) => {
        size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        if (sizeIndex == 2){
            size.classList.add('selected');
        }
    });

    c('.pizzaWindowArea').style.display = 'flex';
        c('.pizzaWindowArea').style.opacity = 0;
        setTimeout(()=>{
            c('.pizzaWindowArea').style.opacity = 1;
        },200);
}); 

   c('.pizza-area').append(pizzaItem);
});

function closeModal(){    
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=>{
        c('.pizzaWindowArea').style.display = 'none';
    },500);       
}

cs('.pizzaInfo--cancelMobileButton, .pizzaInfo--cancelButton').forEach((item)=>{
    item.addEventListener('click',closeModal);
});

c('.pizzaInfo--qtmenos').addEventListener('click',() => {
    if (modalQt > 1) {
        modalQt--;
        c('.pizzaInfo--qt').innerHTML = modalQt;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${(pizzaJson[modalKey].price * modalQt).toFixed(2)}`
    }
});

c('.pizzaInfo--qtmais').addEventListener('click',() => {
    modalQt++;    
    c('.pizzaInfo--qt').innerHTML = modalQt;
    c('.pizzaInfo--actualPrice').innerHTML = `R$ ${(pizzaJson[modalKey].price * modalQt).toFixed(2)}`
});

cs('.pizzaInfo--size').forEach((item) => {
    item.addEventListener('click',() => {
        c('.pizzaInfo--size.selected').classList.remove('selected');
        item.classList.add('selected');        
    });
});

c('.pizzaInfo--addButton').addEventListener('click',() => {    
    let pizzaItem = pizzaJson[modalKey].id;        
    let tamanho = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
    let identificador = `${pizzaItem}@${tamanho}`;

    let search = cart.findIndex((element) => element.identificador == identificador);
   
    if (search > -1){
        cart[search].quantidade += modalQt;
    } else {
    cart.push({
            pizza: pizzaItem,
            tamanho: tamanho,
            quantidade: modalQt,
            identificador
        });
    }

    updateCart();
    closeModal();    
});

function updateCart(){
    if(cart.length > 0){
        c('aside').classList.add('show');
        c('.cart').innerHTML = "";    

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

    for(let i in cart){
    let pizzaItem = pizzaJson.find((item) => item.id == cart[i].pizza);    
    subtotal += pizzaItem.price * cart[i].quantidade;

    let cartItem = c('.models .cart--item').cloneNode(true);       
    let pizzaItemTamanho;

    switch(cart[i].tamanho){
        case 0:
            pizzaItemTamanho = 'P';
            break;
        case 1:
            pizzaItemTamanho = 'M';
            break;
        case 2:
            pizzaItemTamanho = 'G';
            break;
    }       

    cartItem.querySelector('.cart--item img').src = pizzaItem.img;
    cartItem.querySelector('.cart--item-nome').innerHTML = `${pizzaItem.name} ${pizzaItemTamanho}`;
    cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].quantidade;

    cartItem.querySelector('.cart--item-qtmenos').addEventListener('click',(e) => {
        if(cart[i].quantidade > 1){
        cart[i].quantidade--;
        } else {
            cart.splice(i,1);
        }
        updateCart();
    });
    cartItem.querySelector('.cart--item-qtmais').addEventListener('click',(e) => {
        cart[i].quantidade++;
        updateCart();
    });

    c('aside .cart').append(cartItem);
    };
    desconto = subtotal * 0.1;
    total = subtotal - desconto;
    c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
    c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
    c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
}     
else{
    c('aside').classList.remove('show');
    }
}

