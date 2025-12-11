# Beställningssystem - Projekt 3

Ett komplett beställningssystem byggt med C#, ASP.NET Core, MySQL och vanilla JavaScript.

## 📋 Projektbeskrivning

Detta är ett litet e-handelssystem där en butiksägare kan hantera kunder, produkter och beställningar. Systemet implementerar full CRUD (Create, Read, Update, Delete) funktionalitet för alla entiteter.

## 🏗️ Teknisk Stack

### Backend
- **C# / .NET 9.0** - Programmeringsspråk och ramverk
- **ASP.NET Core** - Web API
- **Entity Framework Core 9.0** - ORM för databasåtkomst
- **MySQL 8.0** - Relationsdatabas
- **Pomelo.EntityFrameworkCore.MySql** - MySQL provider

### Frontend
- **HTML5** - Struktur
- **CSS3** - Design och layout
- **Vanilla JavaScript** - Logik och API-kommunikation
- **Fetch API** - HTTP-requests

### Verktyg
- **Docker & Docker Compose** - MySQL containerisering
- **EF Core Migrations** - Databasschema-hantering

## 📊 Databasdesign (Normaliserad till 3NF)

### Tabeller

#### **Customers**
- `CustomerID` (PK, AUTO_INCREMENT)
- `Name` (VARCHAR, NOT NULL)
- `Email` (VARCHAR, NOT NULL)
- `Phone` (VARCHAR, NOT NULL)

#### **Products**
- `ProductID` (PK, AUTO_INCREMENT)
- `Name` (VARCHAR, NOT NULL)
- `Price` (DECIMAL, NOT NULL)
- `Stock` (INT, NOT NULL)

#### **Orders**
- `OrderID` (PK, AUTO_INCREMENT)
- `CustomerID` (FK → Customers, NOT NULL)
- `OrderDate` (DATETIME, NOT NULL)
- `Status` (VARCHAR, DEFAULT 'Pending')

#### **OrderItems** (Kopplingstabell)
- `OrderItemID` (PK, AUTO_INCREMENT)
- `OrderID` (FK → Orders, NOT NULL)
- `ProductID` (FK → Products, NOT NULL)
- `Quantity` (INT, NOT NULL)

### Normalisering

**1NF (First Normal Form):**
- Alla kolumner innehåller atomära värden
- Varje rad är unik (primärnycklar)

**2NF (Second Normal Form):**
- Uppfyller 1NF
- Inga partiella beroenden - alla icke-nyckelattribut beror på hela primärnyckeln

**3NF (Third Normal Form):**
- Uppfyller 2NF
- Inga transitiva beroenden - `OrderItems` lagrar endast ID:n, inte duplikerad produktinfo
- Priser lagras i `Products`, inte i `OrderItems` (för enkelhetens skull i detta projekt)

### Relationer

- **Customers ↔ Orders**: 1-till-många (en kund kan ha många ordrar)
- **Orders ↔ OrderItems**: 1-till-många (en order kan ha många produkter)
- **Products ↔ OrderItems**: 1-till-många (en produkt kan finnas i många ordrar)
- **Orders ↔ Products**: Många-till-många via `OrderItems` (kopplingstabell)

## 🎯 OOP-Klasser (C#)

### `Customer.cs`
```csharp
public class Customer {
    public int CustomerID { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    
    public ICollection<Order> Orders { get; set; }
}
```

### `Product.cs`
```csharp
public class Product {
    public int ProductID { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
    public int Stock { get; set; }
    
    public ICollection<OrderItem> OrderItems { get; set; }
}
```

### `Order.cs`
```csharp
public class Order {
    public int OrderID { get; set; }
    public int CustomerID { get; set; }
    public DateTime OrderDate { get; set; }
    public string Status { get; set; }
    
    public Customer? Customer { get; set; }
    public ICollection<OrderItem> OrderItems { get; set; }
}
```

### `OrderItem.cs`
```csharp
public class OrderItem {
    public int OrderItemID { get; set; }
    public int OrderID { get; set; }
    public int ProductID { get; set; }
    public int Quantity { get; set; }
    
    public Order? Order { get; set; }
    public Product? Product { get; set; }
}
```

## 🚀 Installation och Körning

### Förutsättningar
- .NET 9.0 SDK
- Docker Desktop
- Git

### Steg 1: Klona projektet
```bash
git clone https://github.com/alexandervincent1/projekt3.git
cd projekt3
```

### Steg 2: Starta MySQL-databasen
```bash
# Skapa .env fil med databaskonfiguration
echo "MYSQL_ROOT_PASSWORD=rootpassword" > .env
echo "MYSQL_DATABASE=BestallningsSystem" >> .env
echo "MYSQL_USER=myuser" >> .env
echo "MYSQL_PASSWORD=mypassword" >> .env

# Starta MySQL container
docker compose up -d
```

### Steg 3: Kör migrations (Skapa tabeller)
```bash
cd backend
dotnet tool install --global dotnet-ef --version 9.0.0
export PATH="$PATH:$HOME/.dotnet/tools"
dotnet ef migrations add Initial
dotnet ef database update
```

### Steg 4: Starta backend
```bash
cd backend
dotnet build
dotnet run
```

Backend startar på: **http://localhost:5222**

### Steg 5: Öppna i webbläsare
Öppna http://localhost:5222 i din webbläsare.

