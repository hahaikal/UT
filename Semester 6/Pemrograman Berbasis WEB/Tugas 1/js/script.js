
document.addEventListener('DOMContentLoaded', () => {

    const loginForm = document.getElementById('loginForm'); 
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault(); 
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;


            if (email.trim() === "" || password.trim() === "") {
                alert("Email/Password yang anda masukkan salah");
            } else {
                const user = dataPengguna.find(u => u.email === email && u.password === password);
                if (user) {
                    localStorage.setItem('loggedInUser', JSON.stringify(user));
                    window.location.href = "dashboard.html";
                } else {
                    alert("Email/Password yang anda masukkan salah");
                }
            }
        });
    }

    
    const forgotLink = document.getElementById('forgotLink'); 
    const registerLink = document.getElementById('registerLink'); 
    const modal = document.getElementById('customModal'); 
    const closeBtn = document.querySelector('.close-btn'); 
    const modalTitle = document.getElementById('modalTitle'); 
    const modalDesc = document.getElementById('modalDesc'); 

    function showModal(title, desc) {
        if (modal) {
            modalTitle.textContent = title; 
            modalDesc.textContent = desc;   
            modal.style.display = 'flex';   
        }
    }

    if (forgotLink) {
        forgotLink.addEventListener('click', (e) => {
            e.preventDefault(); 
            showModal("Lupa Password", "Silakan hubungi administrator kampus untuk mereset sandi Anda.");
        });
    }

    if (registerLink) {
        registerLink.addEventListener('click', (e) => {
            e.preventDefault(); 
            showModal("Pendaftaran", "Pendaftaran akun baru ditutup sementara. Hubungi BAAK.");
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none'; 
        });
    }

    if (modal) {
        window.addEventListener('click', (e) => {
            if (e.target === modal) {    
                modal.style.display = 'none'; 
            }
        });
    }


    const greetingText = document.getElementById('greetingText');
    const userNameElement = document.getElementById('userName');
    if (greetingText) {
        const hour = new Date().getHours();
        let sapaan = "Selamat Malam"; 
        if (hour >= 5 && hour < 12) {
            sapaan = "Selamat Pagi";  
        } else if (hour >= 12 && hour < 15) {
            sapaan = "Selamat Siang"; 
        } else if (hour >= 15 && hour < 18) {
            sapaan = "Selamat Sore";  
        }

        greetingText.textContent = sapaan; 
        
        if (userNameElement) {
            const loggedInUserStr = localStorage.getItem('loggedInUser');
            if (loggedInUserStr) {
                const loggedInUser = JSON.parse(loggedInUserStr);
                userNameElement.textContent = loggedInUser.nama;
            }
        }
    }


    const trackingBtn = document.getElementById('trackingBtn');
    const trackingInput = document.getElementById('trackingInput');
    const trackingResult = document.getElementById('trackingResult');

    if (trackingBtn) {
        trackingBtn.addEventListener('click', () => {
            const noResi = trackingInput.value.trim();

            if (noResi === "") {
                alert("Masukkan Nomor Delivery Order terlebih dahulu!");
            } else {
                const data = dataTracking[noResi];
                if (data) {
                    document.getElementById('trackPenerima').textContent = data.nama;
                    document.getElementById('trackEkspedisi').textContent = data.ekspedisi;
                    document.getElementById('trackResi').textContent = data.nomorDO;
                    
                    const timelineContainer = document.getElementById('trackingTimeline');
                    if (timelineContainer) {
                        timelineContainer.innerHTML = '';
                        
                        data.perjalanan.forEach(item => {
                            const div = document.createElement('div');
                            div.className = 'timeline-item';
                            div.innerHTML = `
                                <h4>${item.keterangan}</h4>
                                <p>${item.waktu}</p>
                            `;
                            timelineContainer.appendChild(div);
                        });
                    }
                    
                    trackingResult.classList.remove('hidden');
                } else {
                    alert("Nomor Resi tidak ditemukan!");
                    trackingResult.classList.add('hidden');
                }
            }
        });
    }


    const stockContainer = document.getElementById('stockContainer'); 
    const addStockForm = document.getElementById('addStockForm'); 

    function renderStockCard(item) {
        const card = document.createElement('div');
        card.className = 'stock-card';

        card.innerHTML = `
            <img src="assets/${item.cover}" alt="Gambar ${item.namaBarang}">
            <div class="stock-card-content">
                <h3>${item.namaBarang}</h3>
                <p><strong>Kode:</strong> ${item.kodeBarang} (${item.kodeLokasi})</p>
                <p><strong>Jenis:</strong> ${item.jenisBarang}</p>
                <p><strong>Edisi:</strong> ${item.edisi}</p>
                <span class="stock-badge">Stok: ${item.stok}</span>
            </div>
        `;
        stockContainer.appendChild(card);
    }

    if (stockContainer) {
        dataBahanAjar.forEach(buku => {
            renderStockCard(buku);
        });
    }

    if (addStockForm) {
        addStockForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            
            const namaBukuBaru = document.getElementById('newBookName').value;
            const jumlahStokBaru = document.getElementById('newBookStock').value;
            
            if(namaBukuBaru.trim() === "" || jumlahStokBaru === "") return;

            const bukuBaru = {
                kodeLokasi: "LOK-BARU",
                kodeBarang: "BRG-BARU",
                namaBarang: namaBukuBaru,           
                jenisBarang: "Buku Cetak Baru",
                edisi: "Edisi Baru",
                stok: jumlahStokBaru,               
                cover: "kepemimpinan.jpg"          
            };

            dataBahanAjar.push(bukuBaru);
            renderStockCard(bukuBaru);
            addStockForm.reset();
            alert("Buku baru berhasil ditambahkan!");
        });
    }

});
