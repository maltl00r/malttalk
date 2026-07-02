# 🌍 MaltTalk - Online Language Learning Platform

An modern, free, and fully-featured language learning platform built with **Next.js 16**, **React 19**, **TypeScript**, **Prisma ORM**, and **Tailwind CSS**. Learn new languages through eight content types: videos, flashcards, interactive drag-drop exercises, reading comprehension with glossary support, audio-visual diagnostic quizzes, writing expression challenges, timed mental agility challenges, and unit closing exams.

## 📋 Quick Overview

**MaltTalk** is a comprehensive language learning platform implementing proven pedagogical frameworks:
- **Motivation/Diagnosis Phase** - Engaging landing page, course selection, audio-visual diagnostic quizzes
- **Information Processing** - Multiple content delivery methods (video, reading, flashcards)
- **Reinforcement** - Interactive exercises (drag-drop, writing challenges) and spaced repetition
- **Systematization/Closure** - Progress tracking, completion feedback, vocabulary validation

### Core Features

- ✅ **Eight Content Types** - Video, Flashcards, Drag-Drop Exercises, Reading Comprehension, Audio-Visual Quizzes, Writing Challenges, Mental Agility Games, Closing Exams
- ✅ **Interactive Glossary** - Click-to-define vocabulary with images
- ✅ **Real-time Video Duration** - Actual duration tracking (not hardcoded)
- ✅ **Audio-Visual Diagnostic System** - Associating sounds with visual elements (gestures/images)
- ✅ **Writing Expression Challenges** - Text composition with vocabulary validation
- ✅ **Modern UI/UX** - Light/dark mode, responsive design, gamification elements
- ✅ **Complete Admin Panel** - CRUD operations for all content types (6 tabs)
- ✅ **Spaced Repetition** - Flashcard system for optimal vocabulary retention
- ✅ **Progress Dashboard** - Visual progress tracking with statistics

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 16.2.6 (App Router, Turbopack)
- **UI Library**: React 19 with TypeScript
- **Styling**: Tailwind CSS 3.x with full dark mode support
- **Interactive**: @dnd-kit for drag-and-drop exercises
- **Media**: react-player for video content, react-markdown for reading

### Backend & Data
- **API**: Next.js API Routes (RESTful pattern)
- **Server Actions**: Server-side data fetching with Next.js
- **ORM**: Prisma 7.8.0 with PostgreSQL adapter
- **Database**: PostgreSQL at maltloor.com:5432 with connection pooling

### Development
- **Language**: TypeScript with strict mode
- **Linting**: ESLint for code quality
- **Build**: Turbopack for ultra-fast compilation
- **Deployment**: Vercel-ready

## 📁 Project Structure

