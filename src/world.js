import { calculateResonance, fetchCommunityDataFromApi } from "./api/communityData.js";
import { EVENT_TYPES, reportEvent } from "./api/report.js";

const elements = {
  mapBoard: document.querySelector("#map-board"),
  updatedAt: document.querySelector("#updated-at"),
  resonanceBars: document.querySelector("#resonance-bars"),
  topicRank: document.querySelector("#topic-rank"),
  contributorRank: document.querySelector("#contributor-rank")
};

init();

async function init() {
  reportEvent(EVENT_TYPES.H5_ENTER, { page: "h5-2" });

  const [associations, community] = await Promise.all([
    fetchJson("data/associations.json"),
    fetchCommunityDataFromApi()
  ]);

  const resonance = buildResonance(community.associations);
  renderWorldMap(associations, resonance);
  renderBars(associations, resonance);
  renderTopics(associations, community.topics);
  renderContributors(associations, community.contributors);
  elements.updatedAt.textContent = `${community.updatedAt} · 每日自动更新占位`;
}

async function fetchJson(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load ${path}`);
  }
  return response.json();
}

function buildResonance(statsMap) {
  const entries = Object.entries(statsMap).map(([key, stats]) => ({
    key,
    value: calculateResonance(stats),
    stats
  }));
  const max = Math.max(...entries.map((entry) => entry.value));

  return entries.reduce((map, entry) => {
    map[entry.key] = {
      ...entry,
      intensity: max ? entry.value / max : 0
    };
    return map;
  }, {});
}

function renderWorldMap(associations, resonance) {
  elements.mapBoard.innerHTML = Object.entries(associations)
    .map(([key, association]) => {
      const item = resonance[key];
      const light = Math.round(34 + item.intensity * 48);
      const saturation = Math.round(42 + item.intensity * 58);
      return `
        <article
          class="map-tile"
          style="--accent: ${association.color}; --light: ${light}%; --sat: ${saturation}%"
          title="${association.name}：${item.value} 共鸣值"
        >
          <span class="map-crest">${association.crest}</span>
          <h2>${association.name}</h2>
          <p>${association.packaging}</p>
          <strong>${item.value}</strong>
          <small>共鸣值</small>
        </article>
      `;
    })
    .join("");
}

function renderBars(associations, resonance) {
  elements.resonanceBars.innerHTML = Object.entries(associations)
    .map(([key, association]) => {
      const item = resonance[key];
      return `
        <div class="distribution-row">
          <div class="distribution-label">
            <span>${association.shortName}</span>
            <strong>${item.value}</strong>
          </div>
          <div class="distribution-track">
            <span style="width: ${Math.max(8, item.intensity * 100)}%; --accent: ${association.color}"></span>
          </div>
        </div>
      `;
    })
    .join("");
}

function renderTopics(associations, topics) {
  elements.topicRank.innerHTML = topics
    .map((topic) => {
      const association = associations[topic.association];
      const resonance = topic.likes + topic.comments * 3 + topic.favorites * 2;
      return `
        <li>
          <span class="rank-crest" style="--accent: ${association.color}">${association.crest}</span>
          <div>
            <strong>${topic.title}</strong>
            <p>${topic.author} · ${resonance} 共鸣 · ${topic.updatedAt}</p>
          </div>
        </li>
      `;
    })
    .join("");
}

function renderContributors(associations, contributors) {
  elements.contributorRank.innerHTML = contributors
    .map((contributor) => {
      const association = associations[contributor.association];
      return `
        <li>
          <span class="rank-crest" style="--accent: ${association.color}">${association.crest}</span>
          <div>
            <strong>${contributor.id}</strong>
            <p>${association.shortName} · ${contributor.resonance} 共鸣贡献</p>
          </div>
        </li>
      `;
    })
    .join("");
}
