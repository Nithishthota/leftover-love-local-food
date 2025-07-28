// Firebase Config (Replace with your own)

  // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQAhkRxcqDQc6Fx_1EMni-sO-pHz0ITNU",
  authDomain: "leftoverlove--local-food.firebaseapp.com",
  projectId: "leftoverlove--local-food",
  storageBucket: "leftoverlove--local-food.firebasestorage.app",
  messagingSenderId: "854892044848",
  appId: "1:854892044848:web:8ca28d7d9641313fee03f5",
  measurementId: "G-76QM31NSYP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
  databaseURL: "https://YOUR_PROJECT.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const form = document.getElementById('foodForm');
const listing = document.getElementById('listing');
const filterType = document.getElementById('filterType');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const food = {
    name: foodName.value,
    quantity: quantity.value,
    type: type.value,
    location: location.value,
    expiry: new Date(expiry.value).toISOString()
  };
  const id = Date.now();
  db.ref('food/' + id).set(food);
  form.reset();
});

function renderItem(id, data) {
  const now = new Date();
  const exp = new Date(data.expiry);
  if (exp <= now) {
    db.ref('food/' + id).remove();
    return;
  }
  if (filterType.value !== 'all' && filterType.value !== data.type) return;

  const card = document.createElement('div');
  card.className = `card ${data.type}`;
  card.innerHTML = `
    <strong>${data.name}</strong> (${data.type})<br>
    Quantity: ${data.quantity}<br>
    Location: ${data.location}<br>
    Expires: ${new Date(data.expiry).toLocaleString()}<br>
    <div class="qr" id="qr-${id}"></div>
  `;
  listing.appendChild(card);
  new QRCode(document.getElementById(`qr-${id}`), {
    text: window.location.href + "#" + id,
    width: 64, height: 64
  });
}

function loadData() {
  listing.innerHTML = '';
  db.ref('food').once('value', (snapshot) => {
    snapshot.forEach((child) => renderItem(child.key, child.val()));
  });
}

filterType.addEventListener('change', loadData);
db.ref('food').on('value', loadData);

