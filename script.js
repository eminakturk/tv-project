//You can edit ALL of the code here

// Global variables to store all episodes and current filtered episodes
let allEpisodes = [];
let filteredEpisodes = [];
let isLoading = false;

async function setup() {
  try {
    isLoading = true;
    showLoadingState();
    
    const response = await fetch('https://api.tvmaze.com/shows/82/episodes');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    allEpisodes = await response.json();
    filteredEpisodes = allEpisodes;
    
    isLoading = false;
    populateEpisodeSelect();
    makePageForEpisodes(filteredEpisodes);
    setupEventListeners();
    
  } catch (error) {
    isLoading = false;
    showErrorState(error.message);
  }
}

function showLoadingState() {
  const rootElem = document.getElementById("root");
  const controls = rootElem.querySelector(".controls");
  
  rootElem.innerHTML = "";
  rootElem.appendChild(controls);
  
  const loadingDiv = document.createElement("div");
  loadingDiv.className = "loading-state";
  loadingDiv.innerHTML = `
    <div class="loading-spinner"></div>
    <h2>Loading Game of Thrones episodes...</h2>
    <p>Please wait while we fetch the latest episode data from TVMaze.</p>
  `;
  
  rootElem.appendChild(loadingDiv);
}

function showErrorState(errorMessage) {
  const rootElem = document.getElementById("root");
  const controls = rootElem.querySelector(".controls");
  
  rootElem.innerHTML = "";
  rootElem.appendChild(controls);
  
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-state";
  errorDiv.innerHTML = `
    <h2>Error Loading Episodes</h2>
    <p>We couldn't load the episode data. Please check your internet connection and try again.</p>
    <p class="error-details">Error: ${errorMessage}</p>
    <button onclick="location.reload()" class="retry-button">Try Again</button>
  `;
  
  rootElem.appendChild(errorDiv);
}

function setupEventListeners() {
  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.trim().toLowerCase();
    filterEpisodes(searchTerm);
    makePageForEpisodes(filteredEpisodes);
  });

  const episodeSelect = document.getElementById("episodeSelect");
  episodeSelect.addEventListener("change", () => {
    const selectedId = episodeSelect.value;
    if (selectedId === "") {
      filteredEpisodes = allEpisodes;
    } else {
      filteredEpisodes = allEpisodes.filter(
        (episode) => episode.id.toString() === selectedId
      );
    }
    makePageForEpisodes(filteredEpisodes);
    if (selectedId) {
      const episodeElement = document.getElementById(`episode-${selectedId}`);
      if (episodeElement) {
        episodeElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  });
}

function populateEpisodeSelect() {
  const episodeSelect = document.getElementById("episodeSelect");
  allEpisodes.forEach((episode) => {
    const option = document.createElement("option");
    const seasonNum = episode.season.toString().padStart(2, "0");
    const episodeNum = episode.number.toString().padStart(2, "0");
    option.value = episode.id;
    option.textContent = `S${seasonNum}E${episodeNum} - ${episode.name}`;
    episodeSelect.appendChild(option);
  });
}

function filterEpisodes(searchTerm) {
  if (searchTerm === "") {
    filteredEpisodes = allEpisodes;
  } else {
    filteredEpisodes = allEpisodes.filter(
      (episode) =>
        episode.name.toLowerCase().includes(searchTerm) ||
        episode.summary.toLowerCase().includes(searchTerm)
    );
  }
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  const searchInput = document.getElementById("searchInput");
  const searchValue = searchInput ? searchInput.value : "";
  const isSearchFocused = searchInput === document.activeElement;

  const controls = rootElem.querySelector(".controls");
  rootElem.innerHTML = "";
  rootElem.appendChild(controls);

  const header = document.createElement("header");
  header.innerHTML = `
    <h1>Game of Thrones - All Episodes</h1>
    <p class="attribution">Data comes from <a href="https://www.tvmaze.com/" target="_blank">TVMaze.com</a></p>
  `;
  rootElem.appendChild(header);

  const episodeContainer = document.createElement("div");
  episodeContainer.className = "episode-container";

  episodeList.forEach((episode) => {
    const episodeCard = document.createElement("div");
    episodeCard.className = "episode-card";
    episodeCard.id = `episode-${episode.id}`;

    const seasonNum = episode.season.toString().padStart(2, "0");
    const episodeNum = episode.number.toString().padStart(2, "0");
    const episodeCode = `S${seasonNum}E${episodeNum}`;

    const episodeHeader = document.createElement("div");
    episodeHeader.className = "episode-header";
    episodeHeader.innerHTML = `
      <h2>${episode.name} - ${episodeCode}</h2>
    `;

    const episodeContent = document.createElement("div");
    episodeContent.className = "episode-content";

    let imageHTML = "";
    if (episode.image && episode.image.medium) {
      imageHTML = `<img src="${episode.image.medium}" alt="${episode.name}" class="episode-image">`;
    }

    episodeContent.innerHTML = `
      ${imageHTML}
      <div class="episode-summary">${episode.summary}</div>
      <a href="${episode.url}" target="_blank" class="episode-link">View on TVMaze</a>
    `;

    episodeCard.appendChild(episodeHeader);
    episodeCard.appendChild(episodeContent);
    episodeContainer.appendChild(episodeCard);
  });

  rootElem.appendChild(episodeContainer);

  const episodeCount = document.getElementById("episodeCount");
  episodeCount.textContent = `${episodeList.length} episode${
    episodeList.length !== 1 ? "s" : ""
  } displayed`;

  const newSearchInput = document.getElementById("searchInput");
  newSearchInput.value = searchValue;
  if (isSearchFocused) {
    newSearchInput.focus();
  }
}

window.onload = setup;
