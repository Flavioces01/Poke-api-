document.addEventListener('DOMContentLoaded', () => {
  const selector       = document.getElementById('selector-region');
  const rutasContainer = document.getElementById('rutas-container');


  const areaEncounters = {};

  selector.addEventListener('change', async () => {
    const region = selector.value;
    rutasContainer.innerHTML = '';

    if (!region) return;

    rutasContainer.innerHTML = `<p class="text-center"> Cargando rutas de ${region}...</p>`;

    try {

      const resRegion = await fetch(`https://pokeapi.co/api/v2/region/${region}`);
      const { locations } = await resRegion.json();
      rutasContainer.innerHTML = '';


      for (const loc of locations) {
        const locData = await fetch(loc.url).then(r => r.json());
        for (const area of locData.areas) {
          const areaData = await fetch(area.url).then(r => r.json());
          areaEncounters[area.url] = areaData.pokemon_encounters || [];

          const card = document.createElement('div');
          card.className = 'col';
          card.innerHTML = `
            <div class="card h-100">
              <div class="card-body">
                <h5 class="card-title text-capitalize">
                  ${areaData.name.replace(/-/g, ' ')}
                </h5>
                <button class="btn btn-outline-primary mt-2"
                        data-area="${area.url}">
                  Ver Pokémon
                </button>
                <div class="pokemon-list mt-3 d-none"></div>
              </div>
            </div>`;
          rutasContainer.appendChild(card);
        }
      }


      rutasContainer.addEventListener('click', async e => {
        const btn = e.target;
        if (!btn.matches('button[data-area]')) return;

        const areaUrl = btn.dataset.area;
        const list    = btn.nextElementSibling;

        if (!list.classList.contains('d-none')) {
          list.classList.add('d-none');
          list.innerHTML = '';
          btn.textContent = 'Ver Pokémon';
          return;
        }

        list.innerHTML = '<p>Cargando Pokémon...</p>';
        list.classList.remove('d-none');
        btn.textContent = 'Ocultar Pokémon';


        const encounters = areaEncounters[areaUrl];
        if (!encounters.length) {
          list.innerHTML = '<p class="text-muted">No hay Pokémon salvajes aquí.</p>';
          return;
        }


        const pokemons = await Promise.all(
          encounters.map(async enc => {
            let sprite = '';
            try {
              const pd = await fetch(enc.pokemon.url).then(r => r.json());
              sprite = pd.sprites.front_default || '';
            } catch {  }


            const chances = enc.version_details.map(v => v.max_chance || 0);
            const chance  = Math.max(...chances);

            return {
              name:   enc.pokemon.name,
              sprite,
              chance
            };
          })
        );

     
        list.innerHTML = pokemons.map(p => `
          <div class="d-flex align-items-center gap-3 mb-2">
            ${p.sprite
              ? `<img src="${p.sprite}" alt="${p.name}" width="50" height="50">`
              : ''
            }
            <span class="text-capitalize">${p.name.replace(/-/g, ' ')}</span>
            <span class="badge bg-secondary ms-auto">${p.chance}%</span>
          </div>
        `).join('');
      });

    } catch (err) {
      console.error('Error cargando rutas:', err);
      rutasContainer.innerHTML = '<p class="text-danger">Error al cargar rutas.</p>';
    }
  });
});