import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  console.error("Make sure .env.local is loaded (use: npx tsx --env-file=.env.local scripts/seed.ts)");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const ALBUMS = [
  { id: "4LH4d3cOWNNsVw41Gqt2kv", name: "The Dark Side of the Moon", artist: "Pink Floyd", image: "https://i.scdn.co/image/ab67616d0000b273db216ca805faf5fe35df4ee6" },
  { id: "1j2x7FJXTgUT0X5hZ8TDXE", name: "Dark Sky Paradise", artist: "Big Sean", image: "https://i.scdn.co/image/ab67616d0000b27350192d5f728fea13fb3af203" },
  { id: "35voVqYGkotyJ945O9egDY", name: "Dark & Wild", artist: "BTS", image: "https://i.scdn.co/image/ab67616d0000b273abe7090bc3ae94d741dfaf6b" },
  { id: "6OQ9gBfg5EXeNAEwGSs6jK", name: "Dark Lane Demo Tapes", artist: "Drake", image: "https://i.scdn.co/image/ab67616d0000b273bba7cfaf7c59ff0898acba1f" },
  { id: "09asAAZJ7rXedp9J8wqvBR", name: "Dark Before Dawn", artist: "Breaking Benjamin", image: "https://i.scdn.co/image/ab67616d0000b2738b1dc76f3a0cc8381b012e24" },
  { id: "0GQ9AZBJSj109gmSdSrviC", name: "Dark Horse", artist: "Nickelback", image: "https://i.scdn.co/image/ab67616d0000b273f74baf63e915712df348e647" },
  { id: "7vrsFZNVhrriKh0SZKJW41", name: "Dark Red", artist: "Steve Lacy", image: "https://i.scdn.co/image/ab67616d0000b2733d2dfa42f771cd458b194979" },
  { id: "5t5BES3FsvBvL21Fg6x1AA", name: "Dark Souls 3 OST", artist: "FromSoftware", image: "https://i.scdn.co/image/ab67616d0000b2735b8b6bc0bd351d7129386d7f" },
];

const REVIEW_TEXTS = [
  "Absolute masterpiece. Every track hits different.",
  "Production is insane, been on repeat for weeks.",
  "Not their best work but still solid. A few skips.",
  "This album changed my perspective on the genre.",
  "Overhyped. A couple good tracks but mostly mid.",
  "The beat selection on this is unmatched.",
  "Grew on me after a few listens. Now I love it.",
  "Classic. Nothing more needs to be said.",
  null,
  null,
  "Sonically beautiful. The mixing is chef's kiss.",
  "Expected more honestly. Still decent though.",
  null,
  "Top 5 album of the year for me.",
  "Every song is a vibe. Perfect late night album.",
];

async function seed() {
  console.log("Starting seed...\n");

  const users: { id: string; username: string }[] = [];
  const demoUsers = [
    { email: "musiclover42@demo.lamp", password: "demo-password-123!", username: "musiclover42" },
    { email: "vinylhead@demo.lamp", password: "demo-password-123!", username: "vinylhead" },
    { email: "basshead99@demo.lamp", password: "demo-password-123!", username: "basshead99" },
  ];

  for (const u of demoUsers) {
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", u.username)
      .single();

    if (existingProfile) {
      console.log(`  User ${u.username} already exists, skipping`);
      users.push({ id: existingProfile.id, username: u.username });
      continue;
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
    });

    if (error) {
      console.error(`  Failed to create user ${u.username}:`, error.message);
      continue;
    }

    await supabase.from("profiles").insert({
      id: data.user.id,
      username: u.username,
      favorite_genres: ["Rock", "Hip-Hop", "Electronic"].slice(0, Math.floor(Math.random() * 3) + 1),
    });

    users.push({ id: data.user.id, username: u.username });
    console.log(`  Created user: ${u.username}`);
  }

  if (users.length === 0) {
    console.error("No users available. Check your SUPABASE_SERVICE_ROLE_KEY.");
    return;
  }

  let reviewCount = 0;
  for (const album of ALBUMS) {
    const reviewerCount = Math.floor(Math.random() * users.length) + 1;
    const shuffledUsers = [...users].sort(() => Math.random() - 0.5).slice(0, reviewerCount);

    for (const user of shuffledUsers) {
      const rating = Math.floor(Math.random() * 3) + 3;
      const reviewText = REVIEW_TEXTS[Math.floor(Math.random() * REVIEW_TEXTS.length)];

      const { error } = await supabase.from("reviews").insert({
        user_id: user.id,
        spotify_album_id: album.id,
        album_name: album.name,
        album_artist: album.artist,
        album_image_url: album.image,
        rating,
        review_text: reviewText,
      });

      if (error) {
        if (error.code === "23505") {
          console.log(`  Review already exists: ${user.username} -> ${album.name}`);
        } else {
          console.error(`  Failed to insert review:`, error.message);
        }
      } else {
        reviewCount++;
      }
    }
  }

  console.log(`\nSeed complete: ${users.length} users, ${reviewCount} reviews`);
}

seed().catch(console.error);