```
malttalk/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout component
│   │   ├── page.tsx                # Landing page with hero section
│   │   ├── globals.css             # Global styles and Tailwind setup
│   │   ├── admin/
│   │   │   └── page.tsx            # Admin panel (~1900 lines, 5 tabs)
│   │   ├── module/
│   │   │   ├── [course]/
│   │   │   │   ├── page.tsx        # Course detail/listing page
│   │   │   │   ├── [lesson]/
│   │   │   │   │   └── page.tsx    # Lesson content renderer
│   │   │   │   └── dashboard/
│   │   │   │       └── page.tsx    # Student course dashboard
│   │   ├── cursos/
│   │   │   └── page.tsx            # Courses listing page
│   │   ├── api/
│   │   │   ├── admin/              # Admin CRUD endpoints (14 routes)
│   │   │   │   ├── courses/
│   │   │   │   ├── topics/
│   │   │   │   ├── lessons/
│   │   │   │   ├── tags/
│   │   │   │   ├── video-contents/
│   │   │   │   ├── reading-contents/
│   │   │   │   ├── reading-contents/list/
│   │   │   │   ├── flashcard-contents/
│   │   │   │   ├── drag-drop-contents/
│   │   │   │   ├── visio-acoustic-contents/
│   │   │   │   ├── writing-challenges/
│   │   │   │   ├── glossary-items/
│   │   │   │   └── debug/
│   │   │   ├── lessons/
│   │   │   │   └── [uuid]/         # Public lesson endpoint
│   │   │   └── debug/
│   │   │       └── lessons/        # Debug endpoint
│   │   ├── actions/
│   │   │   └── modules.ts          # Server actions (7 functions, documented)
│   │   └── components/
│   │       ├── landing-page/       # 9 landing page components
│   │       │   ├── Hero.tsx
│   │       │   ├── Card.tsx
│   │       │   ├── Features.tsx
│   │       │   ├── Level.tsx
│   │       │   ├── Start.tsx
│   │       │   ├── Boxes/
│   │       │   │   ├── Box.tsx
│   │       │   │   ├── Feature.tsx
│   │       │   │   └── Skill.tsx
│   │       │   └── titles/
│   │       │       └── BorderedTitle.tsx
│   │       ├── ui/
│   │       │   ├── Footer.tsx
│   │       │   ├── ModuleList.tsx (with real video duration)
│   │       │   └── SidebarModuleToggle.tsx
│   │       ├── video/
│   │       │   └── VideoDiv.tsx     # Video player with duration tracking
│   │       ├── reading/
│   │       │   └── ReadingDiv.tsx   # Reading with interactive glossary
│   │       ├── flashcards/
│   │       │   └── FlashcardsDiv.tsx # Spaced repetition system
│   │       ├── drag-drop/
│   │       │   └── DragDropDiv.tsx  # Interactive grammar exercises
│   │       ├── visio-acoustic/
│   │       │   └── VisioAcousticDiv.tsx # Audio-visual diagnostic quizzes
│   │       ├── writing-challenges/
│   │       │   └── WritingChallengesDiv.tsx # Text composition exercises
│   │       ├── mental-agility/
│   │       │   └── MentalAgilityDiv.tsx # Timed mental agility challenges
│   │       └── closing-exam/
│   │           └── ClosingExamDiv.tsx # Unit closing assessments
│   ├── lib/
│   │   └── prisma.ts               # Prisma singleton with PostgreSQL adapter
│   ├── data/
│   │   └── lessons.ts              # Sample data/constants
│   └── generated/
│       └── prisma/                 # Auto-generated Prisma types
├── prisma/
│   ├── schema.prisma               # Database schema (fully documented)
│   ├── migrations/                 # Database migration history
│   └── migration_lock.toml
├── public/
│   ├── flashcards/                 # 15 flashcard images (fruits)
│   ├── logo.ico
│   └── favicon.ico
├── Configuration Files
│   ├── next.config.ts              # Next.js configuration
│   ├── tsconfig.json               # TypeScript configuration
│   ├── tailwind.config.ts           # Tailwind CSS configuration
│   ├── postcss.config.mjs           # PostCSS configuration
│   ├── eslint.config.mjs            # ESLint configuration
│   ├── prisma.config.ts             # Prisma configuration
│   └── package.json                # Dependencies and scripts
├── AGENTS.md                        # AI agent customization rules
├── CLAUDE.md                        # Claude AI instructions
└── README.md                        # Project documentation
```

**Key Statistics**:
- **Source Files**: ~70 custom source files (100+ total with generated)
- **Components**: 24 React components with JSDoc comments (added MentalAgilityDiv, ClosingExamDiv)
- **API Routes**: 16 REST endpoints with full documentation (added /mental-agility, /closing-exam)
- **Database Models**: 14 Prisma models with comprehensive field documentation
- **Content Types**: 8 unique learning content types (video, flashcards, drag-drop, reading, audio-visual, writing, mental-agility, closing-exam)
- **Code Coverage**: All source files optimized with English comments
- **TypeScript**: 100% type-safe with strict mode enabled

## 🗄️ Complete Database Schema

### Overview

MaltTalk uses PostgreSQL with **14 core models** and **1 junction table** for relationships. All models are fully documented in `prisma/schema.prisma`.

### Key Features Added (Latest)

#### Module 4: Mental Agility Games 🧠
- Timed challenges with countdown timer
- Pattern recognition and categorization exercises
- Multiple difficulty levels (beginner, intermediate, advanced)
- Immediate feedback with custom messages
- Score tracking and completion percentage
- Visual timer with red warning when ≤5 seconds

#### Module 5: Closing Exam Assessments 📋
- Unit-level comprehensive assessments
- Timed exams with MM:SS format countdown
- Point-based scoring system
- Passing score validation (default 70%)
- Per-question points allocation
- Pass/fail status with detailed feedback
- Sequential question progression

### Data Models Documentation

#### 1. **courses** - Top-level language courses

