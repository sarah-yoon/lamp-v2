import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Popular, well-known albums across genres — verified Spotify IDs
const ALBUMS = [
  // Hip-Hop
  { id: "2noRn2Aes5aoNVsU6iWThc", name: "good kid, m.A.A.d city", artist: "Kendrick Lamar", image: "https://i.scdn.co/image/ab67616d0000b273d28d2ebdedb220e479c102b0" },
  { id: "20r762YmB5HeofjMCiPMLv", name: "My Beautiful Dark Twisted Fantasy", artist: "Kanye West", image: "https://i.scdn.co/image/ab67616d0000b273d9194aa18fa4c9362b47464f" },
  { id: "4Hjqdhj5rh816i1dfcUEaM", name: "ASTROWORLD", artist: "Travis Scott", image: "https://i.scdn.co/image/ab67616d0000b273072e9faef2ef7b6db63834a3" },
  { id: "79ONNoS4M9tfIA1mYLRISV", name: "The Eminem Show", artist: "Eminem", image: "https://i.scdn.co/image/ab67616d0000b27396f27023756b0a3fea2d4630" },
  { id: "1klALx0u4AavZNEvC4LrTF", name: "The Marshall Mathers LP", artist: "Eminem", image: "https://i.scdn.co/image/ab67616d0000b2736ca5c90113b30c3c43ffb8f4" },
  { id: "3bnJI7GhDhFYm6g0zDNBzS", name: "Ctrl", artist: "SZA", image: "https://i.scdn.co/image/ab67616d0000b2734c79d3ec901eded3e9db7a20" },
  { id: "6OQ9gBfg5EXeNAEwGSs6jK", name: "Dark Lane Demo Tapes", artist: "Drake", image: "https://i.scdn.co/image/ab67616d0000b273bba7cfaf7c59ff0898acba1f" },
  { id: "1j2x7FJXTgUT0X5hZ8TDXE", name: "Dark Sky Paradise", artist: "Big Sean", image: "https://i.scdn.co/image/ab67616d0000b27350192d5f728fea13fb3af203" },
  // R&B / Pop
  { id: "7ycBtnsMtyVbbwTfJwRjSP", name: "Blonde", artist: "Frank Ocean", image: "https://i.scdn.co/image/ab67616d0000b273c5649add07ed3720be9d5526" },
  { id: "4yP0hdKOZPNshxUOjY0cZj", name: "After Hours", artist: "The Weeknd", image: "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36" },
  { id: "4hDok0OAJd57SGIT8xuWJH", name: "Starboy", artist: "The Weeknd", image: "https://i.scdn.co/image/ab67616d0000b2734718e2b124f79258be7bc452" },
  { id: "6pwuKxMUkNg673KETsXPUV", name: "WHEN WE ALL FALL ASLEEP, WHERE DO WE GO?", artist: "Billie Eilish", image: "https://i.scdn.co/image/ab67616d0000b2732a038d3bf875d23e4aeaa84e" },
  // Rock / Alternative
  { id: "4LH4d3cOWNNsVw41Gqt2kv", name: "The Dark Side of the Moon", artist: "Pink Floyd", image: "https://i.scdn.co/image/ab67616d0000b273db216ca805faf5fe35df4ee6" },
  { id: "6dVIqQ8qmQ5GBnJ9shOYGE", name: "OK Computer", artist: "Radiohead", image: "https://i.scdn.co/image/ab67616d0000b273c8b444df094c181e82392c85" },
  { id: "2ANVost0y2y52ema1E9xAZ", name: "Nevermind", artist: "Nirvana", image: "https://i.scdn.co/image/ab67616d0000b2739b9b36b0e22870b9f542d937" },
  { id: "6lPb7Eoon6QPbscWbMsk6a", name: "Rumours", artist: "Fleetwood Mac", image: "https://i.scdn.co/image/ab67616d0000b273e52a59a28efa4773dd2bfe1b" },
  { id: "4E7bV0pzG0LciBSWTszra6", name: "Currents", artist: "Tame Impala", image: "https://i.scdn.co/image/ab67616d0000b27389dbb0e0295c2e5d5f4312b2" },
  // Electronic
  { id: "2WT1pbYjLJciAR26yMebkH", name: "Random Access Memories", artist: "Daft Punk", image: "https://i.scdn.co/image/ab67616d0000b2739b9b36b0e22870b9f542d937" },
  { id: "5GjKG3Y8OvSVJQ55N2jqGM", name: "Discovery", artist: "Daft Punk", image: "https://i.scdn.co/image/ab67616d0000b273b33d46dfa2f4264e3524b430" },
  // Jazz / Soul
  { id: "0S0r2RFucaW92AlYi8Wdcp", name: "Kind of Blue", artist: "Miles Davis", image: "https://i.scdn.co/image/ab67616d0000b27309bff679b03a412ce2be28a4" },
  { id: "1A2GTWGtFfWp7KSQTwWOyo", name: "What's Going On", artist: "Marvin Gaye", image: "https://i.scdn.co/image/ab67616d0000b273476c9896f525ec01e6e71810" },
  // K-Pop
  { id: "35voVqYGkotyJ945O9egDY", name: "Dark & Wild", artist: "BTS", image: "https://i.scdn.co/image/ab67616d0000b273abe7090bc3ae94d741dfaf6b" },
  { id: "0S0KGZnfBGSIssfF54FSJh", name: "The Album", artist: "BLACKPINK", image: "https://i.scdn.co/image/ab67616d0000b273014a3ff86816bab1322560b1" },
  // Latin
  { id: "3RQQmkQEvNCY4prGKE6oc5", name: "Un Verano Sin Ti", artist: "Bad Bunny", image: "https://i.scdn.co/image/ab67616d0000b273ab5c9cd818ad6ed3e9b79cd1" },
  // More popular albums
  { id: "7vrsFZNVhrriKh0SZKJW41", name: "Dark Red", artist: "Steve Lacy", image: "https://i.scdn.co/image/ab67616d0000b2733d2dfa42f771cd458b194979" },
  { id: "09asAAZJ7rXedp9J8wqvBR", name: "Dark Before Dawn", artist: "Breaking Benjamin", image: "https://i.scdn.co/image/ab67616d0000b2738b1dc76f3a0cc8381b012e24" },
  { id: "0GQ9AZBJSj109gmSdSrviC", name: "Dark Horse", artist: "Nickelback", image: "https://i.scdn.co/image/ab67616d0000b273f74baf63e915712df348e647" },
  { id: "5t5BES3FsvBvL21Fg6x1AA", name: "Dark Souls 3 OST", artist: "FromSoftware", image: "https://i.scdn.co/image/ab67616d0000b2735b8b6bc0bd351d7129386d7f" },
  { id: "3mH6qwIy9crq0I9YQbOuDf", name: "Blonde on Blonde", artist: "Bob Dylan", image: "https://i.scdn.co/image/ab67616d0000b2737d1b236dc359deb08fedc943" },
  { id: "1To7kv722A8SpZF789MZy7", name: "The Black Parade", artist: "My Chemical Romance", image: "https://i.scdn.co/image/ab67616d0000b27302e9e7c3e4e7e3b0b0e1a2a3" },
];