## 📱 Användning

### Kunder (Customers)
1. Klicka på "👥 Kunder"
2. Klicka "Lägg till Kund"
3. Fyll i namn, email och telefon
4. Spara

### Produkter (Products)
1. Klicka på "📦 Produkter"
2. Klicka "Lägg till Produkt"
3. Fyll i produktnamn, pris och lagersaldo
4. Spara

### Beställningar (Orders)
1. **Skapa kunder och produkter först!**
2. Klicka på "🛍️ Beställningar"
3. Klicka "Ny Beställning"
4. Välj kund från dropdown
5. Välj produkt(er) och antal
6. Klicka "+ Lägg till produkt" för fler produkter
7. Skapa beställning

## 🔌 API Endpoints

### Customers
- `GET /api/customers` - Hämta alla kunder
- `GET /api/customers/{id}` - Hämta en kund
- `POST /api/customers` - Skapa ny kund
- `PUT /api/customers/{id}` - Uppdatera kund
- `DELETE /api/customers/{id}` - Ta bort kund

### Products
- `GET /api/products` - Hämta alla produkter
- `GET /api/products/{id}` - Hämta en produkt
- `POST /api/products` - Skapa ny produkt
- `PUT /api/products/{id}` - Uppdatera produkt
- `DELETE /api/products/{id}` - Ta bort produkt

### Orders
- `GET /api/orders` - Hämta alla ordrar (inkl. kund och orderitems)
- `GET /api/orders/{id}` - Hämta en order
- `POST /api/orders` - Skapa ny order
- `PUT /api/orders/{id}` - Uppdatera order status
- `DELETE /api/orders/{id}` - Ta bort order

### OrderItems
- `GET /api/orderitems` - Hämta alla orderitems
- `GET /api/orderitems/{id}` - Hämta ett orderitem
- `POST /api/orderitems` - Skapa nytt orderitem
- `PUT /api/orderitems/{id}` - Uppdatera orderitem
- `DELETE /api/orderitems/{id}` - Ta bort orderitem

## 📁 Projektstruktur

```
projekt3/
├── backend/
│   ├── controllers/          # API Controllers
│   │   ├── Customerscontroller.cs
│   │   ├── Productscontroller.cs
│   │   ├── Orderscontroller.cs
│   │   └── Ordersitemscontroller.cs
│   ├── data/
│   │   └── Dbcontext.cs      # Entity Framework DbContext
│   ├── models/               # C# Klasser (OOP)
│   │   ├── Customer.cs
│   │   ├── Product.cs
│   │   ├── Order.cs
│   │   └── Orderitem.cs
│   ├── Migrations/           # EF Core Migrations
│   ├── wwwroot/              # Frontend filer
│   │   ├── index.html
│   │   ├── styles.css
│   │   └── app.js
│   ├── Program.cs            # Backend konfiguration
│   ├── appsettings.json      # Connection string
│   └── backend.csproj        # NuGet packages
├── docker-compose.yaml       # MySQL container
├── .env                      # Databas credentials
└── README.md                 # Detta dokument
```

## 🎓 Uppfyllda Krav (Enligt Projektkrav)

### ✅ C# och OOP
- 4 klasser: `Customer`, `Product`, `Order`, `OrderItem`
- Egenskaper (Properties) för alla attribut
- Navigation Properties för relationer
- Objektorienterad design

### ✅ SQL och Normalisering
- 4 normaliserade tabeller (3NF)
- Primärnycklar (AUTO_INCREMENT)
- Främmande nycklar för relationer
- Kopplingstabell (`OrderItems`) för M-N-relation

### ✅ CRUD-operationer
- **Create**: Skapa kunder, produkter och ordrar
- **Read**: Lista och visa detaljer
- **Update**: Redigera kunder, produkter och orderstatus
- **Delete**: Ta bort kunder, produkter och ordrar

### ✅ Gränssnitt
- Modern webb-UI med navigation
- Responsiv design
- Användarfeedback (toast notifications)
- Formulärvalidering

## 🔧 Tekniska Detaljer

### Connection String
Finns i `backend/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=3306;Database=BestallningsSystem;User=myuser;Password=mypassword;"
  }
}
```

### CORS
Tillåter alla origins för utveckling (ändra för produktion):
```csharp
builder.Services.AddCors(p => 
    p.AddDefaultPolicy(b => 
        b.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));
```

## 🐛 Felsökning

### Port redan används
```bash
# Hitta process på port 5222
lsof -iTCP:5222 -sTCP:LISTEN

# Döda processen
kill <PID>
```

### Databasanslutning misslyckas
```bash
# Kontrollera att MySQL körs
docker compose ps

# Se loggar
docker compose logs projekt3-db
```

### Frontend laddas inte
Kontrollera att `wwwroot` mappen finns och innehåller filerna.

## 📝 Framtida Förbättringar
- Autentisering och auktorisering
- Lagersaldo minskas automatiskt vid beställning
- Beräkna totalpris för ordrar
- Sökfunktion
- Sortering och filtrering
- Admin-panel
- Orderhistorik för kunder

## 👤 Författare
Alexander Vincent

## 📅 Datum
December 2025

## 📜 Licens
Detta projekt är skapat för utbildningssyfte (TE4 - Projekt 3).
