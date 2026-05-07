// app.js - Funcionalidad dinámica para Calzado Pro

// Datos iniciales para inventario (si no hay en localStorage)
const defaultInventory = [
    { material: 'Cuero Negro', stock: '45 Metros', estado: 'Disponible' },
    { material: 'Suelas Goma', stock: '12 Pares', estado: 'Crítico' },
    { material: 'Pegamento Industrial', stock: '8 Litros', estado: 'Disponible' },
    { material: 'Hilos Nylon', stock: '2 Bobinas', estado: 'Agotado' }
];

// Función para obtener datos del inventario
function getInventoryData() {
    const stored = localStorage.getItem('calzadoInventory');
    return stored ? JSON.parse(stored) : defaultInventory;
}

// Función para guardar datos del inventario
function saveInventoryData(data) {
    localStorage.setItem('calzadoInventory', JSON.stringify(data));
}

// Función para renderizar la tabla de inventario
function renderInventoryTable() {
    const data = getInventoryData();
    const tbody = document.querySelector('#inventoryTable tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    data.forEach((item, index) => {
        const row = document.createElement('tr');

        // Determinar clase del badge según estado
        const badgeClass = item.estado === 'Disponible' ? 'bg-success' :
                          item.estado === 'Crítico' ? 'bg-warning text-dark' : 'bg-danger';

        row.innerHTML = `
            <td>${item.material}</td>
            <td>${item.stock}</td>
            <td><span class="badge ${badgeClass}">${item.estado}</span></td>
            <td>
                <button class="btn btn-primary btn-sm edit-btn" data-index="${index}">Editar</button>
                <button class="btn btn-danger btn-sm delete-btn" data-index="${index}">Borrar</button>
            </td>
        `;

        tbody.appendChild(row);
    });

    // Agregar event listeners a los botones
    addInventoryEventListeners();
}

// Función para agregar event listeners a la tabla de inventario
function addInventoryEventListeners() {
    // Botones de editar
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            editInventoryItem(index);
        });
    });

    // Botones de borrar
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            deleteInventoryItem(index);
        });
    });

    // Botón de agregar material
    const addBtn = document.querySelector('#addMaterialBtn');
    if (addBtn) {
        addBtn.addEventListener('click', showAddMaterialModal);
    }

    // Búsqueda
    const searchInput = document.querySelector('#searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', filterInventory);
    }
}

// Función para editar un item del inventario
function editInventoryItem(index) {
    const data = getInventoryData();
    const item = data[index];

    const newMaterial = prompt('Nuevo material:', item.material);
    const newStock = prompt('Nuevo stock:', item.stock);
    const newEstado = prompt('Nuevo estado (Disponible/Crítico/Agotado):', item.estado);

    if (newMaterial && newStock && newEstado) {
        data[index] = { material: newMaterial, stock: newStock, estado: newEstado };
        saveInventoryData(data);
        renderInventoryTable();
    }
}

// Función para eliminar un item del inventario
function deleteInventoryItem(index) {
    if (confirm('¿Estás seguro de que quieres eliminar este material?')) {
        const data = getInventoryData();
        data.splice(index, 1);
        saveInventoryData(data);
        renderInventoryTable();
    }
}

// Función para mostrar modal de agregar material (simulado con prompt)
function showAddMaterialModal() {
    const material = prompt('Nombre del material:');
    const stock = prompt('Stock:');
    const estado = prompt('Estado (Disponible/Crítico/Agotado):');

    if (material && stock && estado) {
        const data = getInventoryData();
        data.push({ material, stock, estado });
        saveInventoryData(data);
        renderInventoryTable();
    }
}

// Función para filtrar inventario
function filterInventory() {
    const searchTerm = document.querySelector('#searchInput').value.toLowerCase();
    const data = getInventoryData();
    const filtered = data.filter(item =>
        item.material.toLowerCase().includes(searchTerm) ||
        item.estado.toLowerCase().includes(searchTerm)
    );

    const tbody = document.querySelector('#inventoryTable tbody');
    tbody.innerHTML = '';

    filtered.forEach((item, index) => {
        const badgeClass = item.estado === 'Disponible' ? 'bg-success' :
                          item.estado === 'Crítico' ? 'bg-warning text-dark' : 'bg-danger';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.material}</td>
            <td>${item.stock}</td>
            <td><span class="badge ${badgeClass}">${item.estado}</span></td>
            <td>
                <button class="btn btn-primary btn-sm edit-btn" data-index="${index}">Editar</button>
                <button class="btn btn-danger btn-sm delete-btn" data-index="${index}">Borrar</button>
            </td>
        `;
        tbody.appendChild(row);
    });

    addInventoryEventListeners();
}

// Función para actualizar saludo dinámico en index.html
function updateGreeting() {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Buenos días" : hour < 18 ? "Buenas tardes" : "Buenas noches";
    const h1 = document.querySelector('h1.display-5');
    if (h1) {
        h1.textContent = `${greeting}, Harold`;
    }
}

// Función para mostrar estadísticas rápidas en index.html
function showQuickStats() {
    const inventoryData = getInventoryData();
    const totalMaterials = inventoryData.length;
    const criticalCount = inventoryData.filter(item => item.estado === 'Crítico').length;
    const availableCount = inventoryData.filter(item => item.estado === 'Disponible').length;

    // Crear elementos de estadísticas si no existen
    let statsContainer = document.querySelector('#quickStats');
    if (!statsContainer) {
        statsContainer = document.createElement('div');
        statsContainer.id = 'quickStats';
        statsContainer.className = 'row mb-4';
        statsContainer.innerHTML = `
            <div class="col-md-4">
                <div class="card text-center">
                    <div class="card-body">
                        <h5 class="card-title">Total Materiales</h5>
                        <p class="card-text display-4" id="totalMaterials">${totalMaterials}</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card text-center">
                    <div class="card-body">
                        <h5 class="card-title">Críticos</h5>
                        <p class="card-text display-4 text-warning" id="criticalCount">${criticalCount}</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card text-center">
                    <div class="card-body">
                        <h5 class="card-title">Disponibles</h5>
                        <p class="card-text display-4 text-success" id="availableCount">${availableCount}</p>
                    </div>
                </div>
            </div>
        `;
        const main = document.querySelector('main .container .row.mb-4');
        if (main) {
            main.parentNode.insertBefore(statsContainer, main);
        }
    } else {
        document.querySelector('#totalMaterials').textContent = totalMaterials;
        document.querySelector('#criticalCount').textContent = criticalCount;
        document.querySelector('#availableCount').textContent = availableCount;
    }
}

// Función para agregar efectos a las tarjetas
function addCardEffects() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.05)';
            card.style.transition = 'transform 0.3s';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1)';
        });
    });
}

// Función de inicialización
function init() {
    // Para index.html
    if (document.querySelector('h1.display-5')) {
        updateGreeting();
        showQuickStats();
        addCardEffects();
    }

    // Para inventario.html
    if (document.querySelector('#inventoryTable')) {
        renderInventoryTable();
    }
}

// Ejecutar inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);