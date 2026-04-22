// Logika Hamburger
const hamburgerBtn = document.getElementById('hamburgerBtn');
const navLinksMenu = document.querySelector('.nav-links');

hamburgerBtn.addEventListener('click', () => {
    // Menambah/menghapus class 'active' untuk memunculkan menu
    navLinksMenu.classList.toggle('active');
    
    // Animasi putar ikon hamburger
    if (navLinksMenu.classList.contains('active')) {
        hamburgerBtn.style.transform = 'rotate(90deg)';
    } else {
        hamburgerBtn.style.transform = 'rotate(0deg)';
    }
});

// Animasi Scroll (Fade In)
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
        }
    });
});
 
document.querySelectorAll('.fade-in').forEach((el) => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    observer.observe(el);
});
 
 
// LOGIKA KERANJANG BELANJA (CHECKOUT PER BARANG)
 
let cartData = [];
let totalCartPrice = 0;
let isCartItemCheckout = false; 
 
const cartToggleBtn = document.getElementById("cartToggleBtn");
const cartBox = document.getElementById("cartBox");
const cartItemList = document.getElementById("cartItemList");
const cartTotalDisplay = document.getElementById("cartTotalDisplay");
const cartButtons = document.querySelectorAll(".btn-cart");
 
cartToggleBtn.addEventListener("click", () => {
    cartBox.style.display = (cartBox.style.display === "block") ? "none" : "block";
});
 
