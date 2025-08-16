//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";

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
}

// Global variables to store all episodes and current filtered episodes
let allEpisodes = [];
let filteredEpisodes = [];

function setup() {
  allEpisodes = getAllEpisodes();
  filteredEpisodes = allEpisodes;
  populateEpisodeSelect();
  makePageForEpisodes(filteredEpisodes);
  setupEventListeners();
}

function setupEventListeners() {
  // Search input event listener
  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.trim().toLowerCase();
    filterEpisodes(searchTerm);
    makePageForEpisodes(filteredEpisodes);
  });

  // Episode select event listener
  const episodeSelect = document.getElementById("episodeSelect");
  episodeSelect.addEventListener("change", () => {
    const selectedId = episodeSelect.value;
    if (selectedId === "") {
      filteredEpisodes = allEpisodes; // Reset to all episodes
    } else {
      filteredEpisodes = allEpisodes.filter(
        (episode) => episode.id.toString() === selectedId
      );
    }
    makePageForEpisodes(filteredEpisodes);
    // Scroll to the selected episode if it exists
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
  // Preserve search input state
  const searchInput = document.getElementById("searchInput");
  const searchValue = searchInput ? searchInput.value : "";
  const isSearchFocused = searchInput === document.activeElement;

  // Preserve the controls
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
    episodeCard.id = `episode-${episode.id}`; // Add ID for scrolling

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

  // Update episode count
  const episodeCount = document.getElementById("episodeCount");
  episodeCount.textContent = `${episodeList.length} episode${
    episodeList.length !== 1 ? "s" : ""
  } displayed`;

  // Restore search input state
  const newSearchInput = document.getElementById("searchInput");
  newSearchInput.value = searchValue;
  if (isSearchFocused) {
    newSearchInput.focus();
  }
}

window.onload = setup;
