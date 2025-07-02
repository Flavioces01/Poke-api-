document.addEventListener('DOMContentLoaded', () => {
    const itemContainer = document.getElementById('itemcontainer');
    const paginacionContainer = document.getElementById('paginacion');

    const endpoints = {

      
        'ver-todos': 'https://pokeapi.co/api/v2/item?limit=1200',
        'normal': 'https://pokeapi.co/api/v2/item-category/medicine',
        'bayas': 'https://pokeapi.co/api/v2/berry/',
        'mtmo': 'https://pokeapi.co/api/v2/machine/'

        
        
    };

    let cantItems = [];
    let itemsPorPag = 21;
    let cntpPag = 1;

    function crearCard(info) {
        if (!info || typeof info !== 'object') {
            console.error('Información del ítem no válida:', info);
            return '<div class="col"><div class="card h-100"><div class="card-body"><p class="text-danger">Ítem no disponible.</p></div></div></div>';
        }

        const nameEs = info.names && Array.isArray(info.names) 
            ? info.names.find(n => n.language.name === 'es')?.name || info.name || 'Nombre no disponible' 
            : 'Nombre no disponible';

        const effectEs = info.effect_entries && Array.isArray(info.effect_entries) 
            ? info.effect_entries[0]?.short_effect || 'Sin descripción' 
            : 'Sin descripción';

        const imgUrl = info.sprites?.default || '';

        return `
          <div class="col">
            <div class="card h-100">
              ${imgUrl ? `<img src="${imgUrl}" class="card-img-top" alt="${nameEs}">` : ''}
              <div class="card-body">
                <h5 class="card-title">${nameEs}</h5>
                <p class="card-text">${effectEs}</p>
              </div>
            </div>
          </div>`;
    }

    function mostrarPagina(pagina) {
        const inicio = (pagina - 1) * itemsPorPag;
        const fin = inicio + itemsPorPag;
        const itemsPagina = cantItems.slice(inicio, fin);

        itemContainer.innerHTML = itemsPagina.map(info => crearCard(info)).join('');
        generarControlesPaginacion(pagina);
    }

    function generarControlesPaginacion(pagina) {
        const totalPaginas = Math.ceil(cantItems.length / itemsPorPag);
        paginacionContainer.innerHTML = '';

        if (pagina > 1) {
            const prevBtn = crearBoton('Anterior', () => {
                cntpPag--;
                mostrarPagina(cntpPag);
            });
            paginacionContainer.appendChild(prevBtn);
        }

        const startPage = Math.max(1, pagina - 2);
        const endPage = Math.min(totalPaginas, pagina + 2);

        for (let i = startPage; i <= endPage; i++) {
            const btn = crearBoton(i, () => {
                cntpPag = i;
                mostrarPagina(cntpPag);
            }, i === pagina);
            paginacionContainer.appendChild(btn);
        }

        if (pagina < totalPaginas) {
            const nextBtn = crearBoton('Siguiente', () => {
                cntpPag++;
                mostrarPagina(cntpPag);
            });
            paginacionContainer.appendChild(nextBtn);
        }
    }

    function crearBoton(texto, accion, activo = false) {
        const btn = document.createElement('button');
        btn.textContent = texto;
        btn.className = `btn ${activo ? 'btn-dark' : 'btn-outline-dark'} mx-1 my-1`;
        btn.onclick = accion;
        return btn;
    }

    async function fetchAndDisplay(endpoint) {
        itemContainer.innerHTML = '<p>Cargando...</p>';
        paginacionContainer.innerHTML = '';
        const urls = Array.isArray(endpoint) ? endpoint : [endpoint];

        try {
            const datas = await Promise.all(urls.map(url => fetch(url).then(r => r.json())));
            let lista = datas.flatMap(data => data.items || data.results || []);
            lista = Array.from(new Map(lista.map(i => [i.name, i])).values());

         
            if (lista.length === 0) {
                itemContainer.innerHTML = '<p class="text-danger">No se encontraron ítems.</p>';
                return;
            }

      
            cantItems = await Promise.all(lista.map(async item => {
                try {
                    const response = await fetch(item.url);
                    if (!response.ok) {
                        throw new Error('Error en la respuesta de la API');
                    }
                    return await response.json();
                } catch (error) {
                    console.error('Error al obtener el ítem:', error);
                    return null; // Retornar null si hay un error
                }
            }));

            cantItems = cantItems.filter(item => item !== null);


            if (cantItems.length === 0) {
                itemContainer.innerHTML = '<p class="text-danger">No se encontraron ítems.</p>';
                return;
            }

            cntpPag = 1;
            mostrarPagina(cntpPag);
        } catch (err) {
            console.error('Error cargando ítems:', err);
            itemContainer.innerHTML = '<p class="text-danger">Ocurrió un error al cargar los ítems. Por favor, inténtelo de nuevo más tarde.</p>';
        }
    }

    Object.entries(endpoints).forEach(([id, endpoint]) => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.btn-header').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                fetchAndDisplay(endpoint);
            });
        }
    });
});
