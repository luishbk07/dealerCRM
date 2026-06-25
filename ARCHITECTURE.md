# Dealer CRM Architecture

## Stack

- React + Vite
- TypeScript
- MUI
- Supabase

## Code Style

- Single quotes
- No semicolons
- SOLID
- Clean Architecture

## Database

The database is the source of truth.

Never invent columns.

Never generate DTOs that don't match the schema.

Never modify the schema unless explicitly requested.

## Folder Structure

...

## Services

UI -> Hook -> Service -> Repository -> Supabase

Never call Supabase directly from React pages.

## Components

Presentation only.

Business logic belongs in hooks/services.

## Naming

Self explanatory.

No abbreviations.

No magic strings.

No duplicated code.

...
