// API Base URL
const API_BASE = 'http://localhost:5222/api';

// ==================== NAVIGATION ====================
function showView(viewName) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById(`${viewName}-view`)?.classList.add('active');
    document.querySelector(`[onclick="showView('${viewName}')"]`)?.classList.add('active');
    
    if (viewName === 'customers') loadCustomers();
    if (viewName === 'products') loadProducts();
    if (viewName === 'orders') loadOrders();
}

// ==================== TOAST NOTIFICATIONS ====================
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed; bottom: 20px; right: 20px; padding: 15px 25px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'}; color: white;
        border-radius: 8px; z-index: 1000; animation: fadeIn 0.3s;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ==================== CUSTOMERS ====================
async function loadCustomers() {
    try {
        const response = await fetch(`${API_BASE}/customers`);
        const customers = await response.json();
        
        const list = document.getElementById('customers-list');
        if (!list) return;
        
        if (customers.length === 0) {
            list.innerHTML = '<p class="empty-message">Inga kunder ännu. Lägg till en kund!</p>';
            return;
        }
        
        list.innerHTML = customers.map(c => `
            <div class="card">
                <div class="card-header">
                    <h3>${c.name}</h3>
                    <span class="badge">ID: ${c.customerID}</span>
                </div>
                <div class="card-body">
                    <p>📧 ${c.email}</p>
                    <p>📞 ${c.phone}</p>
                </div>
                <div class="card-actions">
                    <button class="btn btn-secondary btn-small" onclick="editCustomer(${c.customerID})">Redigera</button>
                    <button class="btn btn-danger btn-small" onclick="deleteCustomer(${c.customerID})">Ta bort</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading customers:', error);
        showToast('Kunde inte ladda kunder', 'error');
    }
}

function showCustomerForm(customer = null) {
    const formHtml = `
        <div class="modal-overlay" onclick="closeModal(event)">
            <div class="modal" onclick="event.stopPropagation()">
                <h3>${customer ? 'Redigera Kund' : 'Ny Kund'}</h3>
                <form onsubmit="saveCustomer(event, ${customer?.customerID || 'null'})">
                    <div class="form-group">
                        <label>Namn</label>
                        <input type="text" id="customer-name" value="${customer?.name || ''}" required>
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="customer-email" value="${customer?.email || ''}" required>
                    </div>
                    <div class="form-group">
                        <label>Telefon</label>
                        <input type="tel" id="customer-phone" value="${customer?.phone || ''}" required>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" onclick="closeModal()">Avbryt</button>
                        <button type="submit" class="btn btn-primary">Spara</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', formHtml);
}

async function editCustomer(id) {
    try {
        const response = await fetch(`${API_BASE}/customers/${id}`);
        const customer = await response.json();
        showCustomerForm(customer);
    } catch (error) {
        showToast('Kunde inte ladda kund', 'error');
    }
}

async function saveCustomer(event, id) {
    event.preventDefault();
    
    const customer = {
        name: document.getElementById('customer-name').value,
        email: document.getElementById('customer-email').value,
        phone: document.getElementById('customer-phone').value
    };
    
    try {
        const url = id ? `${API_BASE}/customers/${id}` : `${API_BASE}/customers`;
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(customer)
        });
        
        if (response.ok) {
            closeModal();
            loadCustomers();
            showToast(id ? 'Kund uppdaterad!' : 'Kund skapad!');
        } else {
            throw new Error('Failed to save');
        }
    } catch (error) {
        showToast('Kunde inte spara kund', 'error');
    }
}

async function deleteCustomer(id) {
    console.log('deleteCustomer called with id:', id);
    
    if (!confirm('Är du säker på att du vill ta bort denna kund?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/customers/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            loadCustomers();
            showToast('Kund borttagen!');
        } else {
            const errorText = await response.text();
            throw new Error(errorText);
        }
    } catch (error) {
        console.error('Delete error:', error);
        showToast('Kunde inte ta bort kund: ' + error.message, 'error');
    }
}