```prisma
model courses {
  slug        String   @id              // URL identifier (e.g., "english")
  id          Int      @default(autoincrement())
  title       String                    // Display name
  description String?                  // Course description
  topics      topics[]                  // Related topics (1:N)
}
```

- **Purpose**: Represents a language course (English, Spanish, etc.)
- **Relationships**: One-to-many with `topics`

#### 2. **topics** - Learning modules within courses

```prisma
model topics {
  id          Int       @id @default(autoincrement())
  slug        String    @unique         // URL identifier
  title       String                    // Module name
  course_slug String                    // Foreign key to courses
  lessons     lessons[]                 // Related lessons (1:N)
  courses     courses   @relation(...)
}
```

- **Purpose**: Organizes lessons within a course (Greetings, Numbers, etc.)
- **Relationships**: Many-to-one with `courses`, one-to-many with `lessons`

#### 3. **lessons** - Individual learning units

```prisma
model lessons {
  id                 Int                  @id @default(autoincrement())
  uuid               String?              @unique @default(dbgenerated("gen_random_uuid()"))
  topic_id           Int                  // Foreign key to topics
  type               lesson_type          // Content type: video|flashcards|drag_drop|reading
  title              String               // Lesson name
  description        String?              // Lesson description
  slug               String?              // URL identifier
  
  // Content relationships
  topics             topics               @relation(...)
  video_contents     video_contents[]
  reading_contents   reading_contents[]
  flashcard_contents flashcard_contents[]
  drag_drop_contents drag_drop_contents[]
  visio_acoustic_contents visio_acoustic_contents[]
  writing_challenge_contents writing_challenge_contents[]
  lesson_tag         lesson_tag[]
}
```

- **Purpose**: Individual learning units with specific content types
- **Features**: UUID for public sharing, type discrimination for content routing
- **Relationships**: Many-to-one with `topics`, one-to-many with all content types

#### 4. **lesson_type** - Content type enumeration

```prisma
enum lesson_type {
  video              // Video content
  flashcards         // Vocabulary practice
  drag_drop          // Interactive exercises
  reading            // Reading comprehension
  visio_acoustic     // Audio-visual diagnostic quizzes
  writing_challenges // Text composition exercises
  mental_agility     // Timed mental agility challenges
  closing_exam       // Unit closing assessment tests
}
```

#### 5. **video_contents** - Video lesson metadata

```prisma
model video_contents {
  id          Int     @id @default(autoincrement())
  lesson_id   Int                       // Foreign key to lessons
  url         String                    // Video URL/source
  description String?                  // Transcript or description
  duration    Int?    @default(600)     // Duration in seconds (default: 10 min)
  lessons     lessons @relation(...)
}
```

- **Features**: Real-time video duration tracking (added July 2026)
- **Default**: 600 seconds (10 minutes) for new entries
- **Usage**: ModuleList displays actual duration instead of hardcoded time

#### 6. **reading_contents** - Reading comprehension text

```prisma
model reading_contents {
  id             Int               @id @default(autoincrement())
  lesson_id      Int               // Foreign key to lessons
  text           String            // Full reading material
  glossary_items glossary_items[]  // Related vocabulary
  lessons        lessons           @relation(...)
}
```

#### 7. **glossary_items** - Vocabulary definitions with visual support

```prisma
model glossary_items {
  id              Int               @id @default(autoincrement())
  reading_id      Int               // Foreign key to reading_contents
  word            String            // Target word/phrase
  definition      String            // Definition in learning language
  image_url       String?           // Visual reference (optional)
  synonym_english String?           // English translation (optional)
  reading_contents reading_contents @relation(...)
}
```

- **Purpose**: Interactive glossary for reading comprehension
- **Features**: Click-to-define with images, definitions, and English synonyms

#### 8. **flashcard_contents** - Spaced repetition flashcards

```prisma
model flashcard_contents {
  id                 Int     @id @default(autoincrement())
  lesson_id          Int     // Foreign key to lessons
  front_image        String? // Card front image (optional)
  back_title         String  // Card back text (word/translation)
  back_pronunciation String? // Phonetic pronunciation guide
  lang               String  // Language code (e.g., "es", "fr")
  lessons            lessons @relation(...)
}
```

- **Purpose**: Vocabulary cards with images and pronunciation
- **Optimization**: Supports multiple cards per lesson

#### 9. **drag_drop_contents** - Interactive categorization exercises

