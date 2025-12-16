# Backend - Beställningssystem API

Detta är backend-delen av beställningssystemet, byggd med C# och ASP.NET Core Web API.

## 📁 Struktur

```
backend/
├── controllers/          # API Controllers
│   ├── Customerscontroller.cs
│   ├── Productscontroller.cs
│   ├── Orderscontroller.cs
│   └── Ordersitemscontroller.cs
├── data/                 # Database Context
│   └── Dbcontext.cs
├── models/               # C# Entity Models
│   ├── Customer.cs
│   ├── Product.cs
│   ├── Order.cs
│   └── Orderitem.cs
├── Migrations/           # EF Core Migrations
├── Properties/
│   └── launchSettings.json
├── sql/                  # SQL Schema
├── Program.cs            # Application configuration
├── appsettings.json      # Configuration
└── backend.csproj        # NuGet packages
```

## 🔧 Teknologier

- **C# / .NET 9.0**
- **ASP.NET Core Web API**
- **Entity Framework Core 9.0**
- **MySQL 8.0** (via Pomelo provider)
- **Docker** (för MySQL container)

## 🚀 Installation

### 1. Förutsättningar
- .NET 9.0 SDK
- Docker Desktop (för MySQL)
- dotnet-ef CLI tool

### 2. Installera EF Core Tools
```bash
dotnet tool install --global dotnet-ef --version 9.0.0
export PATH="$PATH:$HOME/.dotnet/tools"
```

### 3. Starta MySQL Database
```bash
cd ..  # Gå till projekt-root
docker compose up -d
```

### 4. Kör Migrations
```bash
dotnet ef migrations add Initial
dotnet ef database update
```

### 5. Starta Backend
```bash
dotnet build
dotnet run
```

Backend kommer att köra på **http://localhost:5222**

## 📡 API Endpoints

### Customers
- `GET /api/customers` - Hämta alla kunder
- `GET /api/customers/{id}` - Hämta specifik kund
- `POST /api/customers` - Skapa ny kund
- `PUT /api/customers/{id}` - Uppdatera kund
- `DELETE /api/customers/{id}` - Ta bort kund

### Products
- `GET /api/products` - Hämta alla produkter
- `GET /api/products/{id}` - Hämta specifik produkt
- `POST /api/products` - Skapa ny produkt
- `PUT /api/products/{id}` - Uppdatera produkt
- `DELETE /api/products/{id}` - Ta bort produkt

### Orders
- `GET /api/orders` - Hämta alla orders (med Customer och OrderItems)
- `GET /api/orders/{id}` - Hämta specifik order
- `POST /api/orders` - Skapa ny order
- `PUT /api/orders/{id}` - Uppdatera order
- `DELETE /api/orders/{id}` - Ta bort order

### OrderItems
- `GET /api/orderitems` - Hämta alla orderrader
- `GET /api/orderitems/{id}` - Hämta specifik orderrad
- `POST /api/orderitems` - Skapa ny orderrad
- `PUT /api/orderitems/{id}` - Uppdatera orderrad
- `DELETE /api/orderitems/{id}` - Ta bort orderrad

## 🗄️ Database

Backend använder MySQL med följande connection string (definierad i `appsettings.json`):

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Port=3306;Database=BestallningsSystem;User=myuser;Password=mypassword;"
}
```

### Tabeller
- **Customers** - Kundinformation
- **Products** - Produktkatalog
- **Orders** - Beställningar
- **OrderItems** - Orderrader (kopplingstabell)

## 🔒 CORS

Backend har CORS aktiverat för att tillåta frontend att kommunicera:

```csharp
builder.Services.AddCors(p => 
    p.AddDefaultPolicy(b => 
        b.AllowAnyOrigin()
         .AllowAnyMethod()
         .AllowAnyHeader()
    )
);
```

## 🔄 Circular Reference Handling

Backend använder `ReferenceHandler.IgnoreCycles` för att hantera cirkulära referenser i JSON-serialisering:

```csharp
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = 
            System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });
```

## 📊 Entity Framework

### Include Related Data
Controllers använder `.Include()` och `.ThenInclude()` för eager loading:

```csharp
// Orders controller
_context.Orders
    .Include(o => o.Customer)
    .Include(o => o.OrderItems)
        .ThenInclude(oi => oi.Product)
    .ToList();
```

### Migrations
Skapa ny migration:
```bash
dotnet ef migrations add MigrationName
```

Uppdatera databas:
```bash
dotnet ef database update
```

Ta bort senaste migration:
```bash
dotnet ef migrations remove
```

## 🐛 Debugging

### Visa Logs
```bash
tail -f /tmp/backend.log
```

### Testa API Endpoints
```bash
# Hämta alla kunder
curl http://localhost:5222/api/customers

# Skapa ny kund
curl -X POST http://localhost:5222/api/customers \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","phone":"0701234567"}'
```

### Kolla vilken port som används
```bash
lsof -ti :5222
```

### Stoppa backend
```bash
lsof -ti :5222 | xargs kill -9
```

## 📦 NuGet Packages

- `Microsoft.EntityFrameworkCore` (9.0.0)
- `Microsoft.EntityFrameworkCore.Design` (9.0.0)
- `Pomelo.EntityFrameworkCore.MySql` (9.0.0)