// ==================== PRODUCTS ====================
async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE}/products`);
        const products = await response.json();
        
        const list = document.getElementById('products-list');
        if (!list) return;
        
        if (products.length === 0) {
            list.innerHTML = '<p class="empty-message">Inga produkter ännu. Lägg till en produkt!</p>';
            return;
        }
        
        list.innerHTML = products.map(p => `
            <div class="card">
                <div class="card-header">
                    <h3>${p.name}</h3>
                    <span class="badge">ID: ${p.productID}</span>
                </div>
                <div class="card-body">
                    <p>💰 ${p.price.toFixed(2)} kr</p>
                    <p>📦 ${p.stock} i lager</p>
                </div>
                <div class="card-actions">
                    <button class="btn btn-secondary btn-small" onclick="editProduct(${p.productID})">Redigera</button>
                    <button class="btn btn-danger btn-small" onclick="deleteProduct(${p.productID})">Ta bort</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading products:', error);
        showToast('Kunde inte ladda produkter', 'error');
    }
}

function showProductForm(product = null) {
    const formHtml = `
        <div class="modal-overlay" onclick="closeModal(event)">
            <div class="modal" onclick="event.stopPropagation()">
                <h3>${product ? 'Redigera Produkt' : 'Ny Produkt'}</h3>
                <form onsubmit="saveProduct(event, ${product?.productID || 'null'})">
                    <div class="form-group">
                        <label>Produktnamn</label>
                        <input type="text" id="product-name" value="${product?.name || ''}" required>
                    </div>
                    <div class="form-group">
                        <label>Pris (kr)</label>
                        <input type="number" id="product-price" step="0.01" value="${product?.price || ''}" required>
                    </div>
                    <div class="form-group">
                        <label>Lagersaldo</label>
                        <input type="number" id="product-stock" value="${product?.stock || '0'}" required>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" onclick="closeModal()">Avbryt</button>
                        <button type="submit" class="btn btn-primary">Spara</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', formHtml);
}

async function editProduct(id) {
    try {
        const response = await fetch(`${API_BASE}/products/${id}`);
        const product = await response.json();
        showProductForm(product);
    } catch (error) {
        showToast('Kunde inte ladda produkt', 'error');
    }
}

async function saveProduct(event, id) {
    event.preventDefault();
    
    const product = {
        name: document.getElementById('product-name').value,
        price: parseFloat(document.getElementById('product-price').value),
        stock: parseInt(document.getElementById('product-stock').value)
    };
    
    try {
        const url = id ? `${API_BASE}/products/${id}` : `${API_BASE}/products`;
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        });
        
        if (response.ok) {
            closeModal();
            loadProducts();
            showToast(id ? 'Produkt uppdaterad!' : 'Produkt skapad!');
        } else {
            throw new Error('Failed to save');
        }
    } catch (error) {
        showToast('Kunde inte spara produkt', 'error');
    }
}

async function deleteProduct(id) {
    console.log('deleteProduct called with id:', id);
    
    if (!confirm('Är du säker på att du vill ta bort denna produkt?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/products/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            loadProducts();
            showToast('Produkt borttagen!');
        } else {
            const errorText = await response.text();
            throw new Error(errorText);
        }
    } catch (error) {
        console.error('Delete error:', error);
        showToast('Kunde inte ta bort produkt: ' + error.message, 'error');
    }
}

// ==================== ORDERS ====================
async function loadOrders() {
    try {
        const response = await fetch(`${API_BASE}/orders`);
        const orders = await response.json();
        
        const list = document.getElementById('orders-list');
        if (!list) return;
        
        if (orders.length === 0) {
            list.innerHTML = '<p class="empty-message">Inga beställningar ännu. Skapa en beställning!</p>';
            return;
        }
        
        list.innerHTML = orders.map(o => `
            <div class="card">
                <div class="card-header">
                    <h3>Order #${o.orderID}</h3>
                    <span class="badge badge-${o.status?.toLowerCase() || 'pending'}">${o.status || 'Pending'}</span>
                </div>
                <div class="card-body">
                    <p>👤 ${o.customer?.name || 'N/A'}</p>
                    <p>📅 ${new Date(o.orderDate).toLocaleDateString('sv-SE')}</p>
                    <p>📦 ${o.orderItems?.length || 0} produkter</p>
                </div>
                <div class="card-actions">
                    <button class="btn btn-secondary btn-small" onclick="showOrderDetails(${o.orderID})">Visa detaljer</button>
                    <button class="btn btn-danger btn-small" onclick="deleteOrder(${o.orderID})">Ta bort</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading orders:', error);
        showToast('Kunde inte ladda beställningar', 'error');
    }
}

