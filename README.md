# Blockchain WebShop - Decentralized Football Jersey Store

Decentralizovana web prodavnica fudbalskih dresova koja koristi Ethereum blockchain tehnologiju za sigurne transakcije. Projekat kombinuje React.js frontend sa Hardhat smart contract-ima.

## 🚀 Tehnologije

### Frontend
- **React.js** - Modern JavaScript framework
- **CSS3** - Stylizovani responsive dizajn
- **ethers.js** - Blockchain interakcija
- **MetaMask** - Wallet konekcija

### Blockchain
- **Hardhat** - Ethereum development environment
- **Solidity** - Smart contract programski jezik
- **OpenZeppelin** - Sigurnosni standardni
- **Local Blockchain** - Testiranje na localhost:8545

## 📋 Funkcionalnosti

### 👤 Korisničke funkcije
- ✅ Pregled kataloга dresova (bez wallet-a)
- ✅ MetaMask wallet konekcija
- ✅ Kupovina dresova ETH kriptovalutom
- ✅ Istorija kupovina
- ✅ Real-time cene u ETH

### 👑 Admin funkcije (vlasnik contract-a)
- ✅ Dodavanje novih proizvoda
- ✅ Ažuriranje cena
- ✅ Dopunjavanje stock-a
- ✅ Uklanjanje proizvoda
- ✅ Admin panel sa tabbed interface

### 🔄 Napredne funkcije
- ✅ Automatska detekcija promena MetaMask account-a
- ✅ Network switching (automatski prelazak na localhost)
- ✅ State management sa blockchain sinhronizacijom
- ✅ Mock podaci kada nema blockchain konekcije

## 🛠️ Instalacija i pokretanje

### Prerekviziti
- Node.js (v14+)
- npm ili yarn
- MetaMask browser ekstenzija
- Git

### 1. Kloniranje repository-ja
```bash
git clone https://github.com/elab-development/internet-tehnologije-2024-projekat-blockchainwebshop_2020_0231_2020_0178.git
cd internet-tehnologije-2024-projekat-blockchainwebshop_2020_0231_2020_0178
```

### 2. Instalacija dependencies
```bash
# Root projekat (Hardhat)
npm install

# Client aplikacija
cd client
npm install
cd ..
```

### 3. Pokretanje lokalnog blockchain-a
```bash
# U prvom terminalu
npx hardhat node
```

### 4. Deploy smart contract-a
```bash
# U drugom terminalu
npx hardhat run scripts/deploy.js --network localhost
```

### 5. Pokretanje React aplikacije
```bash
# U trećem terminalu
cd client
npm start
```

### 6. MetaMask setup
1. Otvori MetaMask
2. Dodaj localhost network:
   - Network Name: `Hardhat Local`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency: `ETH`
3. Import test account sa private key-em iz Hardhat node output-a

## 📁 Struktura projekta

```
├── contracts/          # Solidity smart contracts
│   └── WebShop.sol     # Glavni WebShop contract
├── scripts/            # Deployment script-ovi
│   └── deploy.js       # Contract deployment
├── client/             # React frontend aplikacija
│   ├── src/
│   │   ├── components/ # React komponente
│   │   ├── hooks/      # Custom React hooks (useWeb3)
│   │   └── utils/      # Utility funkcije
│   └── public/         # Statični fajlovi i slike
├── artifacts/          # Kompajlirani contract-i
├── cache/              # Hardhat cache
└── ignition/           # Hardhat Ignition moduli
```

## 🎮 Kako testirati

### Scenario 1: Korisnička kupovina
1. Konektuj MetaMask
2. Izaberi dres iz kataloga
3. Klikni "Kupi Sada"
4. Potvrdi transakciju u MetaMask-u
5. Proveri "Moje Kupovine" sekciju

### Scenario 2: Admin funkcije
1. Konektuj se sa admin account-om (prvi iz Hardhat node liste)
2. Vidi Admin Panel na dnu stranice
3. Dodaj novi proizvod
4. Ažuriraj cene postojećih proizvoda
5. Dopuni stock

### Scenario 3: Testiranje sa više account-ova
1. Dodaj proizvod kao admin
2. Promeni account u MetaMask dropdown-u
3. Vidi da se lista proizvoda automatski ažurira
4. Kupi proizvod kao customer
5. Vrati se na admin account i vidi promene

## 🔧 Smart Contract funkcije

```solidity
// Javne funkcije
function addProduct(string memory name, uint256 price, uint256 stock)
function buyProduct(uint256 productId, uint256 quantity) payable
function getProducts() view returns (Product[] memory)
function getUserPurchases(address user) view returns (Purchase[] memory)

// Admin funkcije (samo vlasnik)
function updatePrice(uint256 productId, uint256 newPrice)
function restockProduct(uint256 productId, uint256 quantity)
function removeProduct(uint256 productId)
```

## 👥 Tim

- **Student 1**: 2020/0231
- **Student 2**: 2020/0178

## 📝 Napomene

- Projekat koristi lokalni Hardhat blockchain za development
- Sve transakcije su u test ETH (bez realne vrednosti)
- Admin je automatski prvi account iz Hardhat node liste
- Za production deployment potrebno je ažurirati contract adrese

## 🚀 Buduće funkcionalnosti

- [ ] Integration sa testnet-om (Goerli/Sepolia)
- [ ] IPFS za čuvanje slika proizvoda
- [ ] Review sistem za proizvode
- [ ] Wishlist funkcionalnost
- [ ] Multi-token podrška (USDC, DAI)
- [ ] Mobilna aplikacija
