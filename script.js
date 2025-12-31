lucide.createIcons();

// --- KONFIGURASI SUPABASE ---
const supabaseUrl = 'https://mrmjlsaquixvlmnrjjew.supabase.co';
const supabaseKey = 'sb_publishable_cDoJ68ggRpE3mYcMaAPCfg_tN5Zk1Kv';
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

// ELEMENT REFERENCES 
const loginBtn = document.getElementById('loginBtn');
const authModal = document.getElementById('authModal');
const closeModal = document.getElementById('closeModal');
const modalBackdrop = document.getElementById('modalBackdrop');
const doLoginBtn = document.getElementById('doLoginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const landingView = document.getElementById('landing-view');
const dashboardView = document.getElementById('dashboard-view');
const registerBtn = document.getElementById('registerBtn');
const registerModal = document.getElementById('registerModal');
const closeReg = document.getElementById('closeReg');
const paymentModal = document.getElementById('paymentModal');
const confirmPay = document.getElementById('confirmPay');

// MODAL & ROUTING LOGIC 
function toggleModal(show) {
    if (show) authModal.classList.remove('hidden');
    else authModal.classList.add('hidden');
}
loginBtn.addEventListener('click', () => toggleModal(true));
closeModal.addEventListener('click', () => toggleModal(false));
modalBackdrop.addEventListener('click', () => toggleModal(false));

function switchToDashboard() {
    toggleModal(false);
    landingView.style.opacity = '0';
    setTimeout(() => {
        landingView.classList.add('hidden');
        dashboardView.classList.remove('hidden');
    }, 300); 
}

// --- LOGIKA REGISTRASI (UPDATE KE SUPABASE) ---
document.getElementById('submitReg').addEventListener('click', async (e) => {
    e.preventDefault();
    const nama = document.getElementById('regNama').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const instansi = document.getElementById('regInstansi').value; // Ambil data instansi

    const { data, error } = await _supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: { 
                full_name: nama,
                organization: instansi 
            }
        }
    });

    if (error) {
        alert("Gagal: " + error.message);
    } else {
        alert("Berhasil Daftar! Data instansi tersimpan di Supporting Layer.");
        registerModal.classList.add('hidden');
        authModal.classList.remove('hidden'); 
    }
});

// --- LOGIKA LOGIN (UPDATE KE SUPABASE) ---
doLoginBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = document.querySelector('#loginForm input[type="email"]').value;
    const password = document.querySelector('#loginForm input[type="password"]').value;

    const { data, error } = await _supabase.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        alert("Gagal: " + error.message);
    } else {
        const userNama = data.user.user_metadata.full_name;
        switchToDashboard();
        
        // Update nama di dashboard agar personal
        document.querySelector('.text-sm.font-medium').innerText = userNama;

        // Panggil data transaksi hanya jika login BERHASIL
        loadTransactions();
    }
});

logoutBtn.addEventListener('click', async () => {
    await _supabase.auth.signOut();
    location.reload(); 
});

// Toggle Modal Register 
registerBtn.addEventListener('click', () => registerModal.classList.remove('hidden'));
closeReg.addEventListener('click', () => registerModal.classList.add('hidden'));

// --- LOGIKA TRANSAKSI KASFLOW ---
const transModal = document.getElementById('transModal');
document.getElementById('openTransModal').addEventListener('click', () => transModal.classList.remove('hidden'));
document.getElementById('closeTransModal').addEventListener('click', () => transModal.classList.add('hidden'));

// Simpan Data
document.getElementById('transForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const { data: { user } } = await _supabase.auth.getUser();

    const payload = {
        profile_id: user.id,
        judul: document.getElementById('transJudul').value,
        jumlah: document.getElementById('transJumlah').value,
        kategori: document.getElementById('transKategori').value,
        status: 'pending'
    };

    // 1. Simpan ke Supporting Layer (Supabase)
    const { data: newTx, error } = await _supabase.from('transactions').insert([payload]).select();

    if (error) {
        alert(error.message);
    } else {
        alert("Tahap 1: Berhasil dicatat di Supporting Layer. Memulai Verifikasi Blockchain...");
        
        // 2. Panggil Node.js untuk Verifikasi Blockchain (Blockchain Layer)
        const response = await fetch('https://experimental-duck-pratama-c4294837.koyeb.app/api/verify-blockchain', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTx[0])
        });

        const result = await response.json();

        if (result.success) {
            // 3. Update status di Supabase setelah dapet Hash dari Sepolia
            await _supabase.from('transactions')
                .update({ tx_hash: result.hash, status: 'verified on-chain' })
                .eq('id', newTx[0].id);

            alert("Tahap 2: Data Terkunci secara Kekal di Sepolia!");
            transModal.classList.add('hidden');
            loadTransactions(); 
        }
    }
});

// Tampilkan Data 
async function loadTransactions() {
    const { data, error } = await _supabase.from('transactions').select('*').order('created_at', { ascending: false });
    if (error) return;

    const tbody = document.querySelector('tbody');
    tbody.innerHTML = ''; 

    data.forEach(tx => {
        const row = `
            <tr class="hover:bg-slate-800/50 transition group">
                <td class="px-6 py-4 text-slate-300">${new Date(tx.created_at).toLocaleDateString('id-ID')}</td>
                <td class="px-6 py-4 font-medium text-white">${tx.judul}</td>
                <td class="px-6 py-4 font-mono text-blue-400">${tx.tx_hash || '0x...[Belum di-hash]'}</td>
                <td class="px-6 py-4">
                    <span class="${tx.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-[#bef264]/10 text-[#bef264]'} px-2 py-0.5 rounded-full text-xs">
                        ${tx.status}
                    </span>
                </td>
                <td class="px-6 py-4 text-right font-bold text-white">Rp ${Number(tx.jumlah).toLocaleString('id-ID')}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

document.querySelectorAll('#pricing button').forEach(btn => {
    btn.addEventListener('click', () => {
        // Cek dulu apakah user sudah login
        _supabase.auth.getSession().then(({data}) => {
            if (data.session) {
                paymentModal.classList.remove('hidden');
            } else {
                alert("Silakan Masuk/Daftar terlebih dahulu untuk berlangganan!");
                toggleModal(true); // Buka modal login
            }
        });
    });
});

// Konfirmasi Pembayaran Sandbox
confirmPay.addEventListener('click', async () => {
    const { data: { user } } = await _supabase.auth.getUser();

    const { error } = await _supabase.from('profiles')
        .update({ subscription_plan: 'Instansi Kota (Pro)', is_paid: true })
        .eq('id', user.id);

    if (error) {
        alert(error.message);
    } else {
        alert("Pembayaran Berhasil! Akun Anda kini memiliki akses Enterprise.");
        paymentModal.classList.add('hidden');
        switchToDashboard(); // Pindah ke dashboard
    }

});
