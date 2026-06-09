# MaltTalk
Made this new project based on my older one called "Aprende-Idiomas". This is a project based on learning various languages at no cost for the people.
# About this project
MaltTalk’s vision is to make language learning accessible to everyone, especially people who do not have access to paid education or structured learning resources.
The goal is to provide high-quality language education at no cost, using collaborative development and community-driven improvement, so anyone can learn a new language regardless of their economic situation.

## Database Design
```mermaid
erDiagram
    users ||--o{ user_preferences : "tiene"
    tags ||--o{ user_preferences : "es elegida en"
    tags ||--o{ lesson_tags : "asigna enfoque a"
    lessons ||--o{ lesson_tags : "contiene múltiples"
    topics ||--o{ lessons : "agrupa"
    courses ||--o{ topics : "contiene"
    lessons ||--|| video_contents : "tiene detalle"
    lessons ||--o{ flashcard_contents : "incluye"

    users {
        int id PK "SERIAL"
        string name "VARCHAR"
        string email "VARCHAR"
    }

    user_preferences {
        int id PK "SERIAL"
        int user_id FK "REFERENCES users(id)"
        int tag_id FK "REFERENCES tags(id)"
    }

    tags {
        int id PK "SERIAL"
        string slug "VARCHAR (UNIQUE)"
        string name "VARCHAR"
    }

    courses {
        int id PK "SERIAL"
        string slug "VARCHAR (UNIQUE)"
        string title "VARCHAR"
        string description "TEXT"
    }

    topics {
        int id PK "SERIAL"
        string slug "VARCHAR"
        string title "VARCHAR"
        string course_slug "VARCHAR"
    }

    lessons {
        int id PK "SERIAL"
        string uuid "UUID (UNIQUE)"
        int topic_id FK "REFERENCES topics(id)"
        string tipo "VARCHAR (video, flashcards, reading)"
        string title "VARCHAR"
    }

    lesson_tags {
        int id PK "SERIAL"
        int lesson_id FK "REFERENCES lessons(id)"
        int tag_id FK "REFERENCES tags(id)"
    }

    video_contents {
        int id PK "SERIAL"
        int lesson_id FK "REFERENCES lessons(id) [UNIQUE]"
        string url "VARCHAR"
        string description "TEXT"
    }

    flashcard_contents {
        int id PK "SERIAL"
        int lesson_id FK "REFERENCES lessons(id)"
        string front_image "VARCHAR"
        string back_title "VARCHAR"
        string back_pronunciation "VARCHAR"
        string lang "VARCHAR"
    }
```