function updateCartUI() {
    cartItemList.innerHTML = "";
    totalCartPrice = 0;
 
    if (cartData.length === 0) {
        cartItemList.innerHTML = "<p style='text-align:center; color:#94a3b8; font-size:13px;'>Keranjang masih kosong</p>";
    } else {
        cartData.forEach((item, index) => {
            totalCartPrice += item.priceNumber;
            
            const li = document.createElement("li");
            li.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${item.priceStr}</div>
                </div>
                <div class="cart-item-actions">
                    <button class="btn-cart-co" onclick="checkoutCartItem(${index})">Checkout</button>
                    <button class="btn-remove" onclick="removeCartItem(${index})">Hapus</button>
                </div>
            `;
            cartItemList.appendChild(li);
        });
    }
 
    cartTotalDisplay.innerText = `Total: Rp ${totalCartPrice.toLocaleString("id-ID")}`;
    cartToggleBtn.innerHTML = `🛒 Keranjang (${cartData.length})`;
}
 
window.removeCartItem = function(index) {
    cartData.splice(index, 1);
    updateCartUI();
};
 
window.checkoutCartItem = function(index) {
    const item = cartData[index];
    selectedCheckoutProduct = {
        name: item.name,
        price: item.priceStr,
        cartIndex: index
    };
    isCartItemCheckout = true;
    cartBox.style.display = "none";
    resetAndOpenModal();
};
 
cartButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const card = btn.closest(".card");
        const name = card.querySelector(".card-name").innerText;
        const priceStr = card.querySelector(".price").innerText;
        const priceNumber = parseInt(priceStr.replace(/[^\d]/g, ""));
 
        cartData.push({ name, priceStr, priceNumber });
        updateCartUI();
        
        cartToggleBtn.style.transform = "scale(1.1)";
        setTimeout(() => cartToggleBtn.style.transform = "scale(1)", 200);
        
        cartBox.style.display = "block";
        setTimeout(() => {
            if(!cartBox.matches(':hover')) cartBox.style.display = "none";
        }, 2000);
    });
});
 
// FILTER KATEGORI
const tags = document.querySelectorAll('.tag');
const cards = document.querySelectorAll('.card');
 
const kategoriMap = {
    'Semua Produk': '',
    'Pakaian Pria': 'pakaian pria',
    'Sepatu': 'sepatu',
    'Aksesoris': 'aksesoris',
    'Tas & Ransel': 'tas & ransel'
};
 
tags.forEach(function(tag) {
    tag.addEventListener('click', function() {
        tags.forEach(function(t) { t.classList.remove('tag-active'); });
        tag.classList.add('tag-active');
 
        const filter = kategoriMap[tag.innerText] || '';
        cards.forEach(function(card) {
            const kategori = card.querySelector('.card-cat').innerText.toLowerCase();
            card.style.display = (filter === '' || kategori.includes(filter)) ? 'block' : 'none';
        });
    });
});
 
// LOGIKA SEARCH
const searchInput = document.querySelector('.search input');
const searchBtn = document.querySelector('.search button');
 
function cariProduk() {
    const keyword = searchInput.value.trim().toLowerCase();
 
    cards.forEach(function(card) {
        const namaProduk = card.querySelector('.card-name').innerText.toLowerCase();
        const kategoriProduk = card.querySelector('.card-cat').innerText.toLowerCase();
 
        if (keyword === '' || namaProduk.includes(keyword) || kategoriProduk.includes(keyword)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
 
    if (keyword !== '') {
        document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    }
}
 
searchBtn.addEventListener('click', cariProduk);
searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') cariProduk();
});
 
// LOGIKA RIWAYAT TRANSAKSI

const historyList = document.getElementById("historyList");
let transactions = [];

// 1. Fungsi mengambil data dari Database Laravel (GET)
async function fetchHistory() {
    try {
        const response = await fetch('/api/transactions');
        transactions = await response.json();
        
        // Membalik urutan agar pesanan terbaru ada di atas
        transactions = transactions.reverse(); 
        renderHistory();
    } catch (error) {
        console.error("Gagal mengambil data riwayat:", error);
    }
}

function renderHistory() {
    historyList.innerHTML = "";
    if (transactions.length === 0) {
        historyList.innerHTML = "<p style='color:#94a3b8; text-align:center;'>Belum ada pesanan nih. Yuk belanja!</p>";
        return;
    }
 
    transactions.forEach((trx) => {
        const currentStatus = trx.status || "Belum Diterima";
        const statusColor = currentStatus === "Diterima" ? "#10b981" : "#f59e0b";
 
        const li = document.createElement("li");
        li.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                <div style="font-size: 16px; color: #0f172a; flex: 1;">
                    📦 <strong>${trx.productName}</strong> 
                </div>
                <div style="text-align: right; min-width: 120px;">
                    <div style="color:#3b82f6; font-weight:800;">${trx.price}</div>
                    <span style="background:${statusColor}; color:white; padding: 4px 8px; border-radius: 6px; font-size:11px; font-weight:bold; display:inline-block; margin-top:4px;">
                        ${currentStatus}
                    </span>
                </div>
            </div>
            <div style="font-size: 13px; color: #475569; margin-bottom: 5px;">
                👤 <strong>${trx.name}</strong> | 📞 ${trx.phone}
            </div>
            <div style="font-size: 13px; color: #475569; margin-bottom: 12px; line-height: 1.4;">
                📍 ${trx.address}
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e2e8f0; padding-top: 12px; flex-wrap: wrap; gap: 10px;">
                <div>
                    <span class="badge-method">💳 ${trx.paymentMethod}</span>
                </div>
                <div class="trx-actions" style="display: flex; gap: 8px;">
                    <button onclick="toggleStatus(${trx.id}, '${currentStatus}')" class="btn-status">Ubah Status</button>
                    <button onclick="deleteHistory(${trx.id})" class="btn-hapus">Hapus</button>
                </div>
            </div>
        `;
        historyList.appendChild(li);
    });
}

// 2. Fungsi mengubah status (PUT)
window.toggleStatus = async function(id, currentStatus) {
    const newStatus = (currentStatus === "Diterima") ? "Belum Diterima" : "Diterima";
    try {
        await fetch(`/api/transactions/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        fetchHistory(); // Refresh data setelah update
    } catch (error) {
        alert("Gagal mengubah status!");
    }
};

// 3. Fungsi menghapus riwayat (DELETE)
window.deleteHistory = async function(id) {
    if(confirm("Apakah Anda yakin ingin menghapus riwayat pesanan ini?")) {
        try {
            await fetch(`/api/transactions/${id}`, {
                method: 'DELETE'
            });
            fetchHistory(); // Refresh data setelah dihapus
        } catch (error) {
            alert("Gagal menghapus pesanan!");
        }
    }
};
 
// Panggil fungsi saat web pertama kali dimuat
fetchHistory();
 
// LOGIKA CHECKOUT & MODAL
 
let selectedCheckoutProduct = null;
const checkoutButtons = document.querySelectorAll(".btn-checkout");
const checkoutModal = document.getElementById("checkoutModal");
const confirmCheckout = document.getElementById("confirmCheckout");
const cancelCheckout = document.getElementById("cancelCheckout");
 
const paymentMethod = document.getElementById("paymentMethod");
const paymentInfoArea = document.getElementById("paymentInfoArea"); 
const proofContainer = document.getElementById("proofContainer");
const paymentProof = document.getElementById("paymentProof");
 
paymentMethod.addEventListener("change", () => {
    if (paymentMethod.value === "Transfer Bank" || paymentMethod.value === "E-Wallet") {
        paymentInfoArea.style.display = "flex";
        proofContainer.style.display = "flex";
    } else {
        paymentInfoArea.style.display = "none";
        proofContainer.style.display = "none";
    }
});
 
function resetAndOpenModal() {
    document.getElementById("custName").value = "";
    document.getElementById("custPhone").value = "";
    document.getElementById("addrStreet").value = "";
    document.getElementById("addrVillage").value = "";
    document.getElementById("addrRegency").value = "";
    document.getElementById("addrProvince").value = "";
    paymentProof.value = ""; 
    paymentMethod.value = "Transfer Bank";
    paymentInfoArea.style.display = "flex";
    proofContainer.style.display = "flex";
 
    checkoutModal.style.display = "flex";
}
 
checkoutButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const card = btn.closest(".card");
        selectedCheckoutProduct = {
            name: card.querySelector(".card-name").innerText,
            price: card.querySelector(".price").innerText
        };
        isCartItemCheckout = false;
        resetAndOpenModal();
    });
});
 
cancelCheckout.addEventListener("click", () => {
    checkoutModal.style.display = "none";
});
 
confirmCheckout.addEventListener("click", () => {
    const name = document.getElementById("custName").value.trim();
    const phone = document.getElementById("custPhone").value.trim();
    const street = document.getElementById("addrStreet").value.trim();
    const village = document.getElementById("addrVillage").value.trim();
    const regency = document.getElementById("addrRegency").value.trim();
    const province = document.getElementById("addrProvince").value.trim();
    const payment = paymentMethod.value;
 
    if (!name || !phone || !street || !village || !regency || !province) {
        alert("Mohon isi semua data pengiriman dengan lengkap ya!");
        return;
    }
 
    if ((payment === "Transfer Bank" || payment === "E-Wallet") && paymentProof.files.length === 0) {
        alert(`Upload bukti pembayaran dulu yuk untuk metode ${payment}!`);
        return;
    }
 
    const fileName = (payment !== "COD") ? `(Bukti: ${paymentProof.files[0].name})` : "Bayar ke kurir";
    const fullAddress = `${street}, Ds/Kel. ${village}, Kab/Kota. ${regency}, Prov. ${province}`;
 
    const newTransaction = {
        productName: selectedCheckoutProduct.name,
        price: selectedCheckoutProduct.price,
        name: name,
        phone: phone,
        address: fullAddress,
        paymentMethod: payment,
        status: "Belum Diterima"
    };
 
    // 4. Mengirim pesanan baru ke Laravel (POST)
    confirmCheckout.innerText = "Memproses..."; // Ubah teks tombol sementara
    
    fetch('/api/transactions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(newTransaction)
    })
    .then(response => response.json())
    .then(data => {
        confirmCheckout.innerText = "Konfirmasi Pesanan"; // Kembalikan teks tombol
        fetchHistory(); // Refresh daftar riwayat dari database
        
        if (isCartItemCheckout) {
            cartData.splice(selectedCheckoutProduct.cartIndex, 1);
            isCartItemCheckout = false;
            updateCartUI();
        }
     
        checkoutModal.style.display = "none";
        alert("Yeay! Checkout berhasil. Pesananmu sudah masuk database Laravel! 🎉");
        document.getElementById("history").scrollIntoView({ behavior: 'smooth' });
    })
    .catch(error => {
        confirmCheckout.innerText = "Konfirmasi Pesanan";
        alert("Waduh, terjadi kesalahan saat menyambung ke server.");
        console.error(error);
    });
});
 
 
// LOGIKA FORM HUBUNGI KAMI
 
const contactForm = document.getElementById("contactForm");
 
contactForm.addEventListener("submit", function(event) {
    event.preventDefault(); // Mencegah halaman reload
 
    const name = document.getElementById("contactName").value;
    const category = document.getElementById("contactCategory").value;
 
    // Memunculkan notifikasi sukses
    alert(`Terima kasih, ${name}! ${category} Anda telah kami terima dan akan segera kami tindaklanjuti.`);
    
    // Reset isi form kembali kosong
    contactForm.reset();
});