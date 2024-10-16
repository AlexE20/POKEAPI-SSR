const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Lista en memoria para almacenar los Pokémon
let pokemonList = [];

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // Para poder procesar datos en formato JSON
app.use(express.urlencoded({ extended: true })); // Para procesar datos en formato URL-encoded

// Renderizar la página con la lista de Pokémon
app.get('/', (req, res) => {
  res.render('index', { pokemonList });
});

// Ruta para agregar Pokémon a la lista
app.post('/add-pokemon', (req, res) => {
  const pokemon = req.body.pokemon; // Esperamos recibir un objeto Pokémon desde el frontend
  if (pokemon && !pokemonList.find(p => p.id === pokemon.id)) {
    pokemonList.push(pokemon); // Agregar solo si no existe
  }
  res.json({ success: true });
});

// Ruta para borrar un Pokémon
app.post('/delete-pokemon', (req, res) => {
  const pokemonName = req.body.name;
  pokemonList = pokemonList.filter(p => p.name !== pokemonName);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
