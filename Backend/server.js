require('dotenv').config();
const express = require('express');
const { ethers } = require('ethers');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// Konfigurasi Provider 
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com");
// Wallet untuk menandatangani transaksi 
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Endpoint untuk melakukan Hashing & Verifikasi ke Chain
app.post('/api/verify-blockchain', async (req, res) => {
    try {
        const { id, judul, jumlah, kategori } = req.body;

        // 1. Membuat Cryptographic Hash (Sidik Jari Digital) 
        const dataString = `${id}-${judul}-${jumlah}-${kategori}`;
        const dataHash = ethers.id(dataString);

        // 2. Simulasi pencatatan ke Blockchain (Mengirim Hash)
        // Di prototipe ini, kita mengirimkan bukti integritas ke network
        const tx = await wallet.sendTransaction({
            to: wallet.address, // Mengirim ke diri sendiri sebagai bukti record
            data: dataHash
        });

        res.json({
            success: true,
            hash: tx.hash, // Transaction Hash asli dari Sepolia
            status: 'verified on-chain'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Blockchain Error" });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Blockchain Bridge lari di port ${PORT}`));