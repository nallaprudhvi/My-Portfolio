const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");
menuToggle.addEventListener("click", () => nav.classList.toggle("open"));
nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => nav.classList.remove("open")));

async function loadRepositories() {
  const grid = document.getElementById("repoGrid");
  const note = document.getElementById("repoNote");
  try {
    const response = await fetch("https://api.github.com/users/nallaprudhvi/repos?sort=updated&per_page=9");
    if (!response.ok) throw new Error("GitHub API returned " + response.status);
    const repos = await response.json();
    const visible = repos.filter(repo => !repo.fork).slice(0, 6);
    if (!visible.length) {
      grid.innerHTML = '<div class="repo-error">No public repositories were found. Visit the GitHub profile to explore projects.</div>';
      return;
    }
    grid.innerHTML = visible.map(repo => `
      <a class="repo-card" href="${repo.html_url}" target="_blank" rel="noreferrer">
        <h4>↗ ${escapeHTML(repo.name)}</h4>
        <p>${escapeHTML(repo.description || "A project from my GitHub portfolio.")}</p>
        <div class="repo-meta"><span>● ${escapeHTML(repo.language || "Code")}</span><span>★ ${repo.stargazers_count}</span><span>⑂ ${repo.forks_count}</span></div>
      </a>`).join("");
    note.textContent = "Showing up to 6 recently updated, non-fork public repositories. Repository details load live from GitHub.";
  } catch (error) {
    grid.innerHTML = '<div class="repo-error">Could not load repositories right now. You can still view all projects directly on <a href="https://github.com/nallaprudhvi?tab=repositories" target="_blank" rel="noreferrer">GitHub ↗</a>.</div>';
    note.textContent = "Live repository cards require an internet connection and the public GitHub API.";
  }
}
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));
}
loadRepositories();
