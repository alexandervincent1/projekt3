// API Base URL
const API_BASE = 'http://localhost:5222/api';

// Toast notification function
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Navigation
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const view = btn.dataset.view;
        
        // Update nav buttons
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update views
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.getElementById(`${view}-view`).classList.add('active');
        
        // Load data for the view
        if (view === 'customers') loadCustomers();
        else if (view === 'products') loadProducts();
        else if (view === 'orders') loadOrders();
    });
});

// ========== CUSTOMERS ==========

async function loadCustomers() {
    try {
        const response = await fetch(`${API_BASE}/customers`);
        const customers = await response.json();
        
        const tbody = document.getElementById('customers-table');
        if (customers.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="loading">Inga kunder ännu</td></tr>';
            return;
        }
        
        tbody.innerHTML = customers.map(c => `
            <tr>
                <td>${c.customerID}</td>
                <td>${c.name}</td>
                <td>${c.email}</td>
                <td>${c.phone}</td>
                <td class="action-btns">
                    <button class="edit-btn" onclick="editCustomer(${c.customerID})">Redigera</button>
                    <button class="delete-btn" onclick="deleteCustomer(${c.customerID})">Ta bort</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading customers:', error);
        showToast('Kunde inte ladda kunder', 'error');
    }
}

function showCustomerForm() {
    document.getElementById('customer-form').style.display = 'block';
    document.getElementById('customer-form-title').textContent = 'Ny Kund';
    document.getElementById('customerForm').reset();
    document.getElementById('customerId').value = '';
}

function cancelCustomerForm() {
    document.getElementById('customer-form').style.display = 'none';
    document.getElementById('customerForm').reset();
}

async function editCustomer(id) {
    try {
        const response = await fetch(`${API_BASE}/customers/${id}`);
        const customer = await response.json();
        
        document.getElementById('customer-form').style.display = 'block';
        document.getElementById('customer-form-title').textContent = 'Redigera Kund';
        document.getElementById('customerId').value = customer.customerID;
        document.getElementById('customerName').value = customer.name;
        document.getElementById('customerEmail').value = customer.email;
        document.getElementById('customerPhone').value = customer.phone;
    } catch (error) {
        console.error('Error loading customer:', error);
        showToast('Kunde inte ladda kund', 'error');
    }
}

async function deleteCustomer(id) {
    if (!confirm('Är du säker på att du vill ta bort denna kund?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/customers/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showToast('Kund borttagen!', 'success');
            loadCustomers();
        } else {
            showToast('Kunde inte ta bort kund', 'error');
        }
    } catch (error) {
        console.error('Error deleting customer:', error);
        showToast('Kunde inte ta bort kund', 'error');
    }
}

document.getElementById('customerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('customerId').value;
    const customer = {
        name: document.getElementById('customerName').value,
        email: document.getElementById('customerEmail').value,
        phone: document.getElementById('customerPhone').value
    };
    
    try {
        const url = id ? `${API_BASE}/customers/${id}` : `${API_BASE}/customers`;
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(customer)
        });
        
        if (response.ok) {
            showToast(id ? 'Kund uppdaterad!' : 'Kund skapad!', 'success');
            cancelCustomerForm();
            loadCustomers();
        } else {
            showToast('Kunde inte spara kund', 'error');
        }
    } catch (error) {
        console.error('Error saving customer:', error);
        showToast('Kunde inte spara kund', 'error');
    }
});

// ========== PRODUCTS ==========

async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE}/products`);
        const products = await response.json();
        
        const tbody = document.getElementById('products-table');
        if (products.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="loading">Inga produkter ännu</td></tr>';
            return;
        }
        
        tbody.innerHTML = products.map(p => `
            <tr>
                <td>${p.productID}</td>
                <td>${p.name}</td>
                <td>${p.price.toFixed(2)} kr</td>
                <td>${p.stock}</td>
                <td class="action-btns">
                    <button class="edit-btn" onclick="editProduct(${p.productID})">Redigera</button>
                    <button class="delete-btn" onclick="deleteProduct(${p.productID})">Ta bort</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading products:', error);
        showToast('Kunde inte ladda produkter', 'error');
    }
}

function showProductForm() {
    document.getElementById('product-form').style.display = 'block';
    document.getElementById('product-form-title').textContent = 'Ny Produkt';
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
}

function cancelProductForm() {
    document.getElementById('product-form').style.display = 'none';
    document.getElementById('productForm').reset();
}

async function editProduct(id) {
    try {
        const response = await fetch(`${API_BASE}/products/${id}`);
        const product = await response.json();
        
        document.getElementById('product-form').style.display = 'block';
        document.getElementById('product-form-title').textContent = 'Redigera Produkt';
        document.getElementById('productId').value = product.productID;
        document.getElementById('productName').value = product.name;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productStock').value = product.stock;
    } catch (error) {
        console.error('Error loading product:', error);
        showToast('Kunde inte ladda produkt', 'error');
    }
}

async function deleteProduct(id) {
    if (!confirm('Är du säker på att du vill ta bort denna produkt?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/products/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showToast('Produkt borttagen!', 'success');
            loadProducts();
        } else {
            showToast('Kunde inte ta bort produkt', 'error');
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        showToast('Kunde inte ta bort produkt', 'error');
    }
}

document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('productId').value;
    const product = {
        name: document.getElementById('productName').value,
        price: parseFloat(document.getElementById('productPrice').value),
        stock: parseInt(document.getElementById('productStock').value)
    };
    
    try {
        const url = id ? `${API_BASE}/products/${id}` : `${API_BASE}/products`;
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        });
        
        if (response.ok) {
            showToast(id ? 'Produkt uppdaterad!' : 'Produkt skapad!', 'success');
            cancelProductForm();
            loadProducts();
        } else {
            showToast('Kunde inte spara produkt', 'error');
        }
    } catch (error) {
        console.error('Error saving product:', error);
        showToast('Kunde inte spara produkt', 'error');
    }
});

// ========== ORDERS ==========

let allProducts = [];
let allCustomers = [];

async function loadOrders() {
    try {
        const response = await fetch(`${API_BASE}/orders`);
        const orders = await response.json();
        
        const tbody = document.getElementById('orders-table');
        if (orders.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="loading">Inga beställningar ännu</td></tr>';
            return;
        }
        
        tbody.innerHTML = orders.map(o => `
            <tr>
                <td>${o.orderID}</td>
                <td>${o.customer ? o.customer.name : 'N/A'}</td>
                <td>${new Date(o.orderDate).toLocaleDateString('sv-SE')}</td>
                <td><span class="status-badge status-${o.status.toLowerCase()}">${o.status}</span></td>
                <td class="action-btns">
                    <button class="view-btn" onclick="viewOrder(${o.orderID})">Visa detaljer</button>
                    <button class="delete-btn" onclick="deleteOrder(${o.orderID})">Ta bort</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading orders:', error);
        showToast('Kunde inte ladda beställningar', 'error');
    }
}

async function showOrderForm() {
    // Load customers and products for dropdowns
    try {
        const [customersRes, productsRes] = await Promise.all([
            fetch(`${API_BASE}/customers`),
            fetch(`${API_BASE}/products`)
        ]);
        
        allCustomers = await customersRes.json();
        allProducts = await productsRes.json();
        
        // Populate customer dropdown
        const customerSelect = document.getElementById('orderCustomerId');
        customerSelect.innerHTML = '<option value="">-- Välj kund --</option>' +
            allCustomers.map(c => `<option value="${c.customerID}">${c.name}</option>`).join('');
        
        // Populate product dropdowns
        updateProductSelects();
        
        document.getElementById('order-form').style.display = 'block';
    } catch (error) {
        console.error('Error loading form data:', error);
        showToast('Kunde inte ladda formulärdata', 'error');
    }
}

function updateProductSelects() {
    const productOptions = '<option value="">-- Välj produkt --</option>' +
        allProducts.map(p => `<option value="${p.productID}">${p.name} (${p.price} kr, Lager: ${p.stock})</option>`).join('');
    
    document.querySelectorAll('.product-select').forEach(select => {
        const currentValue = select.value;
        select.innerHTML = productOptions;
        select.value = currentValue;
    });
}

function addOrderItem() {
    const container = document.getElementById('order-items');
    const newRow = document.createElement('div');
    newRow.className = 'order-item-row';
    newRow.innerHTML = `
        <select class="product-select" required>
            <option value="">-- Välj produkt --</option>
            ${allProducts.map(p => `<option value="${p.productID}">${p.name} (${p.price} kr, Lager: ${p.stock})</option>`).join('')}
        </select>
        <input type="number" class="quantity-input" placeholder="Antal" min="1" value="1" required>
        <button type="button" class="btn btn-small btn-danger" onclick="removeOrderItem(this)">✕</button>
    `;
    container.appendChild(newRow);
}

function removeOrderItem(btn) {
    const rows = document.querySelectorAll('.order-item-row');
    if (rows.length > 1) {
        btn.parentElement.remove();
    } else {
        showToast('Du måste ha minst en produkt', 'error');
    }
}

function cancelOrderForm() {
    document.getElementById('order-form').style.display = 'none';
    document.getElementById('orderForm').reset();
    // Reset to one product row
    const container = document.getElementById('order-items');
    container.innerHTML = `
        <div class="order-item-row">
            <select class="product-select" required>
                <option value="">-- Välj produkt --</option>
            </select>
            <input type="number" class="quantity-input" placeholder="Antal" min="1" value="1" required>
            <button type="button" class="btn btn-small btn-danger" onclick="removeOrderItem(this)">✕</button>
        </div>
    `;
}

document.getElementById('orderForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const customerId = parseInt(document.getElementById('orderCustomerId').value);
    const productRows = document.querySelectorAll('.order-item-row');
    
    const orderItems = [];
    productRows.forEach(row => {
        const productId = parseInt(row.querySelector('.product-select').value);
        const quantity = parseInt(row.querySelector('.quantity-input').value);
        if (productId && quantity) {
            orderItems.push({ 
                productID: productId, 
                orderID: 0,
                quantity: quantity 
            });
        }
    });
    
    if (orderItems.length === 0) {
        showToast('Lägg till minst en produkt', 'error');
        return;
    }
    
    const order = {
        orderID: 0,
        customerID: customerId,
        orderDate: new Date().toISOString(),
        status: 'Pending'
    };
    
    try {
        // First create the order
        const orderResponse = await fetch(`${API_BASE}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order)
        });
        
        if (!orderResponse.ok) {
            const error = await orderResponse.text();
            showToast('Kunde inte skapa beställning: ' + error, 'error');
            return;
        }
        
        const createdOrder = await orderResponse.json();
        
        // Then create order items
        for (const item of orderItems) {
            item.orderID = createdOrder.orderID;
            await fetch(`${API_BASE}/orderitems`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item)
            });
        }
        
        showToast('Beställning skapad!', 'success');
        cancelOrderForm();
        loadOrders();
    } catch (error) {
        console.error('Error creating order:', error);
        showToast('Kunde inte skapa beställning', 'error');
    }
});

async function viewOrder(id) {
    try {
        const response = await fetch(`${API_BASE}/orders/${id}`);
        const order = await response.json();
        
        let details = `Order #${order.orderID}\n`;
        details += `Kund: ${order.customer ? order.customer.name : 'N/A'}\n`;
        details += `Datum: ${new Date(order.orderDate).toLocaleDateString('sv-SE')}\n`;
        details += `Status: ${order.status}\n\n`;
        details += `Produkter:\n`;
        
        if (order.orderItems && order.orderItems.length > 0) {
            order.orderItems.forEach(item => {
                details += `- ${item.product ? item.product.name : 'N/A'} x ${item.quantity}\n`;
            });
        }
        
        alert(details);
    } catch (error) {
        console.error('Error loading order:', error);
        showToast('Kunde inte ladda order', 'error');
    }
}

async function deleteOrder(id) {
    if (!confirm('Är du säker på att du vill ta bort denna beställning?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/orders/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showToast('Beställning borttagen!', 'success');
            loadOrders();
        } else {
            showToast('Kunde inte ta bort beställning', 'error');
        }
    } catch (error) {
        console.error('Error deleting order:', error);
        showToast('Kunde inte ta bort beställning', 'error');
    }
}

// Initial load
loadCustomers();