async function showOrderForm() {
    try {
        const [customersRes, productsRes] = await Promise.all([
            fetch(`${API_BASE}/customers`),
            fetch(`${API_BASE}/products`)
        ]);
        
        const customers = await customersRes.json();
        const products = await productsRes.json();
        
        if (customers.length === 0) {
            showToast('Skapa en kund först!', 'error');
            return;
        }
        
        if (products.length === 0) {
            showToast('Skapa en produkt först!', 'error');
            return;
        }
        
        const formHtml = `
            <div class="modal-overlay" onclick="closeModal(event)">
                <div class="modal modal-large" onclick="event.stopPropagation()">
                    <h3>Ny Beställning</h3>
                    <form onsubmit="saveOrder(event)">
                        <div class="form-group">
                            <label>Välj Kund</label>
                            <select id="order-customer" required>
                                <option value="">-- Välj kund --</option>
                                ${customers.map(c => `<option value="${c.customerID}">${c.name} (${c.email})</option>`).join('')}
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label>Produkter</label>
                            <div id="order-items">
                                <div class="order-item-row">
                                    <select class="product-select" required>
                                        <option value="">-- Välj produkt --</option>
                                        ${products.map(p => `<option value="${p.productID}" data-price="${p.price}">${p.name} - ${p.price.toFixed(2)} kr</option>`).join('')}
                                    </select>
                                    <input type="number" class="quantity-input" value="1" min="1" placeholder="Antal">
                                </div>
                            </div>
                            <button type="button" class="btn btn-secondary" onclick="addOrderItemRow()">+ Lägg till produkt</button>
                        </div>
                        
                        <div class="form-actions">
                            <button type="button" class="btn btn-secondary" onclick="closeModal()">Avbryt</button>
                            <button type="submit" class="btn btn-primary">Skapa Beställning</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', formHtml);
    } catch (error) {
        showToast('Kunde inte ladda formulär', 'error');
    }
}

async function addOrderItemRow() {
    try {
        const response = await fetch(`${API_BASE}/products`);
        const products = await response.json();
        
        const row = document.createElement('div');
        row.className = 'order-item-row';
        row.innerHTML = `
            <select class="product-select" required>
                <option value="">-- Välj produkt --</option>
                ${products.map(p => `<option value="${p.productID}" data-price="${p.price}">${p.name} - ${p.price.toFixed(2)} kr</option>`).join('')}
            </select>
            <input type="number" class="quantity-input" value="1" min="1" placeholder="Antal">
            <button type="button" class="btn btn-danger btn-small" onclick="this.parentElement.remove()">✕</button>
        `;
        document.getElementById('order-items').appendChild(row);
    } catch (error) {
        showToast('Kunde inte lägga till rad', 'error');
    }
}

async function saveOrder(event) {
    event.preventDefault();
    
    const customerID = parseInt(document.getElementById('order-customer').value);
    const itemRows = document.querySelectorAll('.order-item-row');
    
    const orderItems = [];
    itemRows.forEach(row => {
        const productID = parseInt(row.querySelector('.product-select').value);
        const quantity = parseInt(row.querySelector('.quantity-input').value);
        if (productID && quantity > 0) {
            orderItems.push({ productID, quantity });
        }
    });
    
    if (orderItems.length === 0) {
        showToast('Lägg till minst en produkt!', 'error');
        return;
    }
    
    try {
        // Skapa order först
        const orderResponse = await fetch(`${API_BASE}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                customerID,
                orderDate: new Date().toISOString(),
                status: 'Pending'
            })
        });
        
        if (!orderResponse.ok) {
            throw new Error('Kunde inte skapa order');
        }
        
        const order = await orderResponse.json();
        
        // Skapa order items
        for (const item of orderItems) {
            await fetch(`${API_BASE}/orderitems`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderID: order.orderID,
                    productID: item.productID,
                    quantity: item.quantity
                })
            });
        }
        
        closeModal();
        loadOrders();
        showToast('Beställning skapad!');
    } catch (error) {
        console.error('Error saving order:', error);
        showToast('Kunde inte skapa beställning: ' + error.message, 'error');
    }
}

