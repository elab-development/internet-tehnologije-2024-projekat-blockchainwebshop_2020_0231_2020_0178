// Default product list derived from scripts/deploy.js
// These are used client-side when there are no products loaded from the blockchain
const defaultProducts = [
  {
    id: 1,
    name: 'Real Madrid Home',
    price: '0.1',
    priceWei: '100000000000000000',
    stock: 5,
    category: 'home',
    image: '/images/real-madrid-home.jpg',
    description: 'Real Madrid domaći dres, official replica',
    features: ['Adidas Original', 'La Liga', 'Replica']
  },
  {
    id: 2,
    name: 'Barcelona Home',
    price: '0.12',
    priceWei: '120000000000000000',
    stock: 3,
    category: 'home',
    image: '/images/barcelona.webp',
    description: 'FC Barcelona domaći dres, official replica',
    features: ['Nike Original', 'La Liga', 'Replica']
  },
  {
    id: 3,
    name: 'Manchester United Home',
    price: '0.11',
    priceWei: '110000000000000000',
    stock: 7,
    category: 'home',
    image: '/images/manutd.jpg',
    description: 'Manchester United domaći dres, official replica',
    features: ['Adidas/Nike', 'Premier League', 'Replica']
  },
  {
    id: 4,
    name: 'Bayern Munich Home',
    price: '0.13',
    priceWei: '130000000000000000',
    stock: 4,
    category: 'home',
    image: '/images/bayern.jpg',
    description: 'Bayern Munich domaći dres, official replica',
    features: ['Adidas Original', 'Bundesliga', 'Replica']
  },
  {
    id: 5,
    name: 'PSG Home',
    price: '0.14',
    priceWei: '140000000000000000',
    stock: 6,
    category: 'home',
    image: '/images/psg.jpg',
    description: 'Paris Saint-Germain domaći dres, official replica',
    features: ['Jordan Brand', 'Ligue 1', 'Replica']
  },
  {
    id: 6,
    name: 'Liverpool Home',
    price: '0.12',
    priceWei: '120000000000000000',
    stock: 8,
    category: 'home',
    image: '/images/liverpool-authentic-home-shirt-25-26.jpg',
    description: 'Liverpool domaći dres, official replica',
    features: ['Nike Authentic', 'Premier League', 'Replica']
  }
];

export default defaultProducts;
