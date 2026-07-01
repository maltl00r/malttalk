# MaltTalk

MaltTalk is a modern, database-driven language learning platform built with Next.js, Prisma, and PostgreSQL. It implements a comprehensive pedagogical framework with four learning phases: motivation/diagnosis, information processing, reinforcement, and systematization/closure.

## Overview

This application provides:

- A public landing page for visitors
- A course catalog backed by the database
- A module dashboard for each course with organized content by topics
- Lesson pages supporting four content types:
  - **Videos** with YouTube embed support
  - **Flashcards** with images, pronunciation (IPA), and language tags
  - **Drag & Drop** interactive classification exercises
  - **Immersive Readings** with interactive visual glossary
- A comprehensive admin panel for creating and managing all content types

The app is designed for easy local development and extensible course creation.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom color palette (slate/zinc/cyan)
- **Database**: PostgreSQL 15+
- **ORM**: Prisma 7 with adapter-pg
- **Hosting**: Deployed at maltloor.com:5432

## Project Structure

```
src/
├── app/
│   ├── actions/modules.ts              # Server actions for data fetching
│   ├── api/
│   │   ├── admin/                      # Admin API endpoints for content creation
│   │   ├── debug/lessons               # Debug endpoints for testing
│   │   └── lessons/[uuid]              # Public lesson retrieval
│   ├── components/
│   │   ├── video/VideoDiv.tsx          # Video lesson renderer
│   │   ├── flashcards/FlashcardsDiv.tsx # Flashcard interactive component
│   │   ├── drag-drop/DragDropDiv.tsx   # Drag & drop exercise
│   │   ├── reading/ReadingDiv.tsx      # Immersive reading with glossary
│   │   ├── ui/                         # Shared UI components
│   │   └── landing-page/               # Public site pages
│   ├── module/
│   │   └── [course]/
│   │       ├── dashboard/              # Course overview
│   │       └── [lesson]/               # Dynamic lesson page
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   └── prisma.ts                       # Prisma client singleton
└── data/
    └── lessons.ts                      # Legacy data (for reference)

prisma/
├── schema.prisma                       # Complete database schema
└── migrations/                         # Database migration history
```

## Database Schema

The application uses a relational model with five content types and support for tags and lesson metadata.

### Models Overview

```sql
courses
├── slug (PK), id, title, description
└── topics[]

topics
├── id (PK), slug, title, course_slug (FK)
└── lessons[]

lessons
├── id (PK), uuid (unique), topic_id (FK), type (enum)
├── title, description, slug
└── video_contents[], flashcard_contents[], drag_drop_contents[], reading_contents[]

video_contents
├── id (PK), lesson_id (FK)
├── url, description

flashcard_contents
├── id (PK), lesson_id (FK)
├── front_image, back_title, back_pronunciation, lang

drag_drop_contents
├── id (PK), lesson_id (FK)
├── text, category, feedback_message_wrong

reading_contents
├── id (PK), lesson_id (FK)
├── text
└── glossary_items[]

glossary_items
├── id (PK), reading_id (FK)
├── word, definition, image_url, synonym_english

lesson_tag, tags
└── Support for content tagging and filtering
```

### Lesson Types

**1. Video Lessons**
- YouTube embed URLs
- Description/transcript support
- Markdown rendering in descriptions
- Graceful fallback for missing URLs

**2. Flashcards**
- Image-based front side
- Text back with pronunciation (IPA)
- Language tag support (en-US, es-ES, etc.)
- Multiple cards per lesson

**3. Drag & Drop**
- Interactive classification exercises
- Custom category definitions
- Feedback messages for incorrect placements
- Reusable component structure

**4. Immersive Reading (NEW)**
- Rich text content with inline glossary
- Interactive word definitions on click
- Modal popups showing:
  - Word definition
  - Associated image (if available)
  - English synonym for context
- Separate glossary grid below text for quick reference
- Responsive design with automatic word highlighting

## Immersive Reading Glossary

The reading module supports the following per-word metadata:

```typescript
glossary_items: {
  word: string               // Word to highlight in text
  definition: string         // Primary definition
  image_url?: string        // Visual reference (optional)
  synonym_english?: string  // Simple English synonym (optional)
}
```

Example: For the word "beautiful" in a story, the system can show:
- **Definition**: "Very pretty or attractive"
- **Image**: [Picture of something beautiful]
- **Synonym**: "pretty"

## Local Development

### Prerequisites
- Node.js 20+
- PostgreSQL 15+ running at `maltloor.com:5432`
- Environment variables configured in `.env.local`

### Setup

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Validate database schema
npx prisma validate