async function showOrderDetails(id) {
    try {
        const response = await fetch(`${API_BASE}/orders/${id}`);
        const order = await response.json();
        
        const itemsList = order.orderItems?.map(item => `
            <tr>
                <td>${item.product?.name || 'N/A'}</td>
                <td>${item.quantity}</td>
                <td>${item.product?.price?.toFixed(2) || '0.00'} kr</td>
                <td>${((item.product?.price || 0) * item.quantity).toFixed(2)} kr</td>
            </tr>
        `).join('') || '<tr><td colspan="4">Inga produkter</td></tr>';
        
        const total = order.orderItems?.reduce((sum, item) => 
            sum + ((item.product?.price || 0) * item.quantity), 0) || 0;
        
        const detailsHtml = `
            <div class="modal-overlay" onclick="closeModal(event)">
                <div class="modal modal-large" onclick="event.stopPropagation()">
                    <h3>Order #${order.orderID}</h3>
                    <div class="order-details">
                        <p><strong>Kund:</strong> ${order.customer?.name || 'N/A'}</p>
                        <p><strong>Email:</strong> ${order.customer?.email || 'N/A'}</p>
                        <p><strong>Datum:</strong> ${new Date(order.orderDate).toLocaleDateString('sv-SE')}</p>
                        <p><strong>Status:</strong> ${order.status || 'Pending'}</p>
                        
                        <h4>Produkter:</h4>
                        <table class="details-table">
                            <thead>
                                <tr>
                                    <th>Produkt</th>
                                    <th>Antal</th>
                                    <th>Styckpris</th>
                                    <th>Summa</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${itemsList}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="3"><strong>Totalt:</strong></td>
                                    <td><strong>${total.toFixed(2)} kr</strong></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    <div class="form-actions">
                        <button class="btn btn-secondary" onclick="closeModal()">Stäng</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', detailsHtml);
    } catch (error) {
        console.error('Error loading order details:', error);
        showToast('Kunde inte ladda orderdetaljer', 'error');
    }
}

async function deleteOrder(id) {
    console.log('deleteOrder called with id:', id);
    
    if (!confirm('Är du säker på att du vill ta bort denna beställning?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/orders/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            loadOrders();
            showToast('Beställning borttagen!');
        } else {
            const errorText = await response.text();
            throw new Error(errorText);
        }
    } catch (error) {
        console.error('Delete error:', error);
        showToast('Kunde inte ta bort beställning: ' + error.message, 'error');
    }
}

// ==================== UTILITIES ====================
function closeModal(event) {
    if (!event || event.target.classList.contains('modal-overlay')) {
        document.querySelector('.modal-overlay')?.remove();
    }
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('App initialized');
    showView('customers');
});
