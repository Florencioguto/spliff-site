/**
 * SPLIFF Streetwear - JavaScript Principal
 * Gerencia menu lateral, carrinho e interações
 */

document.addEventListener('DOMContentLoaded', function() {
    carregarCamisas();
    initializeApp();
});

function initializeApp() {
    initializeMenu();
    initializeCart();
    initializeProductButtons();
}

/**
 * Carrega todas as camisas da pasta camisas automaticamente
 */
function carregarCamisas() {
    fetch('/api/camisas')
        .then(res => res.json())
        .then(camisas => {
            const grid = document.querySelector('.products-grid');
            if (!grid) return;
            grid.innerHTML = '';
            camisas.forEach((imagem, index) => {
                const nome = gerarNome(imagem);
                const preco = gerarPreco();
                const card = document.createElement('div');
                card.className = 'product-card';
                card.innerHTML = `
                    <img src="${imagem}" alt="${nome}">
                    <div class="product-info">
                        <h3>${nome}</h3>
                        <p class="price">R$ ${preco}</p>
                        <button class="add-to-cart">Adicionar ao Carrinho</button>
                    </div>
                `;
                grid.appendChild(card);
            });
        });
}

/**
 * Gera nome do produto baseado no nome do arquivo
 */
function gerarNome(imagem) {
    const nomeArquivo = imagem.split('/').pop().replace(/\.(jpe?g|png)$/i, '');
    return nomeArquivo
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
}

/**
 * Gera preço aleatório
 */
function gerarPreco() {
    const precos = ['89,90', '99,90', '109,90', '119,90', '129,90', '139,90', '149,90', '159,90'];
    return precos[Math.floor(Math.random() * precos.length)];
}

/**
 * Inicializa o menu lateral
 */
function initializeMenu() {
    const menuBtn = document.getElementById('menuBtn');
    const closeBtn = document.getElementById('closeBtn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');

    menuBtn.addEventListener('click', function() {
        sidebar.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    function closeMenu() {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);

    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (link.id !== 'cartBtn') {
                closeMenu();
            }
        });
    });
}

/**
 * Inicializa funcionalidades do carrinho
 */
function initializeCart() {
    const cartBtn = document.getElementById('cartBtn');
    const modalClose = document.getElementById('modalClose');
    const cartModal = document.getElementById('cartModal');
    const cartCount = document.getElementById('cartCount');
    let cartItems = [];

    cartBtn.addEventListener('click', function(e) {
        e.preventDefault();
        cartModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    function closeCartModal() {
        cartModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeCartModal);
    
    cartModal.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            closeCartModal();
        }
    });

    function updateCartCount() {
        cartCount.textContent = cartItems.length;
    }

    window.addToCart = function(productName, price) {
        cartItems.push({ name: productName, price: price });
        updateCartCount();
        
        const modalBody = document.querySelector('.modal-body');
        if (cartItems.length === 0) {
            modalBody.innerHTML = '<p>O carrinho está vazio.</p>';
        } else {
            let cartHTML = '<div class="cart-items">';
            cartItems.forEach(item => {
                cartHTML += `
                    <div class="cart-item">
                        <span>${item.name}</span>
                        <span>R$ ${item.price}</span>
                    </div>
                `;
            });
            cartHTML += '</div>';
            modalBody.innerHTML = cartHTML;
        }
    };
}

/**
 * Inicializa botões de produtos
 */
function initializeProductButtons() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const productCard = e.target.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const price = productCard.querySelector('.price').textContent.replace('R$ ', '');
            
            window.addToCart(productName, price);
            
            e.target.textContent = 'Adicionado!';
            e.target.style.backgroundColor = '#4CAF50';
            
            setTimeout(() => {
                e.target.textContent = 'Adicionar ao Carrinho';
                e.target.style.backgroundColor = '';
            }, 2000);
        }
    });
}

/**
 * Scroll suave para links internos
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
}); 