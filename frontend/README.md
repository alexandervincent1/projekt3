# Frontend - Beställningssystem

Detta är frontend-delen av beställningssystemet, byggd med vanilla HTML, CSS och JavaScript.

## 📁 Filer

- **index.html** - Huvudsida med alla UI-komponenter
- **styles.css** - All styling och layout
- **app.js** - JavaScript logik för CRUD-operationer och API-kommunikation

## 🚀 Användning

### Öppna frontend

**Alternativ 1: Öppna direkt i webbläsare**
```bash
open index.html
# eller dubbelklicka på index.html
```

**Alternativ 2: Använd en lokal webbserver**
```bash
# Med Python 3
python3 -m http.server 8000

# Med PHP
php -S localhost:8000

# Med Node.js (npm install -g http-server)
http-server -p 8000
```

Öppna sedan http://localhost:8000 i din webbläsare.

## ⚙️ Konfiguration

Frontend kommunicerar med backend på **http://localhost:5222**. 

Om du behöver ändra backend-URL, redigera `API_BASE` i `app.js`:

```javascript
const API_BASE = 'http://localhost:5222/api';
```

## 🔗 API Endpoints

Frontend använder följande endpoints:

- **Customers:** GET/POST/PUT/DELETE `/api/customers`
- **Products:** GET/POST/PUT/DELETE `/api/products`
- **Orders:** GET/POST/PUT/DELETE `/api/orders`
- **OrderItems:** GET/POST/PUT/DELETE `/api/orderitems`

## ✨ Funktioner

### 👥 Kunder
- Visa alla kunder
- Lägg till ny kund
- Redigera befintlig kund
- Ta bort kund

### 📦 Produkter
- Visa alla produkter
- Lägg till ny produkt
- Redigera befintlig produkt (namn, pris, lager)
- Ta bort produkt

### 🛒 Beställningar
- Visa alla beställningar
- Skapa ny beställning med flera produkter
- Visa detaljerad orderinformation
- Uppdatera orderstatus
- Ta bort beställning

## 🎨 Design

- **Modern, ren design** med blå färgpalett
- **Responsiv layout** som fungerar på desktop och mobil
- **Tab-navigation** för enkel övergång mellan sektioner
- **Formulär** med validering
- **Toast-notifikationer** för användarfeedback
- **Hover-effekter** och smooth transitions

## 🔧 Krav

- Webbläsare med JavaScript aktiverat
- Backend måste köra på http://localhost:5222
- CORS måste vara aktiverat på backend
