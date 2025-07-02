document.addEventListener("DOMContentLoaded", () => {
  const form         = document.querySelector("form");
  const input        = document.getElementById("nombre-pokemon");
  const tipoBusqueda = document.getElementById("tipo-busqueda");
  const limpiarBtn   = document.getElementById("boton-limpiar");

  let listaPokemones = [];

  async function cargarNombresPokemon() {
    try {
      const res  = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1000");
      const data = await res.json();
      listaPokemones = data.results.map(p => p.name);
    } catch (err) {
      console.error("Error al cargar nombres de Pokémon:", err);
    }
  }
  cargarNombresPokemon();

  input.addEventListener("input", () => {
    const txt = input.value.trim().toLowerCase();
    if (!txt) return borrarSugerencias();

    const sugerencias = listaPokemones
      .filter(name => name.startsWith(txt))
      .slice(0, 5);
    mostrarSugerencias(sugerencias);
  });

  function mostrarSugerencias(sugerencias) {
    borrarSugerencias();
    if (!sugerencias.length) return;

    const cont = document.createElement("ul");
    cont.id = "sugerencias";
    cont.className = "list-group position-absolute w-100";
    sugerencias.forEach(name => {
      const item = document.createElement("li");
      item.className = "list-group-item list-group-item-action";
      item.textContent = name;
      item.onclick = () => {
        input.value = name;
        borrarSugerencias();
        input.focus();
      };
      cont.appendChild(item);
    });
    input.parentNode.appendChild(cont);
  }

  function borrarSugerencias() {
    const old = document.getElementById("sugerencias");
    if (old) old.remove();
  }

  form.addEventListener("submit", async e => {
    e.preventDefault();
    borrarSugerencias();
    const valor = input.value.trim().toLowerCase();
    const tipo  = tipoBusqueda.value;
    if (!valor) return;

    try {
      if (tipo === "pokemon") {
        const res  = await fetch(`https://pokeapi.co/api/v2/pokemon/${valor}`);
        if (!res.ok) throw new Error("Pokémon no encontrado");
        const data = await res.json();
        mostrarPokemon(data);

      } else if (tipo === "habilidad") {
        const res  = await fetch(`https://pokeapi.co/api/v2/ability/${valor}`);
        if (!res.ok) throw new Error("Habilidad no encontrada");
        const data = await res.json();
        const pokemons = data.pokemon.map(p => p.pokemon.name).join(", ");
        llenarDetalle({
          nombre: `Pokémon con habilidad "${valor}"`,
          altura: "-",
          peso: "-",
          tipo: pokemons,
          habilidades: "-",
          movimientos: "-",
          imagen: ""
        });

      } else if (tipo === "region") {
        const res  = await fetch(`https://pokeapi.co/api/v2/region/${valor}`);
        if (!res.ok) throw new Error("Región no encontrada");
        const data = await res.json();
        const nombres = data.locations.map(loc => loc.name).join(", ");
        llenarDetalle({
          nombre: `Región: ${data.name}`,
          altura: "-",
          peso: "-",
          tipo: nombres,
          habilidades: "-",
          movimientos: "-",
          imagen: ""
        });
      }

      limpiarBtn.style.display = "inline-block";
    } catch (err) {
      alert(err.message);
    }
  });


  limpiarBtn.addEventListener("click", () => {
    input.value = "";
    llenarDetalle({
      nombre: "", altura: "", peso: "",
      tipo: "", habilidades: "", movimientos: "",
      imagen: "assets/po-removebg-preview.png"
    });
    limpiarBtn.style.display = "none";
    borrarSugerencias();
  });


  function mostrarPokemon(data) {
    llenarDetalle({
      nombre: data.name,
      altura: data.height,
      peso: data.weight,
      tipo: data.types.map(t => t.type.name).join(", "),
      habilidades: data.abilities.map(a => a.ability.name).join(", "),
      movimientos: data.moves.map(m => m.move.name).join(", "),
      imagen: data.sprites.front_default
    });
  }

  function llenarDetalle({ nombre, altura, peso, tipo, habilidades, movimientos, imagen }) {
    document.getElementById("nombre").textContent       = nombre;
    document.getElementById("altura").textContent       = altura;
    document.getElementById("peso").textContent         = peso;
    document.getElementById("tipo").textContent         = tipo;
    document.getElementById("habilidades").textContent  = habilidades;
    document.getElementById("movimientos").textContent  = movimientos;
    document.getElementById("imagen").src               = imagen;
  }
});

