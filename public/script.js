document.getElementById('Search').addEventListener('click', () => {
  const pokemonName = document.getElementById('input').value.toLowerCase();
  if(pokemonName === ''){
    alert('Enter a valid pokemon name');
    return;
  }
  const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw Error("Pokemon not found");
      }
      return response.json();
    })
    .then((data) => {
      const pokemon = {
        name: data.name,
        id: data.id
      };

      // Enviar el Pokémon al servidor
      fetch('/add-pokemon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pokemon })
      })
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          const pokemonInfo = document.getElementById("pokemon-info");
          pokemonInfo.innerHTML += `
            <div class="pokemon"> <p>Nombre: ${pokemon.name} -- Id: ${pokemon.id}</p></div>
          `;
        }
      });
    })
    .catch((error) => {
      const pokemonInfo = document.getElementById("pokemon-info");
      pokemonInfo.innerHTML += `<h2>${error}</h2>`;
    });
});

// Función para borrar el contenido del input y del div
document.getElementById('Delete').addEventListener('click', () => {
  let input = document.getElementById('input').value.toLowerCase();
  const pokemonInfo = document.getElementById("pokemon-info");
  let found = false;
  const pokemons = Array.from(pokemonInfo.getElementsByClassName('pokemon'));

  // Iterar sobre los Pokémon en el DOM
  pokemons.forEach(element => {
    if (element.textContent.toLowerCase().includes(input)) {
      found = true; // Marcamos que encontramos el Pokémon

      // Borrar el Pokémon del servidor
      fetch('/delete-pokemon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: input })
      })
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          pokemonInfo.removeChild(element); // Eliminamos del DOM solo si el servidor confirma la eliminación
          alert('Se ha eliminado correctamente');
        }
      });
    }
  });

  // Limpiar el input después de la búsqueda
  document.getElementById('input').value = '';

  // Mostrar mensaje solo si no se encontró ningún Pokémon
  if (!found) {
    alert('Pokemon not found');
  }
});
