# Million Property Technical Test 🏘️

Prueba técnica para el puesto de Full Stack Developer — Proyecto **Million Property**.

---

## 🧱 Estructura del proyecto

\`\`\`
/
├── Backend/      # Contiene la solución de .NET (API, Lógica de negocio, Tests, etc.)
├── frontend/     # Contiene la aplicación de Next.js (Páginas, Componentes, etc.)
├── data/         # Contiene los archivos JSON para importación manual (usado con mongoimport).
└── docker-compose.yml # Define los servicios de Docker para el backend y la base de datos.
\`\`\`

---

## ⚙️ Instalación y ejecución

Puedes ejecutar el proyecto de dos formas: mediante **Docker Compose** o de forma **manual**.

---

### 🐳 Opción 1: Instalación automática con Docker Compose

#### 1. Clonar el repositorio
\`\`\`bash
git clone https://github.com/StivenTC/million-property-technical-test.git
cd million-property-technical-test
\`\`\`

#### 2. Levantar los contenedores
\`\`\`bash
docker-compose up -d
\`\`\`

Esto levantará los siguientes servicios:
- **Backend (.NET API):** en el puerto `8080`
- **MongoDB (Base de datos):** en el puerto `27017`

#### 3. Importar datos de ejemplo (Opcional)
Si la base de datos no se pobló automáticamente, puedes ejecutar el siguiente script si estás en Windows:
\`\`\`bash
./import-data.bat
\`\`\`
#### 4. Accede a las aplicaciones
- **Backend API:** http://localhost:8080/swagger

*Nota: El frontend debe ejecutarse por separado (ver instrucciones en la opción manual).*
---

### 🧩 Opción 2: Instalación manual

#### 1. Clonar el repositorio
\`\`\`bash
git clone https://github.com/StivenTC/million-property-technical-test.git
cd million-property-technical-test
\`\`\`

#### 2. Levantar la base de datos MongoDB
Si tienes Docker instalado:
\`\`\`bash
docker run -d -p 27017:27017 --name mongo_test mongo
\`\`\`

#### 3. Importar los datos de ejemplo
Los datos de ejemplo están en la carpeta `/data`. Usa los siguientes comandos para importarlos. Reemplaza `<TU_CADENA_DE_CONEXION>` con tu string de conexión local.

\`\`\`bash
mongoimport --uri "mongodb://localhost:27017" --db MillionRealEstate --collection Owner --file ./data/Owner.json --jsonArray
mongoimport --uri "mongodb://localhost:27017" --db MillionRealEstate --collection Property --file ./data/Property.json --jsonArray
mongoimport --uri "mongodb://localhost:27017" --db MillionRealEstate --collection PropertyImage --file ./data/PropertyImage.json --jsonArray
mongoimport --uri "mongodb://localhost:27017" --db MillionRealEstate --collection PropertyTrace --file ./data/PropertyTrace.json --jsonArray
\`\`\`

#### 4. Configurar el Backend
Edita el archivo `Backend/API/appsettings.json` para que contenga la cadena de conexión correcta en la sección `MongoDatabaseSettings`:

\`\`\`json
{
  "ConnectionString": "mongodb://localhost:27017",
  "DatabaseName": "MillionRealEstate"
}
\`\`\`

#### 5. Ejecutar el Backend
\`\`\`bash
cd Backend/API
dotnet run
\`\`\` 
El API estará disponible en el puerto que indique la consola (ej. `http://localhost:8080/swagger`).

#### 6. Ejecutar el Frontend
\`\`\`bash
cd ../../Frontend
npm install
npm run dev
\`\`\` 
La aplicación estará disponible en:
👉 http://localhost:3000

---

## 🧠 Tecnologías utilizadas

### Backend
- **.NET 8**
- **MongoDB**
- **Swagger** (para documentación de la API)
- **NUnit & Moq** (para pruebas unitarias)

### Frontend
- **React**
- **Next.js 15** (con App Router)

### Infraestructura
- **Docker & Docker Compose**

---

## 🧰 Endpoints principales

| Método | Ruta | Descripción |
|--------|------|--------------|
| GET | /api/properties | Lista todas las propiedades |
| GET | /api/properties/{id} | Obtiene una propiedad por ID |

---

## ✨ Autor
**Stiven Tovar Claros**  
📧 [stivent367@gmail.com](mailto:stivent367@gmail.com)  
🔗 [GitHub: StivenTC](https://github.com/StivenTC)