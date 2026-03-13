document.addEventListener('DOMContentLoaded', () => {
    filterMenu('all', document.querySelector('.filter-btn'));
});

const menuItems = [
    { name: "Эспрессо", type: "кофе", price: 800, img: "https://images.unsplash.com/photo-1510707577719-ae7c14805e9b", desc: "Крепкий, насыщенный, с золотистой пенкой." },
    { name: "Капучино", type: "кофе", price: 1200, img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93", desc: "Нежный кофе с пышной молочной пеной." },
    { name: "Латте", type: "кофе", price: 1300, img: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735", desc: "Больше молока, больше нежности." },
    { name: "Блины с медом", type: "завтрак", price: 1100, img: "https://images.unsplash.com/photo-1506784365847-bbad939e9335", desc: "Тонкие, тающие во рту блинчики с натуральным медом." },
    { name: "Сэндвич Прованс", type: "завтрак", price: 1800, img: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af", desc: "Хрустящая чиабатта, ветчина и сыр." },
    { name: "Чизкейк", type: "десерт", price: 1500, img: "https://images.unsplash.com/photo-1551024601-bec78aea704b", desc: "Классический нью-йоркский чизкейк." },
    { name: "Тирамису", type: "десерт", price: 1600, img: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9", desc: "Воздушный десерт с маскарпоне и кофе." }
];

let cart = [];

function filterMenu(type, btn) {
    const grid = document.getElementById("menu-grid");
    if (!grid) return;
    
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    const filtered = type === 'all' ? menuItems : menuItems.filter(i => i.type === type);
    
    grid.innerHTML = filtered.map((item, index) => `
        <div class="menu-item-card" onclick="openModal(${menuItems.indexOf(item)})">
            <img src="${item.img}">
            <h3>${item.name}</h3>
            <p class="price">${item.price} ₸</p>
        </div>
    `).join('');
}

function openModal(index) {
    const item = menuItems[index];
    document.getElementById('modal-img').src = item.img;
    document.getElementById('modal-title').innerText = item.name;
    document.getElementById('modal-desc').innerText = item.desc;
    document.getElementById('modal-price').innerText = item.price + " ₸";
    document.getElementById('modal-add-btn').onclick = () => addToCart(index);
    document.getElementById('modal').style.display = 'flex';
}

function closeModal() { document.getElementById('modal').style.display = 'none'; }

function addToCart(index) {
    cart.push(menuItems[index]);
    updateCartIcon();
    closeModal();
}

function updateCartIcon() {
    const btn = document.getElementById('cart-float');
    btn.style.display = 'block';
    document.getElementById('cart-count').innerText = cart.length;
}

function openCartModal() {
    const modal = document.getElementById('cart-modal');
    const list = document.getElementById('cart-items-list');
    const totalEl = document.getElementById('cart-total');
    
    list.innerHTML = cart.map((item, idx) => `
        <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
            <span>${item.name}</span>
            <span>${item.price} ₸ <button onclick="removeFromCart(${idx})" style="color:red; border:none; background:none; cursor:pointer;">✕</button></span>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    totalEl.innerText = total + " ₸";
    modal.style.display = 'flex';
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartIcon();
    if(cart.length === 0) {
        document.getElementById('cart-modal').style.display = 'none';
        document.getElementById('cart-float').style.display = 'none';
    } else {
        openCartModal();
    }
}

function scrollToOrder() { 
    document.getElementById('cart-modal').style.display = 'none';
    document.getElementById('order').scrollIntoView(); 
}




function openPaymentModal() {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    if (total === 0) { alert("Ваша корзина пуста!"); return; }
    
    document.getElementById('payment-total').innerText = total + " ₸";
    document.getElementById('cart-modal').style.display = 'none';
    document.getElementById('payment-modal').style.display = 'flex';
}

function closePaymentModal() {
    document.getElementById('payment-modal').style.display = 'none';
}

function processPayment() {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const balance = document.getElementById('user-balance').value;
    const statusEl = document.getElementById('payment-status');

    if (balance < total) {
        statusEl.style.color = "red";
        statusEl.innerText = "Ошибка: недостаточно средств!";
    } else {
        statusEl.style.color = "green";
        statusEl.innerText = "Оплата успешно прошла! Спасибо за заказ.";
        cart = []; // Очищаем корзину
        updateCartIcon();
        setTimeout(() => closePaymentModal(), 2000);
    }
}