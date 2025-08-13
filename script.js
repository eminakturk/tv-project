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
  
  episodeList.forEach(episode => {
    const episodeCard = document.createElement("div");
    episodeCard.className = "episode-card";
    
    const seasonNum = episode.season.toString().padStart(2, '0');
    const episodeNum = episode.number.toString().padStart(2, '0');
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

window.onload = setup;
