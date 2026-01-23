import './style.css'

// API Base URL Configuration
const apiBase = import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost'
    ? 'http://localhost:8000'
    : 'https://web-production-df2e0.up.railway.app');



// App State
// App State
const state = {
  currentCity: null,
  views: {
    home: document.getElementById('home-view'),
    city: document.getElementById('city-view'),
    map: document.getElementById('map-view'),
    tips: document.getElementById('tips-view'),
    faq: document.getElementById('faq-view'),
    guide: document.getElementById('guide-view'),
    saved: document.getElementById('saved-view')
  }
};

// Router Logic
function handleRoute() {
  const hash = window.location.hash;

  // Hide all views
  Object.values(state.views).forEach(el => {
    if (el) el.classList.add('hidden');
  });

  if (hash.startsWith('#city/')) {
    const cityName = decodeURIComponent(hash.split('#city/')[1]);
    state.currentCity = cityName;
    loadCity(cityName);
    window.scrollTo({ top: 0, behavior: 'auto' });
    state.views.city.classList.remove('hidden');
    loadReviews(cityName);
  } else if (hash.startsWith('#map/')) {
    const cityName = decodeURIComponent(hash.split('#map/')[1]);
    loadMap(cityName);
    state.views.map.classList.remove('hidden');
  } else if (hash === '#tips') {
    window.scrollTo({ top: 0, behavior: 'auto' });
    state.views.tips.classList.remove('hidden');
  } else if (hash === '#faq') {
    window.scrollTo({ top: 0, behavior: 'auto' });
    state.views.faq.classList.remove('hidden');
    if (window.loadQuestions) window.loadQuestions();
  } else if (hash === '#saved') {
    window.scrollTo({ top: 0, behavior: 'auto' });
    state.views.saved.classList.remove('hidden');
    renderSaved();
  } else if (hash === '#guide') {
    window.scrollTo({ top: 0, behavior: 'auto' });
    state.views.guide.classList.remove('hidden');
    renderGuideContent('Bengaluru'); // Default
  } else {
    // Default to Home
    window.scrollTo({ top: 0, behavior: 'auto' });
    state.views.home.classList.remove('hidden');
  }
}

// Mobile Menu
window.toggleMobileMenu = function () {
  const menu = document.getElementById('mobile-menu');
  menu.classList.toggle('hidden');
}

