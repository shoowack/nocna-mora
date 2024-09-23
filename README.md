<p align="center">
   <br/>
   <img width="300px" src="./public/nocna-mora-logo.svg" />
</p>

## Overview

This project is a web application designed to manage actors, videos, and categories. It allows users to create, read, update, and delete (CRUD) actors and videos, associate actors with videos, and categorize videos. The application uses modern technologies like Next.js for server-side rendering, Prisma as an ORM for database interactions, and shadcn UI components for a consistent and accessible user interface.

### Features

User Authentication: Secure login and registration using NextAuth.
Actor Management:
Create, edit, and delete actors.
View actor profiles with associated videos.
Video Management:
Create, edit, and delete videos.
Associate actors with videos.
Assign categories to videos.
Category Management:
Create, edit, and delete categories.
Categorize videos for easy filtering and organization.
Responsive UI: Built with shadcn UI components for a seamless user experience across devices.
SEO-Friendly URLs: Slugs are generated for actors and categories for clean URLs.
Database Seeding: Initial data can be seeded into the database for testing and development.

## Getting Started

### 1. Clone the repository and install dependencies

```
git clone https://github.com/shoowack/nocna-mora
cd nocna-mora
pnpm install
```

### 2. Configure your local environment

Copy the .env.local.example file in this directory to .env.local (which will be ignored by Git):

```
cp .env.local.example .env.local
```

Add details for one or more providers (e.g. Google, Twitter, GitHub, Email, etc).

#### Database

A PostgreSQL database is needed to persist user accounts and to support email sign in. However, you can still use NextAuth.js for authentication without a database by using OAuth for authentication.

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
