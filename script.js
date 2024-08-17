// Use the API_URL variable to make fetch requests to the API.
// Replace the placeholder with your cohort name (ex: 2109-UNF-HY-WEB-PT)
const cohortName = "YOUR COHORT NAME HERE";
const API_URL = `https://fsa-puppy-bowl.herokuapp.com/api/2407-FTB-ET-WEB-FT`;

const state = {
  players: [],
};
const single = {
  player: {},
};

/**
 * Fetches all players from the API.
 * @returns {Object[]} the array of player objects
 */
const fetchAllPlayers = async () => {
  try {
    const response = await fetch(`${API_URL}/players`);
    const result = await response.json();
    return result.data.players;
  } catch (err) {
    console.error("Uh oh, trouble fetching players!", err);
    console.log(err);
  }
};
console.log(fetchAllPlayers());

/**
 * Fetches a single player from the API.
 * @param {number} playerId
 * @returns {Object} the player object
 */
const fetchSinglePlayer = async (playerId) => {
  try {
    const response = await fetch(`${API_URL}/players/${playerId}`);
    const result = await response.json();
    return result.data;
  } catch (err) {
    console.error(`Oh no, trouble fetching player #${playerId}!`, err);
  }
};
console.log(fetchSinglePlayer(4));

/**
 * Adds a new player to the roster via the API.
 * @param {Object} playerObj the player to add
 * @returns {Object} the player returned by the API
 */
const addNewPlayer = async (playerObj) => {
  try {
    const response = await fetch(`${API_URL}/players`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(playerObj),
    });
    const json = await response.json();
    return json.data;
  } catch (err) {
    console.error("Oops, something went wrong with adding that player!", err);
  }
};

/**
 * Removes a player from the roster via the API.
 * @param {number} playerId the ID of the player to remove
 */
const removePlayer = async (playerId) => {
  try {
    const response = await fetch(`${API_URL}/players/${playerId}`, {
      method: "DELETE",
    });
    const result = await response.json();
    console.log(result);
  } catch (err) {
    console.error(
      `Whoops, trouble removing player #${playerId} from the roster!`,
      err
    );
  }
};
console.log(removePlayer());

/**
 * Updates `<main>` to display a list of all players.
 *
 * If there are no players, a corresponding message is displayed instead.
 *
 * Each player is displayed in a card with the following information:
 * - name
 * - id
 * - image (with alt text of the player's name)
 *
 * Additionally, each card has two buttons:
 * - "See details" button that, when clicked, calls `renderSinglePlayer` to
 *    display more information about the player
 * - "Remove from roster" button that, when clicked, will call `removePlayer` to
 *    remove that specific player and then re-render all players
 *
 * Note: this function should replace the current contents of `<main>`, not append to it.
 * @param {Object[]} playerList - an array of player objects
 */
const renderAllPlayers = (playerList) => {
  console.log(playerList);
  const main = document.querySelector("main");
  main.innerHTML = "";

  if (playerList.length === 0) {
    main.innerHTML = `<div>No players were present</div>`;
    return;
  }

  const container = document.createElement("div");
  container.classList.add("card-container");

  playerList.forEach((player) => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <h3>${player.name}</h3>
      <p>ID: ${player.id}</p>
      <p>Breed: ${player.breed}</p>
      <p>Status: ${player.status}</p>
      <img src="${player.imageUrl}" alt="${player.name}" />
    `;

    const detailsButton = document.createElement("button");
    detailsButton.textContent = "See Details";
    detailsButton.addEventListener("click", () => renderSinglePlayer(player));

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", async () => {
      await removePlayer(player.id);
      const players = await fetchAllPlayers();
      renderAllPlayers(players);
    });

    card.appendChild(detailsButton);
    card.appendChild(removeButton);
    container.appendChild(card);
  });

  main.appendChild(container);
};
// return card;
//  });
//    main.append(container);
// };
// fetchAllPlayers().then(() => renderAllPlayers(state.players));

/**
 * Updates `<main>` to display a single player.
 * The player is displayed in a card with the following information:
 * - name
 * - id
 * - breed
 * - image (with alt text of the player's name)
 * - team name, if the player has one, or "Unassigned"
 *
 * The card also contains a "Back to all players" button that, when clicked,
 * will call `renderAllPlayers` to re-render the full list of players.
 * @param {Object} player an object representing a single player
 */
const renderSinglePlayer = async (player) => {
  console.log(player);
  const main = document.querySelector("main");
  main.innerHTML = "";

  // if (!player.length) {
  //   main.innerHTML = `<div>No players found</div>`
  //   return;
  // }
  const card = document.createElement("div");
  card.innerHTML = `
    <h3>${player.name}</h3>
    <p>ID: ${player.id}</p>
    <p>Breed: ${player.breed}</p>
    <p>Status: ${player.status}</p>
    <img src = "${player.imageUrl}" alt = "${player.name}" />
    <br></br>
    `;

  const returnButton = document.createElement("button");
  returnButton.textContent = "Return";
  returnButton.addEventListener("click", async () => {
    const players = await fetchAllPlayers();
    renderAllPlayers(players);
  });
  card.appendChild(returnButton);
  main.appendChild(card);
  // main.replaceChildren(main);
  // returnButton.addEventListener("click", () => init());
};

/**
 * Fills in `<form id="new-player-form">` with the appropriate inputs and a submit button.
 * When the form is submitted, it should call `addNewPlayer`, fetch all players,
 * and then render all players to the DOM.
 */
const renderNewPlayerForm = () => {
  try {
    const form = document.getElementById("new-player-form");
    form.innerHTML = /*html*/ `<label for = "name">Name:</label><input type = "text" name = "name"></input><label for = "breed">Breed:</label><input type = "text" name = "breed"></input><label for = "status">Status:</label><input type = "text" name = "status"></input><label for = "imageUrl">ImageUrl:</label><input type = "text" name = "imageUrl"></input><button type = "submit">Submit</button>`;

    // const newPlayerButton = document.querySelector("button");
    // newPlayerButton.setAttribute("type", "submit");
    // form.appendChild(newPlayerButton);
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const playerObj = {
        name: form.elements.name.value,
        breed: form.elements.breed.value,
        status: form.elements.status.value,
        imageUrl: form.elements.imageUrl.value,
      };
      await addNewPlayer(playerObj);
      const players = await fetchAllPlayers();
      renderAllPlayers(players);
      renderNewPlayerForm();
    });
  } catch (err) {
    console.error("Uh oh, trouble rendering the new player form!", err);
  }
};

/**
 * Initializes the app by fetching all players and rendering them to the DOM.
 */
const init = async () => {
  const players = await fetchAllPlayers();
  renderAllPlayers(players);

  renderNewPlayerForm();
};

// This script will be run using Node when testing, so here we're doing a quick
// check to see if we're in Node or the browser, and exporting the functions
// we want to test if we're in Node.
if (typeof window === "undefined") {
  module.exports = {
    fetchAllPlayers,
    fetchSinglePlayer,
    addNewPlayer,
    removePlayer,
    renderAllPlayers,
    renderSinglePlayer,
    renderNewPlayerForm,
  };
} else {
  init();
}