```prisma
model drag_drop_contents {
  id                     Int     @id @default(autoincrement())
  lesson_id              Int     // Foreign key to lessons
  text                   String  // Item to be dragged
  category               String  // Target category
  feedback_message_wrong String? // Custom error feedback message
  lessons                lessons @relation(...)
}
```

#### 10. **visio_acoustic_contents** - Audio-visual diagnostic quizzes

```prisma
model visio_acoustic_contents {
  id                     Int     @id @default(autoincrement())
  lesson_id              Int     // Foreign key to lessons
  question_text          String  // Question prompt
  sound_url              String  // URL to audio file
  image_url              String  // URL to gesture/image
  correct_answer         String  // Correct answer option
  option_b               String  // Alternative answer option
  option_c               String  // Alternative answer option
  option_d               String? // Optional fourth answer
  feedback_correct       String? // Positive feedback message
  feedback_incorrect     String? // Negative feedback message
  question_order         Int     // Order within lesson
  difficulty_level       String  // beginner|intermediate|advanced
  lessons                lessons @relation(...)
}
```

- **Purpose**: Audio-visual association exercises for pronunciation and gesture recognition
- **Features**: Real-time feedback, difficulty levels, multiple choice options
- **Usage**: Students listen to audio and select corresponding visual element

#### 11. **writing_challenge_contents** - Text composition exercises

```prisma
model writing_challenge_contents {
  id                    Int     @id @default(autoincrement())
  lesson_id             Int     // Foreign key to lessons
  title                 String  // Challenge title
  prompt                String  // Writing task prompt
  min_words             Int     // Minimum word count
  max_words             Int     // Maximum word count
  required_vocabulary   String? // Comma-separated required words
  example_answer        String? // Model answer
  difficulty_level      String  // beginner|intermediate|advanced
  challenge_order       Int     // Order within lesson
  evaluation_criteria   String? // JSON evaluation rubric
  hint                  String? // Optional hint
  lessons               lessons @relation(...)
}
```

- **Purpose**: Guided writing exercises with vocabulary validation
- **Features**: Word count validation, required vocabulary checking, example answers
- **Validation**: Students must meet min/max word requirements to submit

#### 12. **mental_agility_contents** - Timed mental agility challenges

```prisma
model mental_agility_contents {
  id                     Int     @id @default(autoincrement())
  lesson_id              Int     // Foreign key to lessons
  title                  String  // Challenge title
  prompt                 String  // Challenge prompt/question
  time_limit             Int     // Time limit in seconds
  correct_answer         String  // Correct answer option
  option_b               String  // Alternative answer (B)
  option_c               String  // Alternative answer (C)
  option_d               String? // Optional answer (D)
  image_url              String? // Optional visual element
  feedback_correct       String? // Positive feedback message
  feedback_incorrect     String? // Negative feedback message
  challenge_type         String? // Challenge category (sequence, categorization, etc.)
  difficulty_level       String  // beginner|intermediate|advanced
  challenge_order        Int     // Order within lesson
  lessons                lessons @relation(...)
}
```

- **Purpose**: Rapid-fire timed challenges for pattern recognition and quick thinking
- **Features**: Per-challenge timer, difficulty progression, instant feedback
- **Scoring**: Tracks correct answers and displays completion percentage

#### 13. **closing_exam_contents** - Unit closing assessment questions

```prisma
model closing_exam_contents {
  id                     Int     @id @default(autoincrement())
  lesson_id              Int     // Foreign key to lessons
  title                  String  // Question title
  description            String? // Question context/description
  time_limit             Int     // Exam time limit in seconds
  question               String  // Exam question text
  correct_answer         String  // Correct answer option
  option_b               String  // Alternative answer (B)
  option_c               String  // Alternative answer (C)
  option_d               String? // Optional answer (D)
  passing_score          Int     // Minimum percentage to pass (default: 70)
  difficulty_level       String  // beginner|intermediate|advanced
  question_order         Int     // Order within exam
  points_value           Int     // Points awarded for correct answer
  feedback_correct       String? // Positive feedback message
  feedback_incorrect     String? // Negative feedback message
  lessons                lessons @relation(...)
}
```

- **Purpose**: Comprehensive unit assessments with passing criteria
- **Features**: Point-based scoring, overall time limit, cumulative scoring
- **Assessment**: Displays pass/fail status and percentage score

