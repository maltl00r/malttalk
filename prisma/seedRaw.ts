import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://n8n:1207415660n8n@maltloor.com:5432/malttalk?schema=public",
});

async function seed() {
  const client = await pool.connect();

  try {
    console.log("🌱 Starting database seeding...\n");

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await client.query("DELETE FROM icebreaker_contents;");
    await client.query("DELETE FROM listening_contents;");
    await client.query("DELETE FROM grammar_guides_contents;");
    await client.query("DELETE FROM closing_exam_contents;");
    await client.query("DELETE FROM mental_agility_contents;");
    await client.query("DELETE FROM writing_challenge_contents;");
    await client.query("DELETE FROM visio_acoustic_contents;");
    await client.query("DELETE FROM glossary_items;");
    await client.query("DELETE FROM reading_contents;");
    await client.query("DELETE FROM drag_drop_contents;");
    await client.query("DELETE FROM flashcard_contents;");
    await client.query("DELETE FROM video_contents;");
    await client.query("DELETE FROM lesson_tag;");
    await client.query("DELETE FROM lessons;");
    await client.query("DELETE FROM tags;");
    await client.query("DELETE FROM topics;");
    await client.query("DELETE FROM courses;");
    console.log("✓ Cleared all existing data\n");

    // Create course
    console.log("📚 Creating course...");
    const courseResult = await client.query(
      `INSERT INTO courses (slug, title, description) VALUES ($1, $2, $3) RETURNING id`,
      ["english", "English", "Complete English course from beginner to advanced level"]
    );
    console.log(`✓ Created course: English\n`);

    // Create tag
    console.log("🏷️  Creating tag...");
    const tagResult = await client.query(
      `INSERT INTO tags (slug, name) VALUES ($1, $2) RETURNING id`,
      ["general", "General"]
    );
    const tagId = tagResult.rows[0].id;
    console.log(`✓ Created tag: General\n`);

    // Create topics
    console.log("📖 Creating topics...");
    const topics = [
      { slug: "greetings", title: "Saludos & Presentaciones" },
      { slug: "daily-vocabulary", title: "Vocabulario Diario" },
      { slug: "pronunciation", title: "Pronunciación & Listening" },
      { slug: "grammar-basics", title: "Fundamentos Gramaticales" },
      { slug: "writing-skills", title: "Habilidades de Escritura" },
      { slug: "unit-one-review", title: "Revisión de Unidad 1" },
    ];

    const topicIds: { [key: string]: number } = {};
    for (const topic of topics) {
      const result = await client.query(
        `INSERT INTO topics (course_slug, slug, title) VALUES ($1, $2, $3) RETURNING id`,
        ["english", topic.slug, topic.title]
      );
      topicIds[topic.slug] = result.rows[0].id;
    }
    console.log(`✓ Created ${topics.length} topics\n`);

    // Create 11 lessons
    console.log("📚 Creating 11 lessons...\n");
    const lessonTypes = [
      { type: "video", title: "Introduction to English", topic: "greetings" },
      { type: "flashcards", title: "Essential Vocabulary", topic: "daily-vocabulary" },
      { type: "drag-drop", title: "Verb Conjugation Practice", topic: "grammar-basics" },
      { type: "reading", title: "My Day - Reading", topic: "unit-one-review" },
      { type: "visio-acoustic", title: "Audio-Visual Pronunciation", topic: "pronunciation" },
      { type: "writing-challenges", title: "Introduction Letter Writing", topic: "writing-skills" },
      { type: "mental-agility", title: "Speed Pattern Recognition", topic: "unit-one-review" },
      { type: "closing-exam", title: "Unit 1 Closing Exam", topic: "unit-one-review" },
      { type: "grammar-guides", title: "Simple Present Tense", topic: "grammar-basics" },
      { type: "listening", title: "Audio Comprehension", topic: "pronunciation" },
      { type: "icebreaker", title: "Real-World Greetings", topic: "greetings" },
    ];

    const emojis = ["🎬", "🎴", "🎯", "📖", "🎵", "✍️", "🧠", "📊", "🎨", "🎧", "🤝"];

    for (let i = 0; i < lessonTypes.length; i++) {
      const lesson = lessonTypes[i];
      const result = await client.query(
        `INSERT INTO lessons (topic_id, type, title, slug, uuid) VALUES ($1, $2, $3, $4, gen_random_uuid()) RETURNING id`,
        [topicIds[lesson.topic], lesson.type, lesson.title, lesson.title.toLowerCase().replace(/\s+/g, "-")]
      );
      const lessonId = result.rows[0].id;

      // Add sample content based on type
      if (lesson.type === "video") {
        await client.query(
          `INSERT INTO video_contents (lesson_id, url, description, duration) VALUES ($1, $2, $3, $4)`,
          [lessonId, "https://example.com/video.mp4", "English basics", 300]
        );
      } else if (lesson.type === "flashcards") {
        await client.query(
          `INSERT INTO flashcard_contents (lesson_id, back_title, back_pronunciation, lang) VALUES ($1, $2, $3, $4)`,
          [lessonId, "Hello", "həˈloʊ", "en"]
        );
      } else if (lesson.type === "reading") {
        await client.query(
          `INSERT INTO reading_contents (lesson_id, text) VALUES ($1, $2)`,
          [lessonId, "Every morning I wake up at 7 AM and start my day..."]
        );
      } else if (lesson.type === "drag-drop") {
        await client.query(
          `INSERT INTO drag_drop_contents (lesson_id, text, category) VALUES ($1, $2, $3)`,
          [lessonId, "I", "subject"]
        );
      } else if (lesson.type === "visio-acoustic") {
        await client.query(
          `INSERT INTO visio_acoustic_contents (lesson_id, question_text, sound_url, image_url, correct_answer, option_b, option_c) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [lessonId, "What greeting?", "https://example.com/audio.mp3", "https://via.placeholder.com/150", "waving", "sitting", "standing"]
        );
      } else if (lesson.type === "writing-challenges") {
        await client.query(
          `INSERT INTO writing_challenge_contents (lesson_id, title, prompt, min_words, max_words) VALUES ($1, $2, $3, $4, $5)`,
          [lessonId, "Introduction", "Write an introduction", 50, 200]
        );
      } else if (lesson.type === "mental-agility") {
        await client.query(
          `INSERT INTO mental_agility_contents (lesson_id, title, prompt, time_limit, correct_answer, option_b, option_c) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [lessonId, "Complete the pattern", "I ___ yesterday", 30, "went", "go", "going"]
        );
      } else if (lesson.type === "closing-exam") {
        await client.query(
          `INSERT INTO closing_exam_contents (lesson_id, title, question, correct_answer, option_b, option_c) VALUES ($1, $2, $3, $4, $5, $6)`,
          [lessonId, "Unit 1 Final Test", "Present of 'to be' for he?", "is", "are", "am"]
        );
      } else if (lesson.type === "grammar-guides") {
        await client.query(
          `INSERT INTO grammar_guides_contents (lesson_id, title, structure_schema, example_sentences) VALUES ($1, $2, $3, $4)`,
          [lessonId, "Simple Present", JSON.stringify({ parts: [] }), JSON.stringify(["I play"])]
        );
      } else if (lesson.type === "listening") {
        await client.query(
          `INSERT INTO listening_contents (lesson_id, title, question, audio_url, image_options, correct_answer) VALUES ($1, $2, $3, $4, $5, $6)`,
          [lessonId, "Listening Exercise", "What?", "https://example.com/audio.mp3", JSON.stringify([{url: "img1", label: "A"}, {url: "img2", label: "B"}]), 0]
        );
      } else if (lesson.type === "icebreaker") {
        await client.query(
          `INSERT INTO icebreaker_contents (lesson_id, title, expression, illustration_url, situation_description) VALUES ($1, $2, $3, $4, $5)`,
          [lessonId, "Hello", "Hello, how are you?", "https://via.placeholder.com/300", "Formal greeting"]
        );
      }

      // Link tag to lesson
      await client.query(
        `INSERT INTO lesson_tag (lesson_id, tag_id) VALUES ($1, $2)`,
        [lessonId, tagId]
      );

      console.log(`${emojis[i]} ${lesson.type.padEnd(20)} ✓`);
    }

    console.log("\n✅ Database seeding completed!");
    console.log("   • 1 Course (English)");
    console.log("   • 6 Topics");
    console.log("   • 11 Lessons (all content types)");
    console.log("   • 1 Tag (General) linked to all 11 lessons");
  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((error) => {
  console.error("Fatal:", error);
  process.exit(1);
});
