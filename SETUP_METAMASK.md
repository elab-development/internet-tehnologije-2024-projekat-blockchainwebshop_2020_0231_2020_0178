# 🦊 MetaMask Setup za Localhost Blockchain

## ⚠️ VAŽNO: Poručaj koji treba slediti!

### Korak 1: 🌐 Ručno dodaj Localhost mrežu (OBAVEZNO!)

**MetaMask neće automatski prepoznati localhost mrežu, pa morate ručno da je dodate:**

1. Otvori MetaMask ekstenziju
2. Klikni na dropdown mreže (gore levo) 
3. Skroluj dole i klikni "Add network"
4. Klikni "Add a network manually"
4. **TAČNO unesi sledeće podatke:**
   ```
   Network name: Hardhat Local
   New RPC URL: http://127.0.0.1:8545  
   Chain ID: 31337
   Currency symbol: ETH
   Block explorer URL: (ostavi prazno)
   ```
5. **VAŽNO: MetaMask će pokazati upozorenja - IGNORIŠI IH!**
   - "Network name may not correctly match" ✅ NORMALNO
   - "Currency symbol does not match" ✅ NORMALNO  
   - "RPC URL does not match known provider" ✅ NORMALNO
   - **Kliknite "Approve" bez obzira na upozorenja!**
6. Klikni "Save"
7. **MetaMask će automatski prebaciti na novu mrežu!**

### Korak 2: 💰 Importuj Test Account sa 10,000 ETH

1. U MetaMask-u, klikni na account ikonu (gore desno)
2. Klikni "Import Account"  
3. Izaberi "Private Key"
4. **Unesi ovaj TAČAN privatni ključ:**
   ```
   0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
   ```
5. Klikni "Import"
6. **Trebalo bi da vidiš ~10,000 ETH balans!** 💎

### Korak 3: ✅ Verifikacija pre kupovine

- ✅ Prebačen si na "Localhost 8545" mrežu  
- ✅ Vidiš ~10,000 ETH balans
- ✅ Hardhat node radi (`npx hardhat node` u terminalu)
- ✅ Web shop aplikacija je pokrenuta

### Korak 4: 🛒 Test kupovina

1. Otvori web shop aplikaciju
2. Poveži wallet (ako nije automatski)
3. Izaberi proizvod
4. Klikni "Buy Now"  
5. **MetaMask će pokazati potvrdu transakcije**
6. Proveri da li je cena tačna
7. Klikni "Confirm" 
8. Čekaj par sekundi za potvrdu na blockchain-u!

**Svaka kupovina će koštati pravi ETH sa ovog test account-a!**

---

### 🔧 Troubleshooting

**Problem:** "Povežite se na localhost mrežu"
- **Rešenje:** Prebaci se ručno na "Localhost 8545" mrežu u MetaMask

**Problem:** "Insufficient funds"
- **Rešenje:** Proveri da li si importovao test account sa 10,000 ETH

**Problem:** Transakcija se beskonačno čeka
- **Rešenje:** Proverava da li je Hardhat node pokrenut (`npx hardhat node`)