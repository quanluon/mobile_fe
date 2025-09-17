# Cong Phone Admin Panel

A modern admin panel for managing the Cong Phone e-commerce platform, built with React, TypeScript, Vite, and Ant Design.

## Features

- 🌐 **Multi-language Support** - English and Vietnamese
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🎨 **Modern UI** - Built with Ant Design components
- 🔐 **Authentication** - Secure login with JWT tokens
- 📊 **Dashboard** - Comprehensive analytics and statistics
- 🛍️ **Product Management** - Full CRUD operations for products
- 🏷️ **Brand Management** - Manage product brands
- 📂 **Category Management** - Organize products by categories
- 👥 **User Management** - Admin user management
- 🔄 **Real-time Updates** - Zustand state management
- 📡 **API Integration** - Axios-based API client

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Library**: Ant Design
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **Internationalization**: i18next
- **Styling**: Tailwind CSS
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running (see backend README)

### Installation

1. Clone the repository
2. Navigate to the admin directory:
   ```bash
   cd admin
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create environment file:
   ```bash
   cp .env.example .env
   ```

5. Update the environment variables in `.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:3000
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

7. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout/         # Main layout component
│   └── LanguageSwitcher/ # Language selection component
├── hooks/              # Custom React hooks
│   └── useTranslation.ts # i18n hook
├── lib/                # Library configurations
│   ├── api/           # API client and services
│   ├── constants/     # Application constants
│   └── i18n/          # Internationalization setup
├── pages/             # Page components
│   ├── Dashboard/     # Dashboard page
│   ├── Login/         # Login page
│   ├── Products/      # Product management pages
│   ├── Brands/        # Brand management pages
│   ├── Categories/    # Category management pages
│   └── Users/         # User management pages
├── stores/            # Zustand state stores
│   ├── auth.ts        # Authentication state
│   ├── products.ts    # Products state
│   ├── brands.ts      # Brands state
│   └── categories.ts  # Categories state
├── types/             # TypeScript type definitions
└── App.tsx           # Main application component
```

## API Integration

The admin panel integrates with the backend API through:

- **Authentication**: JWT-based authentication with refresh tokens
- **Products**: Full CRUD operations, bulk actions, statistics
- **Brands**: Brand management with logo upload
- **Categories**: Category management
- **Users**: User management and profile updates

## Internationalization

The application supports multiple languages:

- **English** (en) - Default language
- **Vietnamese** (vi) - Vietnamese translation

Language files are located in `src/lib/i18n/locales/`. To add a new language:

1. Create a new JSON file in the locales directory
2. Add the language to the `languages` array in `LanguageSwitcher` component
3. Update the i18n configuration

## State Management

The application uses Zustand for state management with the following stores:

- **Auth Store**: User authentication and profile data
- **Products Store**: Product data, filters, and pagination
- **Brands Store**: Brand data and management
- **Categories Store**: Category data and management

## Styling

The application uses a combination of:

- **Ant Design**: Primary UI component library
- **Tailwind CSS**: Utility-first CSS framework
- **Custom CSS**: Application-specific styles

## Deployment

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Environment Variables

Set the following environment variables for production:

- `VITE_API_BASE_URL` - Backend API URL
- `VITE_APP_NAME` - Application name
- `VITE_APP_VERSION` - Application version

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.# mobile_fe
