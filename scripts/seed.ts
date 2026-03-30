import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// All IDs and images verified via Spotify API on 2026-03-29
const ALBUMS = [
  { id: "3DGQ1iZ9XKUQxAUWjfC34w", name: "good kid, m.A.A.d city", artist: "Kendrick Lamar", image: "https://i.scdn.co/image/ab67616d0000b273d58e537cea05c2156792c53d" },
  { id: "4eLPsYPBmXABThSJ821sqY", name: "DAMN.", artist: "Kendrick Lamar", image: "https://i.scdn.co/image/ab67616d0000b2738b52c6b9bc4e43d873869699" },
  { id: "7ycBtnsMtyVbbwTfJwRjSP", name: "To Pimp A Butterfly", artist: "Kendrick Lamar", image: "https://i.scdn.co/image/ab67616d0000b273cdb645498cd3d8a2db4d05e1" },
  { id: "20r762YmB5HeofjMCiPMLv", name: "My Beautiful Dark Twisted Fantasy", artist: "Kanye West", image: "https://i.scdn.co/image/ab67616d0000b273d9194aa18fa4c9362b47464f" },
  { id: "5zi7WsKlIiUXv09tbGLKsE", name: "IGOR", artist: "Tyler, The Creator", image: "https://i.scdn.co/image/ab67616d0000b27330a635de2bb0caa4e26f6abb" },
  { id: "41GuZcammIkupMPKH2OJ6I", name: "ASTROWORLD", artist: "Travis Scott", image: "https://i.scdn.co/image/ab67616d0000b273daec894c14c0ca42d76eeb32" },
  { id: "76290XdXVF9rPzGdNRWdCh", name: "Ctrl", artist: "SZA", image: "https://i.scdn.co/image/ab67616d0000b27306d56b057cce5797538a16d5" },
  { id: "6OQ9gBfg5EXeNAEwGSs6jK", name: "Dark Lane Demo Tapes", artist: "Drake", image: "https://i.scdn.co/image/ab67616d0000b273bba7cfaf7c59ff0898acba1f" },
  { id: "3mH6qwIy9crq0I9YQbOuDf", name: "Blonde", artist: "Frank Ocean", image: "https://i.scdn.co/image/ab67616d0000b273c5649add07ed3720be9d5526" },
  { id: "392p3shh2jkxUxY2VHvlH8", name: "channel ORANGE", artist: "Frank Ocean", image: "https://i.scdn.co/image/ab67616d0000b2737aede4855f6d0d738012e2e5" },
  { id: "1ZJIMQ7fTy5Aw7InjQtvnO", name: "After Hours", artist: "The Weeknd", image: "https://i.scdn.co/image/ab67616d0000b273e8474672b04120e68dd29211" },
  { id: "2ODvWsOgouMbaA5xf0RkJe", name: "Starboy", artist: "The Weeknd", image: "https://i.scdn.co/image/ab67616d0000b2734718e2b124f79258be7bc452" },
  { id: "2ANVost0y2y52ema1E9xAZ", name: "Thriller", artist: "Michael Jackson", image: "https://i.scdn.co/image/ab67616d0000b27332a7d87248d1b75463483df5" },
  { id: "0Lg1uZvI312TPqxNWShFXL", name: "21", artist: "Adele", image: "https://i.scdn.co/image/ab67616d0000b2737e7e5dd9d1ab19fcded8a17f" },
  { id: "2QJmrSgbdM35R67eoGQo4j", name: "1989", artist: "Taylor Swift", image: "https://i.scdn.co/image/ab67616d0000b2739abdf14e6058bd3903686148" },
  { id: "7dK54iZuOxXFarGhXwEXfF", name: "Lemonade", artist: "Beyoncé", image: "https://i.scdn.co/image/ab67616d0000b2738db37bc9a58543471bee78c5" },
  { id: "7fJJK56U9fHixgO0HQkhtI", name: "Future Nostalgia", artist: "Dua Lipa", image: "https://i.scdn.co/image/ab67616d0000b273c88bae7846e62a8ba59ee0bd" },
  { id: "4X8hAqIWpQyQks2yRhyqs4", name: "Born To Die", artist: "Lana Del Rey", image: "https://i.scdn.co/image/ab67616d0000b273a1c37f3fd969287c03482c3b" },
  { id: "4LH4d3cOWNNsVw41Gqt2kv", name: "The Dark Side of the Moon", artist: "Pink Floyd", image: "https://i.scdn.co/image/ab67616d0000b273db216ca805faf5fe35df4ee6" },
  { id: "6dVIqQ8qmQ5GBnJ9shOYGE", name: "OK Computer", artist: "Radiohead", image: "https://i.scdn.co/image/ab67616d0000b273c8b444df094279e70d0ed856" },
  { id: "5vkqYmiPBYLaalcmjujWxK", name: "In Rainbows", artist: "Radiohead", image: "https://i.scdn.co/image/ab67616d0000b273de3c04b5fc750b68899b20a9" },
  { id: "2guirTSEqLizK7j9i1MTTZ", name: "Nevermind", artist: "Nirvana", image: "https://i.scdn.co/image/ab67616d0000b273e175a19e530c898d167d39bf" },
  { id: "1bt6q2SruMsBtcerNVtpZB", name: "Rumours", artist: "Fleetwood Mac", image: "https://i.scdn.co/image/ab67616d0000b27357df7ce0eac715cf70e519a7" },
  { id: "4m2880jivSbbyEGAKfITCa", name: "Random Access Memories", artist: "Daft Punk", image: "https://i.scdn.co/image/ab67616d0000b2739b9b36b0e22870b9f542d937" },
  { id: "2noRn2Aes5aoNVsU6iWThc", name: "Discovery", artist: "Daft Punk", image: "https://i.scdn.co/image/ab67616d0000b2731e81bff9807a9e629fce5ade" },
  { id: "79dL7FLiJFOO0EoehUHQBv", name: "Currents", artist: "Tame Impala", image: "https://i.scdn.co/image/ab67616d0000b2739e1cfc756886ac782e363d79" },
  { id: "78bpIziExqiI9qztvNFlQu", name: "AM", artist: "Arctic Monkeys", image: "https://i.scdn.co/image/ab67616d0000b2734ae1c4c5c45aabe565499163" },
  { id: "2B87zXm9bOWvAJdkJBTpzF", name: "Melodrama", artist: "Lorde", image: "https://i.scdn.co/image/ab67616d0000b273f8553e18a11209d4becd0336" },
  { id: "3RQQmkQEvNCY4prGKE6oc5", name: "Un Verano Sin Ti", artist: "Bad Bunny", image: "https://i.scdn.co/image/ab67616d0000b27349d694203245f241a1bcaa72" },
  { id: "35voVqYGkotyJ945O9egDY", name: "Dark & Wild", artist: "BTS", image: "https://i.scdn.co/image/ab67616d0000b273abe7090bc3ae94d741dfaf6b" },
  { id: "0ETFjACtuP2ADo6LFhL6HN", name: "Abbey Road", artist: "The Beatles", image: "https://i.scdn.co/image/ab67616d0000b273dc30583ba717007b00cceb25" },
  { id: "6mUdeDZCsExyJLMdAfDuwh", name: "Back In Black", artist: "AC/DC", image: "https://i.scdn.co/image/ab67616d0000b273ff191d7fbdb5a13eaf84132b" },
];