#### 14. **tags** - Lesson categorization labels

```prisma
model tags {
  id         Int          @id @default(autoincrement())
  slug       String       @unique
  name       String       // Display name
  lesson_tag lesson_tag[] // Many-to-many with lessons
}
```

#### 15. **lesson_tag** - Junction table for many-to-many relationship

```prisma
model lesson_tag {
  lesson_id Int
  tag_id    Int
  lessons   lessons @relation(...)
  tags      tags    @relation(...)
  
  @@id([lesson_id, tag_id])  // Composite primary key
}
```

### Database Relationships

```
courses (1) ──── (N) topics
   ↓                   ↓
              (N) lessons (1)
                   ├── (N) video_contents
                   ├── (N) reading_contents
                   │        └── (N) glossary_items
                   ├── (N) flashcard_contents
                   ├── (N) drag_drop_contents
                   └── (N) lesson_tag ──── (N) tags
```

### Database Entity Relationship Diagram

```mermaid
erDiagram
    COURSES ||--o{ TOPICS : has
    TOPICS ||--o{ LESSONS : contains
    LESSONS ||--o{ VIDEO_CONTENTS : includes
    LESSONS ||--o{ READING_CONTENTS : includes
    LESSONS ||--o{ FLASHCARD_CONTENTS : includes
    LESSONS ||--o{ DRAG_DROP_CONTENTS : includes
    LESSONS ||--o{ VISIO_ACOUSTIC_CONTENTS : includes
    LESSONS ||--o{ WRITING_CHALLENGE_CONTENTS : includes
    LESSONS ||--o{ MENTAL_AGILITY_CONTENTS : includes
    LESSONS ||--o{ CLOSING_EXAM_CONTENTS : includes
    LESSONS ||--o{ LESSON_TAG : "is tagged"
    READING_CONTENTS ||--o{ GLOSSARY_ITEMS : defines
    TAGS ||--o{ LESSON_TAG : "tagged by"

    COURSES {
        string slug PK
        int id
        string title
        string description
    }

    TOPICS {
        int id PK
        string slug UK
        string title
        string course_slug FK
    }

    LESSONS {
        int id PK
        string uuid UK
        int topic_id FK
        string type "enum: video|flashcards|drag_drop|reading|visio_acoustic|writing_challenges|mental_agility|closing_exam"
        string title
        string description
        string slug
    }

    VIDEO_CONTENTS {
        int id PK
        int lesson_id FK
        string url
        string description
        int duration "in seconds"
    }

    READING_CONTENTS {
        int id PK
        int lesson_id FK
        string text "full reading material"
    }

    GLOSSARY_ITEMS {
        int id PK
        int reading_id FK
        string word
        string definition
        string image_url
        string synonym_english
    }

    FLASHCARD_CONTENTS {
        int id PK
        int lesson_id FK
        string front_image
        string back_title
        string back_pronunciation
        string lang "e.g., 'es', 'fr'"
    }

    DRAG_DROP_CONTENTS {
        int id PK
        int lesson_id FK
        string text
        string category
        string feedback_message_wrong
    }

    VISIO_ACOUSTIC_CONTENTS {
        int id PK
        int lesson_id FK
        string question_text
        string sound_url
        string image_url
        string correct_answer
        string difficulty_level
    }

    WRITING_CHALLENGE_CONTENTS {
        int id PK
        int lesson_id FK
        string title
        string prompt
        int min_words
        int max_words
        string difficulty_level
    }

    MENTAL_AGILITY_CONTENTS {
        int id PK
        int lesson_id FK
        string title
        string prompt
        int time_limit "in seconds"
        string correct_answer
        string challenge_type
        string difficulty_level
    }

    CLOSING_EXAM_CONTENTS {
        int id PK
        int lesson_id FK
        string title
        string question
        int time_limit "in seconds"
        string correct_answer
        int passing_score "percentage"
        int points_value
        string difficulty_level
    }

    TAGS {
        int id PK
        string slug UK
        string name
    }

    LESSON_TAG {
        int lesson_id PK_FK
        int tag_id PK_FK
    }
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ (recommend 20+)
- **PostgreSQL** 12+ (or Prisma-hosted database)
- **npm** or **yarn** package manager
- **.env.local** file with `DATABASE_URL`

### Quick Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
echo "DATABASE_URL=postgresql://user:password@localhost:5432/malttalk" > .env.local

# 3. Setup database
npx prisma migrate dev --name init
npx prisma generate

# 4. Start development server
npm run dev
```

