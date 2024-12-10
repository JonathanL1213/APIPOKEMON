const API_URL = "https://pokeapi.co/api/v2/pokemon";
let currentPageUrl = `${API_URL}?limit=10`;

const pokemonContainer = document.getElementById("pokemonContainer");
const prevPageButton = document.getElementById("prevPage");
const nextPageButton = document.getElementById("nextPage");

async function loadInitialData() {
    try {
        const response = await fetch('pokeData.json');
        const data = await response.json();
        renderPokemons(data.pokemons);
    } catch (error) {
        console.error("Error al cargar los datos iniciales:", error);
    }
}

async function fetchPokemons(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        renderPokemons(data.results);
        updatePagination(data.previous, data.next);
    } catch (error) {
        console.error("Error al obtener datos de la API:", error);
    }
}

async function renderPokemons(pokemons) {
    pokemonContainer.innerHTML = "";
    for (const pokemon of pokemons) {
        const pokemonDetails = await fetch(pokemon.url).then(res => res.json());
        const speciesDetails = await fetch(pokemonDetails.species.url).then(res => res.json());

        const card = document.createElement("div");
        card.className = "pokemon-card";
        card.innerHTML = `
            <img src="${pokemonDetails.sprites.front_default}" alt="${pokemonDetails.name}">
            <h3>${capitalize(pokemonDetails.name)}</h3>
            <p><strong>Status:</strong> ${pokemonDetails.stats[0].base_stat}</p>
            <p><strong>Especie:</strong> ${speciesDetails.genera[7]?.genus || "Desconocida"}</p>
        `;
        pokemonContainer.appendChild(card);
    }
}
function updatePagination(prevUrl, nextUrl) {
    prevPageButton.disabled = !prevUrl;
    nextPageButton.disabled = !nextUrl;

    prevPageButton.onclick = () => {
        if (prevUrl) {
            currentPageUrl = prevUrl;
            fetchPokemons(currentPageUrl);
        }
    };

    nextPageButton.onclick = () => {
        if (nextUrl) {
            currentPageUrl = nextUrl;
            fetchPokemons(currentPageUrl);
        }
    };
}

function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

loadInitialData();
fetchPokemons(currentPageUrl);