# 🏘️ Million Property — Prueba Técnica

Prueba técnica para el puesto de **SR FRONTEND DEVELOPER** — Proyecto **Million Property**.

---

## 🧱 Estructura del proyecto

```
/
├── Backend/               # Contiene la solución .NET (API, lógica de negocio, tests, etc.)
├── frontend/              # Contiene la aplicación Next.js (páginas, componentes, etc.)
├── data/                  # Archivos JSON para importación manual (usados con mongoimport)
└── docker-compose.yml     # Define los servicios Docker para backend y base de datos
```

---

## ⚙️ Instalación y ejecución

Puedes ejecutar el proyecto de dos formas:
1. 🐳 **Automática con Docker Compose**
2. 🧩 **Manual (sin Docker)**

---

### 🐳 Opción 1: Instalación automática con Docker Compose

#### 1. Clonar el repositorio
```
git clone "https://github.com/StivenTC/million-property-technical-test.git"
cd million-property-technical-test
```

#### 2. Levantar los contenedores
```
docker-compose up -d
```

Esto levantará los siguientes servicios:
- **Backend (.NET API):** puerto \`8080\`
- **MongoDB (Base de datos):** puerto \`27017\`

#### 3. Importar datos de ejemplo (opcional)
Si la base de datos no se pobló automáticamente, ejecuta el siguiente script (en Windows):
```
./import-data.bat
```

#### 4. Acceder a las aplicaciones
- **Backend API:** [http://localhost:8080/swagger](http://localhost:8080/swagger)

> 💡 *El frontend debe ejecutarse por separado (ver Opción 2).*

#### 5. Ejecutar el frontend
```
cd ../../Frontend
npm install
npm run dev
```
La aplicación estará disponible en:  
👉 [http://localhost:3000](http://localhost:3000)

---

### 🧩 Opción 2: Instalación manual

#### 1. Clonar el repositorio
```
git clone "https://github.com/StivenTC/million-property-technical-test.git"
cd million-property-technical-test
```

#### 2. Levantar la base de datos MongoDB
Si tienes Docker instalado:
```
docker run -d -p 27017:27017 --name mongo_test mongo
```

#### 3. Importar los datos de ejemplo
Los datos están en la carpeta \`/data\`.  
Usa los siguientes comandos para importarlos (ajusta la cadena de conexión si es necesario):

```
mongoimport --uri "mongodb://localhost:27017" --db MillionRealEstate --collection Owner --file ./data/Owner.json --jsonArray
mongoimport --uri "mongodb://localhost:27017" --db MillionRealEstate --collection Property --file ./data/Property.json --jsonArray
mongoimport --uri "mongodb://localhost:27017" --db MillionRealEstate --collection PropertyImage --file ./data/PropertyImage.json --jsonArray
mongoimport --uri "mongodb://localhost:27017" --db MillionRealEstate --collection PropertyTrace --file ./data/PropertyTrace.json --jsonArray
```

#### 4. Configurar el backend
Edita \`Backend/API/appsettings.json\` para incluir la cadena de conexión correcta en \`MongoDatabaseSettings\`:

```json
{
  "ConnectionString": "mongodb://localhost:27017",
  "DatabaseName": "MillionRealEstate"
}
```

#### 5. Ejecutar el backend
```
cd Backend/API
dotnet run
```
El API estará disponible en el puerto indicado por la consola (por ejemplo: \`http://localhost:8080/swagger\`).

#### 6. Ejecutar el frontend
```
cd ../../Frontend
npm install
npm run dev
```
La aplicación estará disponible en:  
👉 [http://localhost:3000](http://localhost:3000)

---

## 🧠 Tecnologías utilizadas

### Backend
- **.NET 8**
- **MongoDB**
- **Swagger** — Documentación interactiva de la API  
- **NUnit & Moq** — Pruebas unitarias

### Frontend
- **React**
- **Next.js 15 (App Router)**

### Infraestructura
- **Docker & Docker Compose**

---

## 🧰 Endpoints principales

| Método | Ruta | Descripción |
|:-------|:-----|:-------------|
| GET | \`/api/properties\` | Lista todas las propiedades |
| GET | \`/api/properties/{id}\` | Obtiene una propiedad por ID |

---

## ✨ Autor

**Stiven Tovar Claros**  
📧 [stivent367@gmail.com](mailto:stivent367@gmail.com)  
🔗 [GitHub: StivenTC](https://github.com/StivenTC)