const USERNAMES = [
  "musiclover42", "vinylhead", "basshead99", "melodymaven", "rhythmrider",
  "sonicsurfer", "beatsmith", "tunechaser", "albumaddict", "soundscape",
  "grooveking", "notejunkie", "trackstar", "audiophile_x", "wavewatcher",
  "lofiLisa", "synthkid", "drumroll_", "bassline_bro", "echoecho",
  "vibecheck01", "recordflip", "decibeldave", "lyriclouise", "mixmaster_m",
  "fadein_", "subwoofer22", "treblehook", "chordcraft", "ampsup",
  "stereoSteve", "mono_mia", "rewindRay", "skiptrack", "deepcuts",
  "analogAnna", "bpmQueen", "mashupMax", "soloSam", "riffRider",
];

const ALL_GENRES = [
  "Rock", "Pop", "Hip-Hop", "R&B", "Jazz", "Classical", "Electronic",
  "Country", "Folk", "Metal", "Punk", "Indie", "Blues", "Soul",
  "Reggae", "Latin", "K-Pop", "Alternative",
];

const REVIEW_TEXTS: (string | null)[] = [
  // Enthusiastic
  "Absolute masterpiece. Every track hits different.",
  "Been on repeat for two weeks straight and I'm still not tired of it.",
  "This might be album of the year honestly. No skips whatsoever.",
  "Played this for my roommate and now we're both obsessed lol.",
  "Okay I was NOT expecting this to go that hard. Completely blew me away.",
  "I literally got chills on the third track. The production is unreal.",
  "10/10 no notes. This is what music should sound like.",
  "My friends are tired of me talking about this album but I can't stop.",
  "Put this on during a road trip and everyone in the car was vibing.",
  "Downloaded this on a whim and it ended up being my most played album this month.",
  "The way they layered the vocals on track 5... goosebumps every time.",
  "I don't say this lightly but this is a genuine classic in the making.",
  "Stayed up until 3am listening to this on repeat. Worth every minute.",
  "Haven't felt this way about an album since I was in high school.",
  // Positive but measured
  "Really solid project. A couple tracks I skip but overall it's great.",
  "Grew on me after a few listens. Didn't click at first but now I get it.",
  "Good album but I think their previous one was slightly better.",
  "The first half is incredible, second half loses a bit of steam.",
  "Exactly what I wanted from them. Nothing groundbreaking but consistently good.",
  "Solid 4/5. Would've been a 5 if the last two tracks were stronger.",
  "Not every song is a hit but the ones that land REALLY land.",
  "Wish it was a couple tracks shorter. The filler drags it down a bit.",
  "This is the kind of album you put on when you just want to feel something.",
  "Every listen I catch something new. Super well-produced.",
  "Good vibes all around. Perfect for studying or just chilling.",
  // Mixed / Critical
  "I can see why people love this but honestly it's not for me.",
  "Some tracks are amazing but others feel really phoned in.",
  "Expected way more from this. Feels like they played it safe.",
  "The singles were better than the album cuts. Disappointing.",
  "It's fine. Nothing wrong with it but nothing that makes me want to revisit.",
  "I respect the artistic vision even if I don't love the execution.",
  "Two or three great songs surrounded by a lot of mid. Frustrating.",
  "Overhyped on social media. It's decent but not the masterpiece people claim.",
  "Had high hopes but it just didn't connect with me. Maybe I need more listens.",
  // Nostalgic / Emotional
  "This album got me through a really rough semester. Means a lot to me.",
  "Takes me back to summer 2023 every time I hear it. Pure nostalgia.",
  "Listened to this during a breakup and it hit completely different.",
  "My dad played this when I was a kid and I just now realized how good it is.",
  "This is the soundtrack to my late night drives. Can't imagine life without it.",
  "Brings back so many memories. Music really is powerful.",
  // Analytical
  "The transition between tracks 3 and 4 is genuinely one of the best I've heard.",
  "The mixing on this is so clean. You can hear every instrument perfectly.",
  "Bold choice to open with the slowest track. Paid off though.",
  "Interesting how they blend genres without it feeling forced. Rare talent.",
  "The bass on this album is ridiculous. Sounds incredible on good headphones.",
  "Lyrically their strongest work. Every bar is intentional.",
  // Short casual
  "Banger after banger after banger.",
  "This goes crazy ngl.",
  "W album. That's all I gotta say.",
  "Yeah this one's going in the rotation for a while.",
  "Fire. Just pure fire.",
  "Mid but I'll give it another chance.",
  "Not bad not great. It's aight.",
  "Slept on this for way too long. What was I thinking.",
  null, null, null,
];