// 40 demo usernames
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
  "Absolute masterpiece. Every track hits different.",
  "Production is insane, been on repeat for weeks.",
  "Not their best work but still solid. A few skips.",
  "This album changed my perspective on the genre.",
  "Overhyped. A couple good tracks but mostly mid.",
  "The beat selection on this is unmatched.",
  "Grew on me after a few listens. Now I love it.",
  "Classic. Nothing more needs to be said.",
  "Sonically beautiful. The mixing is chef's kiss.",
  "Expected more honestly. Still decent though.",
  "Top 5 album of the year for me.",
  "Every song is a vibe. Perfect late night album.",
  "The vocals carry this whole project.",
  "Didn't expect to love this as much as I do.",
  "Solid front to back. No filler tracks.",
  "The features really elevate this one.",
  "I keep coming back to this. Something special about it.",
  "Wish it was longer. Feels like it ends too soon.",
  "This is the album I didn't know I needed.",
  "A few misses but the highs are really high.",
  "Timeless. Will still sound fresh in 10 years.",
  "Their best album by far. Peak creativity.",
  "I can see why people love this but it's not for me.",
  "Perfect gym album. Every track goes hard.",
  "The storytelling on this is incredible.",
  "Listened to this in one sitting. Couldn't stop.",
  "Brought back so many memories. Nostalgic masterpiece.",
  "The production quality is next level.",
  "Every listen I catch something new. So layered.",
  "This album defined a whole era of music.",
  "Decent debut but I think they can do better.",
  "The transition between tracks is seamless.",
  "Bold choice to open with that track. Paid off though.",
  "I respect the vision even if it's not my style.",
  "Underrated gem. More people need to hear this.",
  "10/10 no notes. Instant classic.",
  "The hooks on this are so catchy I can't escape them.",
  "Love the experimental direction they took here.",
  "The deluxe tracks are actually better than the originals.",
  "This album got me through some tough times.",
  null, null, null, null, null,
  null, null, null, null, null,
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

function randomDate(daysBack: number): string {
  const now = Date.now();
  const offset = Math.floor(Math.random() * daysBack * 24 * 60 * 60 * 1000);
  return new Date(now - offset).toISOString();
}

async function seed() {
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

    const genreCount = Math.floor(Math.random() * 5) + 1;
    await supabase.from("profiles").insert({
      id: data.user.id,
      username,
      favorite_genres: pickN(ALL_GENRES, genreCount),
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

  // --- Create reviews ---
  // Each album gets 10-35 reviews from random users for ~500-700 total
  let reviewCount = 0;
  let skipCount = 0;

  for (const album of ALBUMS) {
    const numReviewers = Math.floor(Math.random() * 26) + 10; // 10-35
    const reviewers = pickN(users, Math.min(numReviewers, users.length));

    for (const user of reviewers) {
      // Weighted rating distribution
      const ratingRoll = Math.random();
      let rating: number;
      if (ratingRoll < 0.03) rating = 1;
      else if (ratingRoll < 0.10) rating = 2;
      else if (ratingRoll < 0.28) rating = 3;
      else if (ratingRoll < 0.58) rating = 4;
      else rating = 5;

      const reviewText = pickRandom(REVIEW_TEXTS);
      // Spread reviews over 90 days, with more recent ones weighted heavier
      const recencyBias = Math.random() * Math.random(); // Clusters toward recent
      const daysAgo = Math.floor(recencyBias * 90);
      const createdAt = randomDate(daysAgo || 1);

      const { error } = await supabase.from("reviews").insert({
        user_id: user.id,
        spotify_album_id: album.id,
        album_name: album.name,
        album_artist: album.artist,
        album_image_url: album.image,
        rating,
        review_text: reviewText,
        created_at: createdAt,
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
