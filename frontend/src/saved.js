// Saved Properties Logic (API-based)
window.savedProperties = [];

// Initialize
(async function initSaved() {
  try {
    const res = await fetch(`${apiBase}/saved-properties`);
    if (res.ok) {
      window.savedProperties = await res.json();
      // Render if on saved page
      if (window.location.hash === '#saved') renderSaved();
      // Update buttons on current page (if any)
      updateAllSaveButtons();
    }
  } catch (e) {
    console.error("Failed to load saved properties:", e);
  }
})();

window.toggleSave = async function (listingId, name, price, area, city, image, type) {
  const idStr = String(listingId);
  console.log('Toggling save for:', idStr);
  const existingIndex = window.savedProperties.findIndex(p => String(p.listing_id) === idStr);

  if (existingIndex !== -1) {
    // Remove from Backend
    try {
      await fetch(`${apiBase}/saved-properties/${idStr}`, { method: 'DELETE' });
      // Optimistic UI Update
      window.savedProperties.splice(existingIndex, 1);
      updateSaveButton(listingId, false);
      if (window.location.hash === '#saved') renderSaved();
    } catch (e) {
      console.error("Failed to remove saved property:", e);
      alert("Failed to unsave. Check connection.");
    }
  } else {
    // Add to Backend
    const newProp = {
      listing_id: idStr,
      name,
      price: parseInt(price), // Ensure int
      area,
      city,
      image,
      type
    };

    try {
      const res = await fetch(`${apiBase}/saved-properties`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProp)
      });

      if (res.ok) {
        const savedProp = await res.json();
        window.savedProperties.push(savedProp);
        updateSaveButton(listingId, true);
      }
    } catch (e) {
      console.error("Failed to save property:", e);
      alert("Failed to save. Check connection.");
    }
  }
};

window.isSaved = function (listingId) {
  return window.savedProperties.some(p => String(p.listing_id) === String(listingId));
};

function updateAllSaveButtons() {
  // Helper to refresh all buttons on page load/navigation
  const buttons = document.querySelectorAll('[onclick*="toggleSave"]');
  buttons.forEach(btn => {
    // Extract ID from onclick string (rough parsing)
    const match = btn.getAttribute('onclick').match(/toggleSave\('([^']+)'/);
    if (match && match[1]) {
      const isSavedVal = window.isSaved(match[1]);
      updateSaveButtonUI(btn, isSavedVal);
    }
  });
}

function updateSaveButton(listingId, isSaved) {
  const btn = document.querySelector(`[onclick*="${listingId}"]`);
  if (btn) updateSaveButtonUI(btn, isSaved);
}

function updateSaveButtonUI(btn, isSaved) {
  if (isSaved) {
    btn.innerHTML = '❤️';
    btn.classList.remove('text-gray-400');
    btn.classList.add('text-red-500');
  } else {
    btn.innerHTML = '🤍';
    btn.classList.remove('text-red-500');
    btn.classList.add('text-gray-400');
  }
}

function renderSaved() {
  const grid = document.getElementById('saved-grid');
  const empty = document.getElementById('empty-saved');

  if (window.savedProperties.length === 0) {
    grid.classList.add('hidden');
    empty.classList.remove('hidden');
    return;
  }

  grid.classList.remove('hidden');
  empty.classList.add('hidden');

  grid.innerHTML = window.savedProperties.map(prop => `
    <div class="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition border border-gray-100 dark:border-gray-700">
      <div class="h-48 relative overflow-hidden">
        <img src="${prop.image}" class="w-full h-full object-cover" onerror="this.src='https://placehold.co/400x300?text=${encodeURIComponent(prop.name)}'">
        <button onclick="toggleSave('${prop.listing_id}', '${prop.name}', ${prop.price}, '${prop.area}', '${prop.city}', '${prop.image}', '${prop.type}')" 
          class="absolute top-3 right-3 text-2xl bg-white/90 dark:bg-gray-900/90 w-10 h-10 rounded-full shadow-lg hover:scale-110 transition text-red-500">
          ❤️
        </button>
        <div class="absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full ${prop.type === 'PG' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}">
          ${prop.type}
        </div>
      </div>
      <div class="p-5">
        <div class="flex justify-between items-start mb-2">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">${prop.name}</h3>
          <span class="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">₹${prop.price.toLocaleString('en-IN')}</span>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">${prop.area}, ${prop.city}</p>
        <a href="#city/${prop.city}" class="block w-full text-center bg-indigo-50 dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 py-2 rounded-lg font-bold text-sm hover:bg-indigo-100 dark:hover:bg-gray-600 transition">
          View in ${prop.city}
        </a>
      </div>
    </div>
  `).join('');
}

// Fairness indicator
window.getFairPriceBadge = function (rent, city, type) {
  // Average rent data (mock)
  const avgRents = {
    'Bengaluru': { PG: 12000, Flat: 25000 },
    'Hyderabad': { PG: 9000, Flat: 18000 },
    'Chennai': { PG: 8000, Flat: 16000 }
  };

  const avg = avgRents[city]?.[type] || 15000;
  const diff = ((rent - avg) / avg) * 100;

  if (diff < -10) {
    return `<span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">📉 ${Math.abs(diff).toFixed(0)}% Below Market</span>`;
  } else if (diff > 10) {
    return `<span class="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-bold">📈 ${diff.toFixed(0)}% Above Market</span>`;
  } else {
    return `<span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-bold">✅ Fair Price</span>`;
  }
};