const BIOS = [
  "", "Music is life.", "Album collector.", "Just here for the vibes.",
  "Hip-hop head.", "Rock enthusiast.", "Indie forever.", "Vinyl only.",
  "I rate honestly.", "Exploring new sounds.", "Genre agnostic.",
  "If it slaps, it slaps.", "Late night listener.", "Headphones on, world off.",
  "Rating every album I hear.", "No skips allowed.", "Bass is everything.",
  "Audiophile in training.", "Living through music.", "One album at a time.",
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function randomDate(maxDaysBack: number): string {
  const now = Date.now();
  const recencyBias = Math.random() * Math.random(); // clusters toward recent
  const daysAgo = Math.floor(recencyBias * maxDaysBack);
  const offset = (daysAgo || 1) * 24 * 60 * 60 * 1000;
  return new Date(now - offset).toISOString();
}

async function seed() {
  const resetArg = process.argv.includes("--reset");

  if (resetArg) {
    console.log("Resetting: deleting all reviews...");
    await supabase.from("reviews").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    console.log("Done.\n");
  }

  console.log("Starting seed...\n");

  // --- Create users ---
  const users: { id: string; username: string }[] = [];

  for (const username of USERNAMES) {
    const email = `${username}@demo.lamp`;
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .single();

    if (existingProfile) {
      users.push({ id: existingProfile.id, username });
      continue;
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password: "demo-password-123!",
      email_confirm: true,
    });

    if (error) {
      console.error(`  Failed to create user ${username}:`, error.message);
      continue;
    }

    await supabase.from("profiles").insert({
      id: data.user.id,
      username,
      favorite_genres: pickN(ALL_GENRES, Math.floor(Math.random() * 5) + 1),
      bio: pickRandom(BIOS),
    });

    users.push({ id: data.user.id, username });
    process.stdout.write(".");
  }
  console.log(`\n  ${users.length} users ready\n`);

  if (users.length === 0) {
    console.error("No users available. Aborting.");
    return;
  }

  // --- Create reviews: 15-35 per album = ~500-800 total ---
  let reviewCount = 0;
  let skipCount = 0;

  for (const album of ALBUMS) {
    const numReviewers = Math.floor(Math.random() * 21) + 15; // 15-35
    const reviewers = pickN(users, Math.min(numReviewers, users.length));

    for (const user of reviewers) {
      const ratingRoll = Math.random();
      let rating: number;
      if (ratingRoll < 0.03) rating = 1;
      else if (ratingRoll < 0.10) rating = 2;
      else if (ratingRoll < 0.28) rating = 3;
      else if (ratingRoll < 0.58) rating = 4;
      else rating = 5;

      const { error } = await supabase.from("reviews").insert({
        user_id: user.id,
        spotify_album_id: album.id,
        album_name: album.name,
        album_artist: album.artist,
        album_image_url: album.image,
        rating,
        review_text: pickRandom(REVIEW_TEXTS),
        created_at: randomDate(90),
      });

      if (error) {
        if (error.code === "23505") skipCount++;
        else console.error(`  Failed:`, error.message);
      } else {
        reviewCount++;
      }
    }
    process.stdout.write(".");
  }

  console.log(`\n\nSeed complete: ${users.length} users, ${reviewCount} new reviews (${skipCount} duplicates skipped)`);
}

seed().catch(console.error);
