# Attenpo POS System / Sistema de Punto de Venta Attenpo

<div align="center">
  <a href="#english">English</a> |
  <a href="#español">Español</a>
</div>

---

<a id="english"></a>
## 🌟 English Version

A modern Point of Sale (POS) system with QR code scanning and payment processing capabilities, built with Svelte and Vite.

### 🚀 Features

- **QR Code Scanning**: Scan product QR codes using the device camera
- **Product Management**: View and manage product inventory
- **Checkout System**: Process payments with multiple methods
- **Responsive Design**: Works on various screen sizes
- **Real-time Updates**: Live updates for product information and pricing

### 🛠️ Technologies Used

- [Svelte](https://svelte.dev/) - Frontend framework
- [Vite](https://vitejs.dev/) - Build tool
- [jsQR](https://github.com/cozmo/jsQR) - QR code scanning library
- [Font Awesome](https://fontawesome.com/) - Icons
- [Sentry](https://sentry.io/) - Error tracking
- [GraphQL](https://graphql.org/) - API queries

### 📦 Installation

1. Clone the repository
   ```bash
   git clone [repository-url]
   cd pos
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Configure environment variables (see Configuration section below)

4. Start the development server
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

### ⚙️ Configuration

Create a `.env` file in the root directory with the following variables:

```env
# API Configuration
VITE_API_URL=your_api_url_here
VITE_GRAPHQL_ENDPOINT=your_graphql_endpoint

# Sentry Configuration
VITE_SENTRY_DSN=your_sentry_dsn_here

# Application Settings
VITE_APP_NAME="Attenpo POS"
VITE_DEFAULT_CURRENCY="USD"
VITE_TAX_RATE=0.19  # 19% tax rate as decimal
```

### 🚀 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build
- `npm test` - Run tests
- `npm run lint` - Lint the codebase

### 🏗️ Project Structure

```
src/
├── assets/             # Static assets (images, fonts, etc.)
├── components/         # Reusable UI components
│   ├── product/       # Product-related components
│   ├── Checkout.svelte
│   ├── Scanner.svelte
│   └── ...
├── stores/            # State management
│   ├── cart.js        # Shopping cart store
│   └── products.js    # Products store
├── tools/             # Utility functions
│   ├── api.js         # API client
│   └── qr.js          # QR code utilities
├── App.svelte         # Main application component
└── main.js            # Application entry point
```

### 📱 Usage Guide

#### 1. Scanning Products
- Click the camera icon to activate the QR scanner
- Position the product's QR code within the scanner frame
- The system will automatically detect and add the product to the cart

#### 2. Managing Cart
- View cart contents by clicking the cart icon
- Adjust quantities using the + and - buttons
- Remove items by clicking the trash can icon

#### 3. Checkout Process
1. Click "Checkout" when ready to pay
2. Select payment method (Card/Cash)
3. For card payments, follow the payment processor's instructions
4. For cash payments, enter the amount received and the system will calculate change
5. Click "Complete Sale" to finalize the transaction
6. Print or email the receipt if needed

### 🔧 Implementation Details

#### QR Code Integration
```javascript
// Example of QR code scanning implementation
import { BrowserQRCodeReader } from '@zxing/library';

const codeReader = new BrowserQRCodeReader();
codeReader.decodeFromInputVideoDevice(undefined, 'video')
  .then(result => {
    console.log('QR Code detected:', result.text);
    // Handle scanned code
  })
  .catch(err => console.error('QR Scan error:', err));
```

#### State Management
```javascript
// Example store implementation
import { writable } from 'svelte/store';

export const cart = writable([]);

export function addToCart(product) {
  cart.update(items => {
    const existing = items.find(item => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      items.push({ ...product, quantity: 1 });
    }
    return items;
  });
}
```

### 🔐 Security Considerations

1. **API Security**
   - Always use HTTPS for API communications
   - Implement proper CORS policies
   - Use secure, HTTP-only cookies for sessions

2. **Data Protection**
   - Encrypt sensitive data at rest
   - Never store raw payment information
   - Implement rate limiting on authentication endpoints

3. **Authentication**
   - Use JWT with appropriate expiration
   - Implement refresh token rotation
   - Store tokens securely (httpOnly, Secure, SameSite)

### 🤝 Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/NewFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/NewFeature`)
5. Open a Pull Request



---

<a id="español"></a>
## 🇪🇸 Versión en Español

Sistema moderno de Punto de Venta (POS) con capacidad de escaneo de códigos QR y procesamiento de pagos, construido con Svelte y Vite.

### 🚀 Características

- **Escaner de Códigos QR**: Escanea códigos QR de productos usando la cámara del dispositivo
- **Gestión de Productos**: Visualiza y gestiona el inventario de productos
- **Sistema de Pago**: Procesa pagos con múltiples métodos
- **Diseño Responsivo**: Funciona en diferentes tamaños de pantalla
- **Actualizaciones en Tiempo Real**: Actualizaciones en vivo de información y precios de productos

### 🛠️ Tecnologías Utilizadas

- [Svelte](https://svelte.dev/) - Framework Frontend
- [Vite](https://vitejs.dev/) - Herramienta de construcción
- [jsQR](https://github.com/cozmo/jsQR) - Biblioteca para escaneo de códigos QR
- [Font Awesome](https://fontawesome.com/) - Iconos
- [Sentry](https://sentry.io/) - Seguimiento de errores
- [GraphQL](https://graphql.org/) - Consultas a la API

### 📦 Instalación

1. Clona el repositorio
   ```bash
   git clone [url-del-repositorio]
   cd pos
   ```

2. Instala las dependencias
   ```bash
   npm install
   # o
   pnpm install
   ```

3. Configura las variables de entorno (ver sección de Configuración)

4. Inicia el servidor de desarrollo
   ```bash
   npm run dev
   # o
   pnpm dev
   ```

5. Abre [http://localhost:5173](http://localhost:5173) en tu navegador

### ⚙️ Configuración

Crea un archivo `.env` en el directorio raíz con las siguientes variables:

```env
# Configuración de la API
VITE_API_URL=tu_url_de_api
VITE_GRAPHQL_ENDPOINT=tu_endpoint_graphql

# Configuración de Sentry
VITE_SENTRY_DSN=tu_dsn_de_sentry

# Configuración de la Aplicación
VITE_APP_NAME="Attenpo POS"
VITE_DEFAULT_CURRENCY="CLP"
VITE_TAX_RATE=0.19  # IVA del 19% en decimal
```

### 🚀 Comandos Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye para producción
- `npm run preview` - Previsualiza la versión de producción
- `npm test` - Ejecuta las pruebas
- `npm run lint` - Verifica la calidad del código

### 🏗️ Estructura del Proyecto

```
src/
├── assets/             # Recursos estáticos (imágenes, fuentes, etc.)
├── components/         # Componentes de UI reutilizables
│   ├── product/       # Componentes relacionados con productos
│   ├── Checkout.svelte
│   ├── Scanner.svelte
│   └── ...
├── stores/            # Gestión de estado
│   ├── cart.js        # Carrito de compras
│   └── products.js    # Almacén de productos
├── tools/             # Funciones de utilidad
│   ├── api.js         # Cliente de API
│   └── qr.js          # Utilidades de códigos QR
├── App.svelte         # Componente principal de la aplicación
└── main.js            # Punto de entrada de la aplicación
```

### 📱 Guía de Uso

#### 1. Escaneo de Productos
- Haz clic en el ícono de la cámara para activar el escáner QR
- Posiciona el código QR del producto dentro del marco del escáner
- El sistema detectará automáticamente y agregará el producto al carrito

#### 2. Gestión del Carrito
- Visualiza el contenido del carrito haciendo clic en el ícono del carrito
- Ajusta las cantidades usando los botones + y -
- Elimina ítems haciendo clic en el ícono de basura

#### 3. Proceso de Pago
1. Haz clic en "Pagar" cuando estés listo
2. Selecciona el método de pago (Tarjeta/Efectivo)
3. Para pagos con tarjeta, sigue las instrucciones del procesador de pagos
4. Para pagos en efectivo, ingresa el monto recibido y el sistema calculará el vuelto
5. Haz clic en "Finalizar Venta" para completar la transacción
6. Imprime o envía por correo el comprobante si es necesario

### 🔧 Detalles de Implementación

#### Integración de Códigos QR
```javascript
// Ejemplo de implementación de escaneo QR
import { BrowserQRCodeReader } from '@zxing/library';

const codeReader = new BrowserQRCodeReader();
codeReader.decodeFromInputVideoDevice(undefined, 'video')
  .then(result => {
    console.log('Código QR detectado:', result.text);
    // Manejar el código escaneado
  })
  .catch(err => console.error('Error al escanear QR:', err));
```

#### Gestión de Estado
```javascript
// Ejemplo de implementación de store
import { writable } from 'svelte/store';

export const cart = writable([]);

export function addToCart(product) {
  cart.update(items => {
    const existing = items.find(item => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      items.push({ ...product, quantity: 1 });
    }
    return items;
  });
}
```

### 🔐 Consideraciones de Seguridad

1. **Seguridad de la API**
   - Usa siempre HTTPS para las comunicaciones con la API
   - Implementa políticas CORS adecuadas
   - Usa cookies seguras (HTTP-only) para las sesiones

2. **Protección de Datos**
   - Encripta datos sensibles en reposo
   - Nunca almacenes información de pago sin procesar
   - Implementa límites de tasa en los endpoints de autenticación

3. **Autenticación**
   - Usa JWT con expiración adecuada
   - Implementa rotación de tokens de actualización
   - Almacena los tokens de forma segura (httpOnly, Secure, SameSite)

### 🤝 Cómo Contribuir

1. Haz un fork del repositorio
2. Crea una rama nueva (`git checkout -b feature/NuevaFuncionalidad`)
3. Haz commit de tus cambios (`git commit -m 'Agrega alguna funcionalidad'`)
4. Haz push a la rama (`git push origin feature/NuevaFuncionalidad`)
5. Abre un Pull Request





## 🙏 Agradecimientos

- [Svelte](https://svelte.dev/) por el increíble framework
- [Vite](https://vitejs.dev/) por las herramientas de construcción
- A todos los colaboradores que han ayudado a dar forma a este proyecto
- A la empresa que no me pago y me toco liberar codigos fuentes 