// Setup Guide
window.renderGuideContent = function (city) {
  const guides = {
    'Bengaluru': [
      { title: 'Lalbagh Botanical Garden', type: 'Park', img: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=500', miles: '240 acres of green.' },
      { title: 'Cubbon Park', type: 'Park', img: 'https://images.unsplash.com/photo-1626245229239-b9d9c288f6b8?w=500', miles: 'The lung of the city.' },
      { title: 'ISKCON Temple', type: 'Temple', img: 'https://images.unsplash.com/photo-1542361345-89e58247f2d5?w=500', miles: 'Spiritual architecture.' },
      { title: 'Commercial Street', type: 'Shopping', img: 'https://images.unsplash.com/photo-1449824913929-4bd6d5a88adc?w=500', miles: 'Shop till you drop.' }
    ],
    'Hyderabad': [
      { title: 'Charminar', type: 'History', img: 'https://images.unsplash.com/photo-1572455027382-706593b4fe7e?w=500', miles: 'Iconic monument.' },
      { title: 'Birla Mandir', type: 'Temple', img: 'https://images.unsplash.com/photo-1605537964076-3cb0ea2e356d?w=500', miles: 'White marble marvel.' },
      { title: 'Hussain Sagar Lake', type: 'Park', img: 'https://images.unsplash.com/photo-1549467688-6c84c7e6c518?w=500', miles: 'Heart of the city.' },
      { title: 'Ramoji Film City', type: 'Fun', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500', miles: 'Largest film city.' }
    ],
    'Chennai': [
      { title: 'Marina Beach', type: 'Park', img: 'https://images.unsplash.com/photo-1582510003544-bea4db981a33?w=500', miles: 'Longest urban beach.' },
      { title: 'Kapaleeshwarar Temple', type: 'Temple', img: 'https://images.unsplash.com/photo-1625292415516-56f874983226?w=500', miles: 'Dravidian architecture.' },
      { title: 'Guindy National Park', type: 'Park', img: 'https://images.unsplash.com/photo-1517549641777-62624a047d7a?w=500', miles: 'Nature inside city.' },
      { title: 'T. Nagar', type: 'Shopping', img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500', miles: 'Shopping hub.' }
    ]
  };

  const container = document.getElementById('guide-content');
  if (!container) return;

  const items = guides[city] || [];
  container.innerHTML = items.map(item => `
        <div class="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition border border-gray-100 dark:border-gray-700">
            <div class="h-48 overflow-hidden relative">
                <img src="${item.img}" class="w-full h-full object-cover transform hover:scale-110 transition duration-700">
                <div class="absolute top-2 right-2 bg-white/90 dark:bg-gray-900/90 text-xs font-bold px-2 py-1 rounded">
                    ${item.type}
                </div>
            </div>
            <div class="p-5">
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">${item.title}</h3>
                <p class="text-gray-600 dark:text-gray-400 text-sm">${item.miles}</p>
            </div>
        </div>
    `).join('');
};

// Event Listeners
window.addEventListener('hashchange', handleRoute);
window.addEventListener('load', handleRoute);

// Q&A Interaction
window.postQuestion = async function () {
  const input = document.getElementById('new-question-input');
  const text = input.value.trim();
  if (!text) return;

  try {
    const res = await fetch(`${apiBase}/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text, user_name: "You" })
    });
    if (res.ok) {
      input.value = '';
      loadQuestions(); // Refresh feed
    }
  } catch (e) {
    console.error("Failed to post question:", e);
    alert("Failed to post. Check connection.");
  }
};

window.loadQuestions = async function () {
  const feed = document.getElementById('qa-feed');
  if (!feed) return;

  try {
    const res = await fetch(`${apiBase}/questions`);
    if (!res.ok) return;

    const questions = await res.json();
    feed.innerHTML = questions.map(q => `
            <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 animate-fade-in">
                <div class="flex items-center gap-3 mb-2">
                    <div class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                        ${q.user_name.substring(0, 2).toUpperCase()}
                    </div>
                    <span class="text-sm font-bold text-gray-900 dark:text-white">${q.user_name}</span>
                    <span class="text-xs text-gray-400">${new Date(q.timestamp).toLocaleDateString()}</span>
                </div>
                <h4 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">${q.text}</h4>
                
                <div class="flex flex-col gap-2">
                    <div class="flex gap-4 text-sm text-gray-500">
                        <button class="hover:text-indigo-600 font-bold">💬 Reply</button>
                        <button class="hover:text-indigo-600">⬆️ ${q.upvotes} Upvotes</button>
                    </div>
                </div>
            </div>
        `).join('');
  } catch (e) {
    console.error("Failed to load questions:", e);
  }
}

window.toggleReply = function (id) {
  const box = document.getElementById(`reply-box-${id}`);
  box.classList.toggle('hidden');
};

window.submitReply = function (id) {
  const box = document.getElementById(`reply-box-${id}`);
  const input = box.querySelector('input');
  if (!input.value.trim()) return;

  const repliesContainer = document.getElementById(`replies-${id}`) || box.parentElement; // Fallback

  // Create reply element (simplified for demo)
  const replyHTML = `
        <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg mb-2 ml-4 border-l-2 border-indigo-500">
             <div class="flex items-center gap-2 mb-1">
                 <span class="text-xs font-bold text-gray-900 dark:text-white">You</span>
             </div>
             <p class="text-sm text-gray-600 dark:text-gray-300">${input.value}</p>
        </div>
    `;

  // Insert before the reply box container interaction
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = replyHTML;
  box.parentElement.before(tempDiv.firstElementChild);

  input.value = '';
  box.classList.add('hidden');
};

// List Property Modal
window.openListProperty = function () {
  document.getElementById('list-property-modal').classList.remove('hidden');
}
window.closeListProperty = function () {
  document.getElementById('list-property-modal').classList.add('hidden');
}

// Hook up button
document.addEventListener('DOMContentLoaded', () => {
  const listBtn = document.querySelector('button.bg-gradient-to-r'); // The gradient button in header
  if (listBtn) {
    listBtn.addEventListener('click', window.openListProperty);
  }
});

// Search Form
const searchForm = document.getElementById('search-form');
if (searchForm) {
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = document.getElementById('city-input').value.trim();
    if (city) {
      window.location.hash = `#city/${encodeURIComponent(city)}`;
    }
  });
}

// Map Button Handler
const viewMapBtn = document.getElementById('view-map-btn');
if (viewMapBtn) {
  viewMapBtn.addEventListener('click', () => {
    if (state.currentCity) {
      window.location.hash = `#map/${encodeURIComponent(state.currentCity)}`;
    }
  });
}

// Review Form Logic
const reviewForm = document.getElementById('review-form');
if (reviewForm) {
  reviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const rent = document.getElementById('rev-rent').value;
    const type = document.getElementById('rev-type').value;
    const comment = document.getElementById('rev-comment').value;

    if (!state.currentCity) return;

    try {
      const res = await fetch(`${apiBase}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: state.currentCity,
          rent_amount: parseInt(rent),
          property_type: type,
          comment: comment,
          likes: 0
        })
      });

      if (res.ok) {
        // Clear form
        reviewForm.reset();
        // Reload reviews
        loadReviews(state.currentCity);
        alert('Review Submitted! Thank you.');
      }
    } catch (err) {
      console.error(err);
      alert('Error submitting review');
    }
  });
}


// Data Fetching
async function loadCity(currCityName) {
  // Show loading state
  document.getElementById('city-name').innerText = currCityName;
  document.getElementById('city-description').innerText = 'Fetching latest insights via Wikipedia & RentCast...';
  document.getElementById('city-hero-img').src = 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=2000'; // Default Placeholder

  try {
    const res = await fetch(`${apiBase}/city-info/${currCityName}`);
    if (!res.ok) throw new Error('City not found');

    const data = await res.json();
    renderCity(data);
  } catch (err) {
    console.error(err);
    document.getElementById('city-name').innerText = 'City Details';
    document.getElementById('city-description').innerText = 'We could not fetch data for this city. Please try another popular city.';
  }
}

// State for Filtering
let currentListings = [];
let activeArea = null;
let activeFilter = 'All';

function renderCity(data) {
  state.currentCity = data.city_name;

  // Basic Info
  document.getElementById('brand-logo').innerText = data.city_name; // Quick nav update if needed
  document.getElementById('city-hero-img').src = data.images[0] || 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07';
  document.getElementById('city-name').innerText = data.city_name;
  document.getElementById('city-description').innerText = data.description;

  // Rent Estimate
  document.getElementById('est-rent').innerText = `${data.rent_estimate.currency}${data.rent_estimate.average_rent.toLocaleString('en-IN')}`;
  document.getElementById('est-range').innerText = `Range: ${data.rent_estimate.range_low.toLocaleString('en-IN')} - ${data.rent_estimate.range_high.toLocaleString('en-IN')}`;

  // Store Listings
  currentListings = data.listings || [];
  activeArea = null; // Reset
  renderAreas(data.areas || []);
  filterListings('All'); // Initial Render

  const qolContainer = document.getElementById('qol-stats');
  if (qolContainer) {
    qolContainer.innerHTML = `
        <div class="text-center p-4 bg-gray-50 rounded-xl transition hover:shadow-md">
          <div class="text-3xl font-extrabold text-blue-600">${data.quality_of_life.score}</div>
          <div class="text-xs text-gray-500 uppercase font-bold mt-1 tracking-wider">Life Score</div>
        </div>
        <div class="text-center p-4 bg-gray-50 rounded-xl transition hover:shadow-md">
          <div class="text-xl font-bold text-gray-800">${data.quality_of_life.safety}</div>
          <div class="text-xs text-gray-500 uppercase font-bold mt-1 tracking-wider">Safety</div>
        </div>
        <div class="text-center p-4 bg-gray-50 rounded-xl transition hover:shadow-md">
          <div class="text-xl font-bold text-gray-800">${data.quality_of_life.transport}</div>
          <div class="text-xs text-gray-500 uppercase font-bold mt-1 tracking-wider">Transport</div>
        </div>
        <div class="text-center p-4 bg-gray-50 rounded-xl transition hover:shadow-md">
          <div class="text-xl font-bold text-gray-800">${data.quality_of_life.nightlife}</div>
          <div class="text-xs text-gray-500 uppercase font-bold mt-1 tracking-wider">Vibe</div>
        </div>
      `;
  }
}

function renderAreas(areas) {
  const list = document.getElementById('areas-list');
  if (!list) return;

  list.innerHTML = areas.map(area => `
        <div onclick="selectArea('${area.name}')" class="area-card cursor-pointer min-w-[200px] bg-indigo-50 p-4 rounded-xl border-2 border-transparent hover:border-indigo-500 transition group relative overflow-hidden" id="area-${area.name}">
           <!-- Image bg for area? optional -->
           <div class="font-bold text-indigo-900 text-lg relative z-10">${area.name}</div>
           <div class="text-sm text-indigo-600 font-semibold mt-1 relative z-10">${area.rent} avg</div>
           <div class="text-xs text-indigo-400 mt-2 uppercase tracking-wide relative z-10">${area.vibe}</div>
        </div>
    `).join('');
}

window.selectArea = function (areaName) {
  // Toggle
  if (activeArea === areaName) activeArea = null;
  else activeArea = areaName;

  // Visual Update
  document.querySelectorAll('.area-card').forEach(el => {
    el.classList.remove('border-indigo-600', 'bg-indigo-100');
    el.classList.add('border-transparent');
  });

  if (activeArea) {
    const activeEl = document.getElementById(`area-${areaName}`);
    if (activeEl) {
      activeEl.classList.add('border-indigo-600', 'bg-indigo-100');
      activeEl.classList.remove('border-transparent');
    }
  }

  // Re-render listings
  filterListings(activeFilter);
};

// Search Input Listener
const searchInput = document.getElementById('listing-search');
if (searchInput) {
  searchInput.addEventListener('input', () => {
    filterListings(activeFilter);
  });
}

window.filterListings = function (type) {
  activeFilter = type;

  // Get Search Term
  const searchInput = document.getElementById('listing-search');
  const term = searchInput ? searchInput.value.toLowerCase() : '';

  // Update Tabs
  ['All', 'PG', 'Flat'].forEach(t => {
    const btn = document.getElementById(`tab-${t.toLowerCase()}`);
    if (btn) {
      if (t === type) {
        btn.classList.add('bg-white', 'dark:bg-gray-600', 'shadow', 'text-gray-800', 'dark:text-white');
        btn.classList.remove('text-gray-500', 'dark:text-gray-400');
      } else {
        btn.classList.remove('bg-white', 'dark:bg-gray-600', 'shadow', 'text-gray-800', 'dark:text-white');
        btn.classList.add('text-gray-500', 'dark:text-gray-400');
      }
    }
  });

  // Filter Data
  let filtered = currentListings;

  // Filter by Type
  if (type !== 'All') {
    filtered = filtered.filter(l => l.type === type);
  }

  // Filter by Area
  if (activeArea) {
    filtered = filtered.filter(l => l.area === activeArea);
  }

  // Filter by Search Term
  if (term) {
    filtered = filtered.filter(l =>
      l.name.toLowerCase().includes(term) ||
      l.specs.toLowerCase().includes(term) ||
      l.amenities.some(am => am.toLowerCase().includes(term))
    );
  }

  // Update Subtitle
  const sub = document.getElementById('listings-subtitle');
  if (sub) sub.innerText = activeArea ? `Properties in ${activeArea}` : `Showing ${filtered.length} properties across city`;

  renderListings(filtered);
};

function renderListings(listings) {
  const pgsList = document.getElementById('listings-list');
  if (!pgsList) return;

  if (listings.length === 0) {
    pgsList.innerHTML = `<div class="col-span-full text-center py-10 text-gray-400 dark:text-gray-500">No properties found matching your criteria.</div>`;
    return;
  }

  pgsList.innerHTML = listings.map(l => {
    const numericPrice = parseInt(l.price.replace(/[^0-9]/g, ''));
    const isSaved = window.isSaved && window.isSaved(l.id);
    const fairBadge = window.getFairPriceBadge ? window.getFairPriceBadge(numericPrice, state.currentCity, l.type) : '';

    return `
      <div class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition group">
          <div class="h-48 overflow-hidden relative">
              <img src="${l.image}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" onerror="this.src='https://placehold.co/400x300?text=No+Image'">
              
              <!-- Save Button -->
              <button onclick="toggleSave('${l.id}', '${l.name.replace(/'/g, "\\'")}', ${numericPrice}, '${l.area}', '${state.currentCity}', '${l.image}', '${l.type}')" 
                class="absolute top-2 right-2 text-2xl bg-white/90 dark:bg-gray-900/90 w-10 h-10 rounded-full shadow-lg hover:scale-110 transition ${isSaved ? 'text-red-500' : 'text-gray-400'}">
                ${isSaved ? '❤️' : '🤍'}
              </button>
              
              <div class="absolute top-2 left-2 bg-white/95 dark:bg-gray-900/90 px-2 py-1 rounded-md text-xs font-bold shadow-sm flex items-center gap-1">
                  <span class="${l.type === 'PG' ? 'text-orange-600' : 'text-blue-600'}">${l.type}</span>
                  <span class="text-gray-300 dark:text-gray-600">|</span>
                  <span class="dark:text-white">${l.area}</span>
              </div>
          </div>
          <div class="p-4">
              <div class="flex justify-between items-start mb-2">
                  <h3 class="font-bold text-gray-900 dark:text-white truncate">${l.name}</h3>
                  <span class="font-bold text-gray-700 dark:text-gray-200 whitespace-nowrap">${l.price}</span>
              </div>
              
              <!-- Fair Price Badge -->
              <div class="mb-2">
                ${fairBadge}
              </div>
              
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-3 font-medium uppercase tracking-wide">${l.specs}</p>
              
              <div class="flex flex-wrap gap-2 mb-4">
                  ${l.amenities.slice(0, 3).map(am => `<span class="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">${am}</span>`).join('')}
                  ${l.amenities.length > 3 ? `<span class="text-xs text-gray-400 dark:text-gray-500">+${l.amenities.length - 3}</span>` : ''}
              </div>
              <button onclick="openDetails(${l.id})" class="w-full border border-orange-600 dark:border-orange-500 text-orange-600 dark:text-orange-500 py-2 rounded-lg font-bold hover:bg-orange-50 dark:hover:bg-gray-700 transition text-sm">
                  View Details
              </button>
          </div>
      </div>
  `;
  }).join('');
}

// Details Modal Logic
window.openDetails = function (id) {
  const listing = currentListings.find(l => l.id === id);
  if (!listing) return;

  document.getElementById('detail-img').src = listing.image;
  document.getElementById('detail-type').innerText = listing.type;
  document.getElementById('detail-title').innerText = listing.name;
  document.getElementById('detail-area').innerText = listing.area;
  document.getElementById('detail-price').innerText = listing.price;
  document.getElementById('detail-specs').innerText = listing.specs;

  const amenitiesContainer = document.getElementById('detail-amenities');
  amenitiesContainer.innerHTML = listing.amenities.map(am => `
      <span class="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-bold flex items-center gap-2">
          ✓ ${am}
      </span>
    `).join('');

  document.getElementById('details-modal').classList.remove('hidden');
};

window.closeDetails = function () {
  document.getElementById('details-modal').classList.add('hidden');
};

// Modal Logic
window.openModal = function (propertyName) {
  const modal = document.getElementById('contact-modal');
  modal.classList.remove('hidden');
  // You could pre-fill message with propertyName if desired
};

window.closeModal = function () {
  document.getElementById('contact-modal').classList.add('hidden');
};

const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Request Sent! The owner will contact you shortly.');
    closeModal();
  });
}
// Attach to main check availability button too
const checkAvailBtn = document.querySelector('#est-rent-card button'); // Need to ensure ID matches
// Better: Add IDs to buttons in HTML and attach listeners.
// But for now, user asked to fix "Check Availability".
// I will add onclick="openModal()" to the main button in HTML in next step or via global selector here if ID exists.
// Actually, I'll just expose openModal globally and use valid HTML onclicks.

// Load Map Iframe
function loadMap(city) {
  const container = document.getElementById('map-container');
  // Using output=embed for no-API-key basic map
  container.innerHTML = `<iframe 
        width="100%" 
        height="100%" 
        frameborder="0" 
        style="border:0" 
        src="https://maps.google.com/maps?q=${encodeURIComponent(city)}&t=&z=13&ie=UTF8&iwloc=&output=embed" 
        allowfullscreen>
    </iframe>`;
}

// Load Reviews
async function loadReviews(city) {
  const list = document.getElementById('reviews-list');
  list.innerHTML = '<p class="text-gray-400 text-center">Loading reviews...</p>';

  try {
    const res = await fetch(`${apiBase}/reviews/${city}`);
    const reviews = await res.json();

    list.innerHTML = '';

    if (reviews.length === 0) {
      list.innerHTML = '<div class="text-center text-gray-400 py-4">No reviews yet. Be the first!</div>';
      return;
    }

    reviews.forEach(rev => {
      const div = document.createElement('div');
      div.className = 'bg-gray-50 p-4 rounded-xl border border-gray-100 flex justify-between items-start';
      div.innerHTML = `
               <div class="flex-grow">
                   <div class="flex items-center gap-2 mb-1">
                       <span class="font-bold text-gray-900">₹${rev.rent_amount.toLocaleString('en-IN')}</span>
                       <span class="text-xs bg-gray-200 px-2 py-0.5 rounded text-gray-600">${rev.property_type}</span>
                   </div>
                   <p class="text-sm text-gray-600 italic">"${rev.comment}"</p>
               </div>
               <div class="ml-4 flex flex-col items-center">
                   <button onclick="likeReview(${rev.id})" class="text-gray-400 hover:text-red-500 transition text-lg">
                     ♥
                   </button>
                   <span class="text-xs font-bold text-gray-500" id="likes-${rev.id}">${rev.likes}</span>
               </div>
            `;
      list.appendChild(div);
    });

  } catch (err) {
    console.error(err);
    list.innerHTML = '<p class="text-red-400 text-center">Failed to load reviews.</p>';
  }
}

// Like review (Global scope for onclick)
window.likeReview = async (id) => {
  try {
    const res = await fetch(`${apiBase}/reviews/${id}/like`, { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      const el = document.getElementById(`likes-${id}`);
      if (el) el.innerText = data.likes;
    }
  } catch (err) {
    console.error(err);
  }
};


