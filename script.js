let allEpisodes = [];
let filteredEpisodes = [];
let allShows = [];
let filteredShows = [];
let currentShow = null;
let currentView = 'shows';
let cache = {
  shows: null,
  episodes: {}
};

async function fetchShows() {
  if (cache.shows) {
    return cache.shows;
  }

  const rootElem = document.getElementById("root");
  rootElem.innerHTML = '<div class="loading">Loading TV shows, please wait...</div>';

  try {
    const response = await fetch("https://api.tvmaze.com/shows");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    const sortedShows = data.sort((a, b) => 
      a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    );
    
    cache.shows = sortedShows;
    return sortedShows;
  } catch (error) {
    rootElem.innerHTML = '<div class="error">Failed to load TV shows. Please try refreshing the page.</div>';
    throw error;
  }
}

async function fetchEpisodes(showId) {
  if (cache.episodes[showId]) {
    return cache.episodes[showId];
  }

  const episodeContainer = document.querySelector(".episode-container");
  if (episodeContainer) {
    episodeContainer.innerHTML = '<div class="loading">Loading episodes, please wait...</div>';
  }

  try {
    const response = await fetch(`https://api.tvmaze.com/shows/${showId}/episodes`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    cache.episodes[showId] = data;
    return data;
  } catch (error) {
    if (episodeContainer) {
      episodeContainer.innerHTML = '<div class="error">Failed to load episodes. Please try refreshing the page.</div>';
    }
    throw error;
  }
}

async function setup() {
  try {
    allShows = await fetchShows();
    filteredShows = allShows;
    createPageStructure();
    showShowsListing();
  } catch (error) {
    console.error('Setup failed:', error);
  }
}

async function loadShow(showId) {
  try {
    const show = allShows.find(s => s.id === showId);
    if (!show) return;
    
    currentShow = show;
    currentView = 'episodes';
    allEpisodes = await fetchEpisodes(showId);
    filteredEpisodes = allEpisodes;
    
    showEpisodesListing();
    updateEpisodeSelector();
    makePageForEpisodes(filteredEpisodes);
    updateEpisodeCount();
    
    document.getElementById("search-input").value = "";
  } catch (error) {
    console.error('Failed to load show:', error);
  }
}

function updateEpisodeSelector() {
  const episodeSelect = document.getElementById("episode-select");
  if (!episodeSelect) return;
  
  episodeSelect.innerHTML = "";
  
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select an episode...";
  episodeSelect.appendChild(defaultOption);

  allEpisodes.forEach((episode) => {
    const option = document.createElement("option");
    const episodeCode = `S${String(episode.season).padStart(2, "0")}E${String(
      episode.number
    ).padStart(2, "0")}`;
    option.value = episode.id;
    option.textContent = `${episodeCode} - ${episode.name}`;
    episodeSelect.appendChild(option);
  });
}

function createPageStructure() {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";

  const header = document.createElement("div");
  header.className = "header";

  const title = document.createElement("h1");
  title.textContent = "TV Show Browser";
  title.className = "page-title";

  const navigation = document.createElement("div");
  navigation.className = "navigation";
  
  const backToShowsBtn = document.createElement("button");
  backToShowsBtn.id = "back-to-shows";
  backToShowsBtn.className = "nav-button";
  backToShowsBtn.textContent = "← Back to Shows";
  backToShowsBtn.style.display = "none";
  backToShowsBtn.addEventListener("click", showShowsListing);

  const searchSection = document.createElement("div");
  searchSection.className = "search-section";

  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.id = "search-input";
  searchInput.className = "search-input";
  searchInput.placeholder = "Search shows or episodes...";
  searchInput.addEventListener("input", handleSearch);

  const showSelectorSection = document.createElement("div");
  showSelectorSection.className = "show-selector-section";
  
  const showSelect = document.createElement("select");
  showSelect.id = "show-select";
  showSelect.className = "show-select";
  showSelect.addEventListener("change", handleShowSelect);
  
  const clearFiltersBtn = document.createElement("button");
  clearFiltersBtn.id = "clear-filters";
  clearFiltersBtn.className = "clear-filters-btn";
  clearFiltersBtn.textContent = "Show All";
  clearFiltersBtn.addEventListener("click", clearAllFilters);

  const episodeSelectorSection = document.createElement("div");
  episodeSelectorSection.className = "episode-selector-section";
  episodeSelectorSection.style.display = "none";

  const episodeSelect = document.createElement("select");
  episodeSelect.id = "episode-select";
  episodeSelect.className = "episode-select";
  episodeSelect.addEventListener("change", handleEpisodeSelect);

  const episodeCount = document.createElement("div");
  episodeCount.id = "episode-count";
  episodeCount.className = "episode-count";

  const contentContainer = document.createElement("div");
  contentContainer.id = "content-container";
  contentContainer.className = "content-container";

  header.appendChild(title);
  navigation.appendChild(backToShowsBtn);
  searchSection.appendChild(searchInput);
  
  showSelectorSection.appendChild(showSelect);
  showSelectorSection.appendChild(clearFiltersBtn);
  
  episodeSelectorSection.appendChild(episodeSelect);

  rootElem.appendChild(header);
  rootElem.appendChild(navigation);
  rootElem.appendChild(searchSection);
  rootElem.appendChild(showSelectorSection);
  rootElem.appendChild(episodeSelectorSection);
  rootElem.appendChild(episodeCount);
  rootElem.appendChild(contentContainer);
}

function showShowsListing() {
  currentView = 'shows';
  
  filteredShows = allShows;
  document.getElementById("search-input").value = "";
  
  document.querySelector(".page-title").textContent = "TV Show Browser";
  document.getElementById("back-to-shows").style.display = "none";
  document.querySelector(".show-selector-section").style.display = "block";
  document.querySelector(".episode-selector-section").style.display = "none";
  document.getElementById("episode-count").style.display = "none";
  document.getElementById("search-input").placeholder = "Search shows by name, genre, or summary...";
  
  updateShowSelector();
  makePageForShows(filteredShows);
}

function showEpisodesListing() {
  currentView = 'episodes';
  
  document.querySelector(".page-title").textContent = `${currentShow.name} - Episodes`;
  document.getElementById("back-to-shows").style.display = "block";
  document.querySelector(".show-selector-section").style.display = "none";
  document.querySelector(".episode-selector-section").style.display = "block";
  document.getElementById("episode-count").style.display = "block";
  document.getElementById("search-input").placeholder = "Search episodes by name or summary...";
}

async function handleShowSelect(event) {
  const selectedShowId = parseInt(event.target.value);
  
  if (selectedShowId) {
    await loadShow(selectedShowId);
  }
}

function updateShowSelector() {
  const showSelect = document.getElementById("show-select");
  if (!showSelect) return;
  
  showSelect.innerHTML = "";
  
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select a show...";
  showSelect.appendChild(defaultOption);

  allShows.forEach((show) => {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    showSelect.appendChild(option);
  });
}

function clearAllFilters() {
  if (currentView === 'shows') {
    filteredShows = allShows;
    document.getElementById("search-input").value = "";
    document.getElementById("show-select").value = "";
    makePageForShows(filteredShows);
  }
}

function handleSearch(event) {
  const searchTerm = event.target.value.toLowerCase().trim();

  if (currentView === 'shows') {
    if (searchTerm === "") {
      filteredShows = allShows;
    } else {
      filteredShows = allShows.filter((show) => {
        const nameMatch = show.name.toLowerCase().includes(searchTerm);
        const summaryMatch = show.summary && show.summary.toLowerCase().includes(searchTerm);
        const genresMatch = show.genres && show.genres.some(genre => 
          genre.toLowerCase().includes(searchTerm)
        );
        return nameMatch || summaryMatch || genresMatch;
      });
    }
    makePageForShows(filteredShows);
  } else {
    if (searchTerm === "") {
      filteredEpisodes = allEpisodes;
    } else {
      filteredEpisodes = allEpisodes.filter((episode) => {
        const nameMatch = episode.name.toLowerCase().includes(searchTerm);
        const summaryMatch = episode.summary.toLowerCase().includes(searchTerm);
        return nameMatch || summaryMatch;
      });
    }
    makePageForEpisodes(filteredEpisodes);
    updateEpisodeCount();
    document.getElementById("episode-select").value = "";
  }
}

function handleEpisodeSelect(event) {
  const selectedEpisodeId = parseInt(event.target.value);

  if (selectedEpisodeId) {
    const selectedEpisode = allEpisodes.find(
      (episode) => episode.id === selectedEpisodeId
    );
    if (selectedEpisode) {
      filteredEpisodes = [selectedEpisode];
      makePageForEpisodes(filteredEpisodes);
      updateEpisodeCount();

      document.getElementById("search-input").value = "";

      setTimeout(() => {
        const episodeElement = document.querySelector(".episode-card");
        if (episodeElement) {
          episodeElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  } else {
    filteredEpisodes = allEpisodes;
    makePageForEpisodes(filteredEpisodes);
    updateEpisodeCount();
    document.getElementById("search-input").value = "";
  }
}

function updateEpisodeCount() {
  const countElement = document.getElementById("episode-count");
  const count = filteredEpisodes.length;
  const total = allEpisodes.length;

  if (count === total) {
    countElement.textContent = `Showing all ${total} episodes`;
  } else {
    countElement.textContent = `Showing ${count} of ${total} episodes`;
  }
}

function makePageForShows(showList) {
  const contentContainer = document.getElementById("content-container");
  contentContainer.innerHTML = "";
  contentContainer.className = "shows-container";

  for (let show of showList) {
    const showDiv = document.createElement("div");
    showDiv.className = "show-card";
    showDiv.addEventListener("click", () => loadShow(show.id));
    
    const imageUrl = show.image ? show.image.medium : 'https://via.placeholder.com/210x295?text=No+Image';
    const rating = show.rating && show.rating.average ? show.rating.average : 'N/A';
    const genres = show.genres ? show.genres.join(', ') : 'Unknown';
    const status = show.status || 'Unknown';
    const runtime = show.runtime ? `${show.runtime} min` : 'Unknown';
    
    showDiv.innerHTML = `
      <img src="${imageUrl}" alt="${show.name}" class="show-image">
      <div class="show-info">
        <h2 class="show-title">${show.name}</h2>
        <div class="show-meta">
          <span class="show-rating">★ ${rating}</span>
          <span class="show-status">${status}</span>
          <span class="show-runtime">${runtime}</span>
        </div>
        <div class="show-genres">${genres}</div>
        <div class="show-summary">${show.summary || 'No summary available.'}</div>
      </div>
    `;
    contentContainer.appendChild(showDiv);
  }

  let credits = document.querySelector(".credits");
  if (!credits) {
    credits = document.createElement("p");
    credits.className = "credits";
    credits.innerHTML = `Data originally sourced from <a href="https://www.tvmaze.com/" target="_blank">TVMaze.com</a>`;
    document.getElementById("root").appendChild(credits);
  }
}

function makePageForEpisodes(episodeList) {
  const contentContainer = document.getElementById("content-container");
  contentContainer.innerHTML = "";
  contentContainer.className = "episode-container";

  for (let episode of episodeList) {
    const episodeCode = `S${String(episode.season).padStart(2, "0")}E${String(
      episode.number
    ).padStart(2, "0")}`;
    const episodeDiv = document.createElement("div");
    episodeDiv.className = "episode-card";
    const imageUrl = episode.image ? episode.image.medium : 'https://via.placeholder.com/295x166?text=No+Image';
    
    episodeDiv.innerHTML = `
      <h2 class="episode-title">${episodeCode} - ${episode.name}</h2>
      <img src="${imageUrl}" alt="${episode.name}" class="episode-image">
      <div class="episode-summary">${episode.summary}</div>
    `;
    contentContainer.appendChild(episodeDiv);
  }
}

window.onload = setup;