**Open**: [http://localhost:3000](http://localhost:3000)

### Database Seeding (Optional)

Populate your database with example data including an English course with all 8 content types:

```bash
# Seed database with example data
npx tsx ./prisma/seedRaw.ts

# Or reset database and seed
npx prisma migrate reset --force
npx tsx ./prisma/seedRaw.ts
```

**Example Data Created**:
- 1 Course: English (Complete English course from beginner to advanced level)
- 1 Tag: General
- 6 Topics: Greetings, Daily Vocabulary, Pronunciation, Grammar, Writing, Review
- 8 Lessons: One lesson for each content type with representative data

This provides a fully functional demo with:
- 📹 Video Lesson
- 🎴 Flashcards (3 cards)
- 🎯 Drag-Drop Exercise (3 items)
- 📖 Reading with Glossary (3 vocabulary items)
- 🎬 Visio-Acoustic Quiz (2 questions)
- ✍️ Writing Challenges (2 prompts)
- 🧠 Mental Agility (2 timed challenges)
- 📋 Closing Exam (3 assessment questions)

### Build & Deployment

```bash
# Production build
npm run build

# Start production server
npm start

# TypeScript check
npm run type-check

# Lint code
npm run lint
```

### Useful Scripts

```bash
npm run dev                 # Start dev server with Turbopack
npm run build              # Build for production
npm run start              # Run production server
npm run prisma:studio      # Open Prisma Studio (visual DB browser)
npm run prisma:migrate     # Create/apply migrations
npm run prisma:generate    # Regenerate Prisma types
npm run db:seed            # Seed database with example data
npm run db:reset           # Reset database and seed with examples
npm run type-check         # Run TypeScript compiler
npm run lint               # Run ESLint
```

## 🎛️ Admin Panel & API

### Admin Interface (`/admin`)

Complete CRUD management with 5 organized tabs:

#### Tab 1: 📚 **Courses** - Language course management
- Create new courses with slug and title
- View all courses
- Edit course metadata
- Delete courses (cascades to topics/lessons)

#### Tab 2: 📑 **Topics** - Learning module organization
- Create topics within courses
- Associate lessons by topic
- Edit/delete topics
- Filter topics by course

#### Tab 3: 📖 **Lessons** - Learning unit creation
- Create lessons with 4 content types
- Select lesson type (video, flashcards, drag-drop, reading)
- Manage lesson metadata
- Real-time lesson list display

#### Tab 4: 🏷️ **Tags** - Lesson categorization
- Create reusable tags/keywords
- Tag lessons for organization
- Manage tag categories
- Full CRUD operations

#### Tab 5: 📚 **Content Management**
- Add/edit video content (with duration tracking)
- Create flashcard decks
- Build drag-drop exercises
- Manage reading materials with glossary
- Create mental agility challenges with timers
- Build closing exam assessments

#### Tab 6-8: **Content Creators** (when needed)
- Mental agility challenges management
- Closing exam questions management
- Writing challenges administration

### RESTful API Endpoints

All endpoints follow REST conventions with comprehensive error handling and validation.

#### **Admin Endpoints** (Protected)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/admin/courses` | GET | List all courses |
| `/api/admin/courses` | POST | Create new course |
| `/api/admin/courses` | PUT | Update course |
| `/api/admin/courses?slug=X` | DELETE | Delete course |
| `/api/admin/topics` | GET\|POST\|PUT\|DELETE | Topic CRUD |
| `/api/admin/lessons` | GET\|POST\|PUT\|DELETE | Lesson CRUD |
| `/api/admin/tags` | GET\|POST\|PUT\|DELETE | Tag CRUD |
| `/api/admin/video-contents` | GET\|POST\|PUT\|DELETE | Video CRUD |
| `/api/admin/reading-contents` | GET\|POST\|PUT\|DELETE | Reading CRUD |
| `/api/admin/flashcard-contents` | GET\|POST\|PUT\|DELETE | Flashcard CRUD |
| `/api/admin/drag-drop-contents` | GET\|POST\|PUT\|DELETE | Exercise CRUD |
| `/api/admin/glossary-items` | GET\|POST\|PUT\|DELETE | Glossary CRUD |
| `/api/admin/visio-acoustic-contents` | GET\|POST\|PUT\|DELETE | Audio-visual quiz CRUD |
| `/api/admin/writing-challenges` | GET\|POST\|PUT\|DELETE | Writing challenge CRUD |
| `/api/admin/mental-agility` | GET\|POST\|PUT\|DELETE | Mental agility challenge CRUD |
| `/api/admin/closing-exam` | GET\|POST\|PUT\|DELETE | Closing exam question CRUD |

#### **Public Endpoints**

```bash
# Fetch lesson by UUID (for sharing)
GET /api/lessons/{uuid}

# Get all lessons with metadata
GET /api/debug/lessons
```

### API Response Format

**Success (200/201)**:
```json
{
  "id": 1,
  "slug": "greeting",
  "title": "Hello Lesson",
  "type": "video"
}
```

**Error (400/404/500)**:
```json
{
  "error": "slug and title are required"
}
```

## 🏗️ Architecture & Code Organization

### Frontend Architecture

**Page Structure**:
```
layout.tsx (Root)
├── page.tsx (Landing Page)
│   ├── Hero section
│   ├── Features showcase
│   ├── Skills display
│   ├── Levels tiers
│   └── Call-to-action
├── admin/page.tsx (Admin Panel)
│   ├── 5-tab navigation
│   ├── Course management
│   ├── Topic organization
│   ├── Lesson creation
│   ├── Tag management
│   └── Content CRUD
└── module/[course]/
    ├── page.tsx (Course catalog)
    ├── dashboard/page.tsx (Student dashboard with progress)
    └── [lesson]/page.tsx (Content player)
        ├── VideoDiv component
        ├── FlashcardsDiv component
        ├── DragDropDiv component
        └── ReadingDiv component
```

### Server-Side Architecture

```
API Request
    ↓
Next.js API Route (/api/*)
    ↓
Input Validation & Type Checking
    ↓
Prisma ORM Query Builder
    ↓
PostgreSQL Database
    ↓
Response Formatting & JSON
    ↓
Client Application
```

### Data Flow

1. **Landing Page** - Static marketing content
2. **Course Listing** - Server action fetches courses from database
3. **Dashboard** - Real-time progress tracking with Prisma queries
4. **Lesson Player** - Dynamic content rendering based on lesson type
5. **Admin Panel** - CRUD operations through typed API routes
6. **Database** - PostgreSQL with connection pooling

### Code Optimization

- **Singleton Pattern**: Prisma client initialized once per app
- **Type Safety**: Full TypeScript with strict mode
- **Error Handling**: Consistent error logging with timestamps
- **Validation**: Input validation on all API routes
- **Performance**: Server-side rendering where applicable
- **Caching**: Optimized Prisma queries with intelligent includes

## 🎨 UI/UX Design

### Color System

**Light Mode**:
- Background: White/Blue-50
- Text: Gray-900
- Primary: Blue-600/Cyan-500
- Borders: Blue-200/Gray-200

**Dark Mode** (via `dark:` classes):
- Background: Slate-950/Slate-900
- Text: White
- Primary: Blue-400/Cyan-300
- Borders: Blue-950/Slate-800

### Component Features

- **Responsive**: Mobile-first design
- **Accessible**: WCAG 2.1 AA compliant
- **Interactive**: Smooth transitions and hover effects
- **Modern**: Glassmorphism and gradient effects
- **Consistent**: Design system across all pages
- **Gamified**: Progress bars, color coding, motivational elements

## 📊 Database Optimization

### Connection Strategy
- **Adapter**: @prisma/adapter-pg for connection pooling
- **Pooling**: Managed connection reuse
- **Migrations**: Versioned schema changes with rollback support

### Query Optimization
- **Includes**: Strategic use of Prisma `include` for nested data
- **Filtering**: Client-side filtering where appropriate
- **Ordering**: Consistent sorting for pagination
- **Caching**: Leverage browser/server cache headers

## 🔒 Security Considerations

### Current Implementation
- Environment variables for sensitive data
- PostgreSQL with secure connection strings
- API route validation and sanitization
- TypeScript for type safety
- Error message obfuscation in production

### Recommendations for Production
- Implement authentication middleware
- Add rate limiting to API routes
- Use CORS properly for cross-origin requests
- Enable HTTPS/TLS encryption
- Implement API key or JWT authentication
- Regular security audits



