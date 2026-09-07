<p align="center">
   <br/>
   <img width="300px" src="./public/nocna-mora-logo.svg" />
</p>

<h3 align="center">Arhivska stranica Noćne More Željka Malnara</h3>

<p align="center">
  A web application for archiving and browsing videos, participants, and categories from a beloved Croatian TV show
</p>

## Overview

This project is a web application designed to manage and browse an archive of TV show videos, participants, and categories. It features a content management system powered by Payload CMS, a public-facing frontend for browsing the archive, and a timeline that aggregates key events. The application uses Next.js for server-side rendering and Payload CMS for content management with a PostgreSQL database.

### Tech Stack

- **Framework**: Next.js 15 (App Router)
- **CMS**: Payload CMS 3
- **Database**: PostgreSQL with Drizzle ORM (via Payload)
- **Authentication**: Payload CMS built-in auth with role-based access
- **UI Library**: React 19 + shadcn/ui (Radix UI components)
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript 5.6+

### Features

- **Content Management**: Admin panel at `/admin` powered by Payload CMS
- **Participant Profiles**: Browse main cast and guests with bios and photos
- **Video Archive**: Browse videos from YouTube, Vimeo, DailyMotion, and Facebook
- **Category Organization**: Videos organized by categories
- **Timeline**: Chronological view aggregating participant birth/death dates, aired videos, and custom events
- **Full-Text Search**: PostgreSQL-powered search across videos
- **Comments & Reactions**: Users can comment on and react to videos
- **User Roles**: Role-based access control (admin, editor, user)
- **Responsive UI**: Built with shadcn/ui components for seamless cross-device experience
- **SEO-Friendly URLs**: Slug-based routing for all content

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- pnpm ([installation guide](https://pnpm.io/installation))
- PostgreSQL database

### 1. Clone the repository and install dependencies

```bash
git clone https://github.com/shoowack/nocna-mora
cd nocna-mora
pnpm install
```

### 2. Configure your local environment

Copy the `.env.example` file to `.env.local`:

```bash
cp .env.example .env.local
```

#### Environment Variables

Required variables in `.env.local`:

```env
# Database
DATABASE_URI=postgresql://tvarhiv:tvarhiv@localhost:5432/tvarhiv

# Payload CMS
PAYLOAD_SECRET=your-secret-key-at-least-32-characters-long

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Email (optional, for notifications)
RESEND_API_KEY=
```

### 3. Database Setup

Run Payload migrations to create the database schema:

```bash
pnpm payload migrate
```

### 4. Start the application

Development mode:

```bash
pnpm dev
```

Production mode:

```bash
pnpm build
pnpm start
```

Open your browser and navigate to <http://localhost:3000>.

The admin panel is available at <http://localhost:3000/admin>. On first visit, you'll be prompted to create an admin user.

### Running with Docker

The `db` service is gated behind the `local` Compose profile, so set
`COMPOSE_PROFILES=local` (e.g. in a git-ignored `.env`) before starting it locally:

```bash
echo "COMPOSE_PROFILES=local" >> .env
docker compose up --build
```

This starts both the app and a PostgreSQL database. The app will be available at <http://localhost:3000>.

To run migrations after starting Docker:

```bash
docker compose exec app pnpm payload migrate
```

## Available Scripts

```bash
pnpm dev                    # Start development server
pnpm build                  # Build for production
pnpm start                  # Start production server
pnpm generate:types         # Generate Payload types
pnpm generate:importmap     # Generate Payload import map
```

## Project Structure

```
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── (frontend)/     # Public-facing pages
│   │   ├── (payload)/      # Payload CMS admin
│   │   └── api/            # API routes
│   ├── access/             # Access control policies
│   ├── collections/        # Payload CMS collection configs
│   ├── components/         # Reusable React components
│   ├── globals/            # Payload CMS global configs
│   ├── hooks/              # Payload CMS hooks
│   ├── lib/                # Utility functions
│   └── migrations/         # Database migrations
├── public/                 # Static assets
├── docker/                 # Docker-related files
├── payload.config.ts       # Payload CMS configuration
└── docker-compose.yml      # Docker Compose config
```

## Collections

- **Users**: Authentication and user profiles with roles (admin, editor, user)
- **Videos**: Video content from various providers with metadata and transcriptions
- **Participants**: Cast members and guests with bios, photos, and dates
- **Categories**: Video categorization
- **Comments**: Video comments with approval workflow
- **Reactions**: User reactions to videos
- **Timeline Events**: Custom events for the timeline view
- **Media**: Uploaded images and files
- **Notifications**: User notification preferences

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
- [Payload CMS](https://payloadcms.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
