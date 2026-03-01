<p align="center">
   <br/>
   <img width="300px" src="./public/nocna-mora-logo.svg" />
</p>

<h3 align="center">Nocna Nora Meme Generator</h3>

<p align="center">
  A web application for managing participants, videos, and categories with meme generation capabilities
</p>

## Overview

This project is a web application designed to manage participants, videos, and categories. It allows users to create, read, update, and delete (CRUD) participants and videos, associate participants with videos, and categorize videos. The application uses modern technologies like Next.js for server-side rendering, Prisma as an ORM for database interactions, and shadcn UI components for a consistent and accessible user interface.

### Tech Stack

- **Framework**: Next.js 14.2.16 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js (Keycloak/OAuth support)
- **UI Library**: React 18 + shadcn/ui (Radix UI components)
- **Styling**: Tailwind CSS
- **Language**: TypeScript 5.6+
- **Form Handling**: React Hook Form + Zod validation

### Features

- **User Authentication**: Secure login via NextAuth.js with Keycloak/OAuth support
- **Participant Management**: Create, edit, and delete participants with profiles
- **Video Management**: Create, edit, and delete videos from YouTube, Vimeo, DailyMotion, Facebook
- **Meme Generation**: Create memes from images with top/bottom text overlays
- **Category Management**: Organize videos with categories and soft delete support
- **Comments & Reactions**: Users can comment on videos and react with likes, laughs, love, etc.
- **User Roles**: Role-based access control (admin/user)
- **Responsive UI**: Built with shadcn UI components for seamless cross-device experience
- **SEO-Friendly URLs**: Slugs generated for participants and categories
- **Database Seeding**: Initial data can be seeded for development/testing

## Getting Started

### Prerequisites

- Node.js >=20.0.0
- pnpm ([installation guide](https://pnpm.io/installation))
- PostgreSQL database

### 1. Clone the repository and install dependencies

```
git clone https://github.com/shoowack/nocna-mora
cd nocna-mora
pnpm install
```

### 2. Configure your local environment

Copy the `.env.local.example` file to `.env.local`:

```
cp .env.local.example .env.local
```

#### Environment Variables

Required variables in `.env.local`:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/nocna_mora

# Authentication (NextAuth)
AUTH_SECRET=your-secret-key-here
AUTH_URL=http://localhost:3000/auth

# Keycloak (optional, for enterprise auth)
AUTH_KEYCLOAK_ID=your-keycloak-client-id
AUTH_KEYCLOAK_SECRET=your-keycloak-client-secret
AUTH_KEYCLOAK_ISSUER=http://localhost:8080/realms/your-realm
```

> **Note**: A PostgreSQL database is required for user accounts and email sign-in. For development, you can use OAuth providers only.

#### Database Setup with Prisma

Generate the Prisma client and run migrations:

```
pnpm prisma:migrate
```

To seed initial data:

```
pnpm seed
```

Use Prisma Studio to browse/edit data:

```
pnpm prisma:studio
```

### 4. Start the application

To run your site locally, use:

```
pnpm run dev
```

To run it in production mode, use:

```
pnpm run build
pnpm run start
```

Open your browser and navigate to <http://localhost:3000>.

### Running in Docker

Build and run with Docker Compose:

```bash
docker-compose up --build
```

Or build and run manually:

```bash
docker build -t nocna-mora .
docker run -p 3000:3000 --env-file .env.local nocna-mora
```

## Available Scripts

```bash
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm typecheck        # Run TypeScript type checking
pnpm lint             # Run ESLint
pnpm prisma:migrate   # Run database migrations
pnpm prisma:studio    # Open Prisma Studio
pnpm seed             # Seed database with initial data
```

## Project Structure

```
├── app/                # Next.js App Router pages
├── components/         # Reusable React components
├── lib/                # Utility functions and clients
├── constants/          # Application constants
├── public/             # Static assets
├── resources/          # Resource files
├── prisma/             # Prisma schema and migrations
└── tests/              # Test files
```

## Database Schema

The application uses PostgreSQL with the following main models:

- **User**: Authentication accounts and user profiles
- **Account/Session**: NextAuth tracking tables
- **Participant**: Event participants with bio and gender info
- **Video**: Video content from various providers (YouTube, Vimeo, etc.)
- **Meme**: Generated memes from images
- **Category**: Video categorization with soft delete support
- **Comment**: Video comments with approval workflow
- **Reaction**: User reactions to videos (like, love, laugh, etc.)

See `prisma/schema.prisma` for complete schema details.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [shadcn/ui](https://ui.shadcn.com/)
- [NextAuth.js](https://next-auth.js.org/)