# Start development server
npm run dev

# Build for production
npm run build

# Run production server
npm start
```

The app will be available at `http://localhost:3000`

## Admin Panel

The admin interface at `/admin` provides complete course and content management:

### Available Tabs

1. **📚 Cursos** - Create and manage courses
   - Slug (URL identifier)
   - Title and description
   - Lists all existing courses

2. **📑 Temas** - Organize lessons by topic
   - Associate with courses
   - Custom slugs for URL generation
   - View all topics

3. **📖 Lecciones** - Create lesson entries
   - Select topic and lesson type
   - Choose from 4 content types:
     - Video
     - Flashcards
     - Drag & Drop
     - Lecturas Inmersivas (Reading)
   - Title configuration

4. **🎬 Videos** - Add video content
   - Select video lesson
   - YouTube embed URL
   - Markdown-supported descriptions

5. **🎴 Flashcards** - Create flashcard content
   - Front image URL
   - Back title/word
   - IPA pronunciation
   - Language tag

6. **🎯 Drag-Drop** - Create classification exercises
   - Text to classify
   - Category definition
   - Optional feedback messages

7. **📚 Lecturas** - Add reading content
   - Select reading lesson
   - Full text content
   - Auto-displays existing readings

8. **📝 Glosario** - Add glossary items
   - Select reading content
   - Word and definition
   - Optional image URL
   - Optional English synonym

### API Endpoints

**Content Creation:**
- `POST /api/admin/courses` - Create course
- `POST /api/admin/topics` - Create topic
- `POST /api/admin/lessons` - Create lesson
- `POST /api/admin/video-contents` - Add video
- `POST /api/admin/flashcard-contents` - Add flashcard
- `POST /api/admin/drag-drop-contents` - Add drag-drop item
- `POST /api/admin/reading-contents` - Add reading text
- `POST /api/admin/glossary-items` - Add glossary word

**Data Retrieval:**
- `GET /api/lessons/[uuid]` - Fetch lesson by UUID
- `GET /api/debug/lessons` - Debug endpoint with all lessons

## Routing Structure

**Public Routes:**
- `/` - Landing page
- `/cursos` - Course listing
- `/module/[course]/dashboard` - Course overview
- `/module/[course]/[lesson]?id=[uuid]` - Specific lesson

**Admin Routes:**
- `/admin` - Full admin panel
- `/admin/[tab]` - Navigate to specific admin tab

**API Routes:**
- `/api/admin/*` - Content management endpoints
- `/api/lessons/*` - Public content retrieval
- `/api/debug/*` - Development debugging

## Current Course: Inglés como Idioma Extranjero

The platform ships with an English as a Foreign Language course (slug: `efl`) designed for Spanish speakers. 

### Course Structure

**Topics:**
1. Introductions & Greetings
2. Personal Information
3. Places & Directions

**Lessons:**
- "Basic Greetings" (Video)
- "Asking for Names" (Video)
- "Personal Information" (Video)
- "There is / There are" (Immersive Reading with Glossary)

### Expanding the Course

To add more lessons:

1. Create a new topic via the admin panel
2. Create lesson entries (select content type)
3. Add content specific to the lesson type
4. For reading lessons, also populate glossary items

Example: Adding a reading lesson with glossary

```bash
# 1. Go to /admin → 📖 Lecciones
# 2. Create lesson type: "Lecturas Inmersivas"
# 3. Go to /admin → 📚 Lecturas
# 4. Add your reading text
# 5. Go to /admin → 📝 Glosario
# 6. Add glossary items with definitions and images
```

## Color Palette

The application uses a carefully selected dark theme color palette:

- **Background**: `#0f172a` (slate-900)
- **Primary**: Gradient from cyan to blue
- **Secondary**: Emerald green accents
- **Borders**: Slate with transparency
- **Text**: White/light text on dark backgrounds

All colors are defined in `tailwind.config.ts` using CSS custom properties.

## Performance Optimizations

- Server-side data fetching with Prisma
- Client-side React components for interactivity
- Image lazy loading in glossary
- Responsive design for all screen sizes
- Turbopack for fast development builds
- Static route pre-generation where applicable

## Error Handling

- Graceful video URL fallback (shows placeholder if URL invalid)
- Database validation for content type mismatches
- Input validation on all admin endpoints
- User-friendly error messages in admin interface

## Future Enhancements

- User authentication and progress tracking
- Multiple language interface (i18n)
- Advanced search and filtering
- User-contributed glossaries
- Speech recognition for pronunciation
- Mobile app (React Native)
- Export course content
- Analytics and learning insights

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, refer to the documentation or create an issue in the repository.



