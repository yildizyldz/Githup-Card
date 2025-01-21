const API_URL = "https://api.github.com/users/";

const form = document.getElementById("form");
const search = document.getElementById("search");
const main = document.getElementById("main");

async function getUser(username) {
  try {
    const response = await axios(API_URL + username);
    const data = response.data;

    createUserCard(data);
    getRepos(username);
  } catch (err) {
    if (err.response && err.response.status === 404) {
      createErrorCard("Aradığınız kullanıcı bulunamadı :(");
    } else {
      createErrorCard("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const user = search.value.trim();
  if (user) {
    getUser(user);
    search.value = "";
  }
});

function createUserCard(user) {
  const username = user.name || user.login;
  const userBio = user.bio ? `<p>${user.bio}</p>` : "";
  const cardHTML = ` 
    <div class="card">
        <img class="user-image" src=${user.avatar_url} alt="${username}" />

        <div class="user-info">
          <div class="user-name">
            <h2>${username}</h2>
            <small>@${user.login}</small>
          </div>
        </div>

        ${userBio}

        <ul>
          <li>
            <i class="fa-solid fa-user-group"></i> ${user.followers} <strong>Followers</strong>
          </li>
          <li>
            ${user.following} <strong>Following</strong>
          </li>
          <li>
            <i class="fa-solid fa-bookmark"></i> ${user.public_repos} <strong>Repository</strong>
          </li>
        </ul>

        <div class="repos" id="repos"></div>
    </div>`;
  main.innerHTML = cardHTML;
}

function createErrorCard(msg) {
  const cardErrorHTML = `
    <div class="card">
      <h2>${msg}</h2>
    </div>`;
  main.innerHTML = cardErrorHTML;
}

async function getRepos(username) {
  try {
    const response = await axios(API_URL + username + "/repos");
    const repos = response.data;

    addReposToCard(repos);
  } catch (err) {
    createErrorCard("Repoları çekerken hata oluştu.");
  }
}

function addReposToCard(repos) {
  const reposEl = document.getElementById("repos");
  repos.slice(0, 3).forEach((repo) => {
    const reposLink = document.createElement("a");
    reposLink.href = repo.html_url;
    reposLink.target = "_blank";
    reposLink.innerHTML = `<i class="fa-solid fa-book-bookmark"></i> ${repo.name}`;
    reposEl.appendChild(reposLink);
  });
}
