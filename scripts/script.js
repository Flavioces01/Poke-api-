document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const input = document.getElementById("nombre-pokemon");
  const tipoBusqueda = document.getElementById("tipo-busqueda");
  const limpiarBtn = document.getElementById("boton-limpiar");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const valor = input.value.trim().toLowerCase();
    const tipo = tipoBusqueda.value;

    if (!valor) return;

    try {
      if (tipo === "pokemon") {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${valor}`);
        if (!res.ok) throw new Error("Pokémon no encontrado");
        const data = await res.json();
        mostrarPokemon(data);
      } else if (tipo === "habilidad") {
        const res = await fetch(`https://pokeapi.co/api/v2/ability/${valor}`);
        if (!res.ok) throw new Error("Habilidad no encontrada");
        const data = await res.json();
        const pokemons = data.pokemon.map(p => p.pokemon.name).join(", ");
        document.getElementById("nombre").textContent = `Pokémon con habilidad "${valor}"`;
        document.getElementById("altura").textContent = "-";
        document.getElementById("peso").textContent = "-";
        document.getElementById("tipo").textContent = pokemons;
        document.getElementById("imagen").src = "";
      } else if (tipo === "region") {
        const res = await fetch(`https://pokeapi.co/api/v2/region/${valor}`);
        if (!res.ok) throw new Error("Región no encontrada");
        const data = await res.json();
        const nombres = data.locations.map(loc => loc.name).join(", ");
        document.getElementById("nombre").textContent = `Región: ${data.name}`;
        document.getElementById("altura").textContent = "-";
        document.getElementById("peso").textContent = "-";
        document.getElementById("tipo").textContent = nombres;
        document.getElementById("imagen").src = "";
      }

      limpiarBtn.style.display = "inline-block";
    } catch (err) {
      alert(err.message);
    }
  });

  limpiarBtn.addEventListener("click", () => {
    input.value = "";
    document.getElementById("nombre").textContent = "";
    document.getElementById("altura").textContent = "";
    document.getElementById("peso").textContent = "";
    document.getElementById("tipo").textContent = "";
    document.getElementById("imagen").src = "";
    limpiarBtn.style.display = "none";
  });
});

function mostrarPokemon(data) {
  document.getElementById("nombre").textContent = data.name;
  document.getElementById("altura").textContent = data.height;
  document.getElementById("peso").textContent = data.weight;
  document.getElementById("tipo").textContent = data.types.map(t => t.type.name).join(", ");
  document.getElementById("imagen").src = data.sprites.front_default;
}

let listaPokemones = [];

async function cargarNombresPokemon() {
  try {
    const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1000");
    const data = await res.json();
    listaPokemones = data.results.map(p => p.name);
  } catch (error) {
    alert.error("Error al cargar nombres de Pokémon:", error);
  }
}
document.getElementById("nombre-pokemon").addEventListener("input", function () {
  const input = this.value.toLowerCase();
  const sugerencias = listaPokemones.filter(nombre => nombre.startsWith(input)).slice(0, 5);

  mostrarSugerencias(sugerencias);
});
function mostrarSugerencias(sugerencias) {
  let contenedor = document.getElementById("sugerencias");
  if (!contenedor) {
    contenedor = document.createElement("ul");
    contenedor.id = "sugerencias";
    contenedor.className = "list-group position-absolute w-100";
    document.getElementById("nombre-pokemon").parentNode.appendChild(contenedor);
  }

  contenedor.innerHTML = "";
  sugerencias.forEach(nombre => {
    const item = document.createElement("li");
    item.className = "list-group-item list-group-item-action";
    item.textContent = nombre;
    item.onclick = () => {
      document.getElementById("nombre-pokemon").value = nombre;
      contenedor.innerHTML = "";
    };
    contenedor.appendChild(item);
  });
}
document.addEventListener("DOMContentLoaded", cargarNombresPokemon);