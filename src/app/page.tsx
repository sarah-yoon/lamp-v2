import FeaturedTrack from "@/components/FeaturedTrack";

export default function Home() {
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-4 text-center relative overflow-hidden">
      <FeaturedTrack />
      <p className="absolute bottom-8 text-text-tertiary text-xs tracking-widest lowercase font-mono font-light">
        what is music to you?
      </p>
    </div>
  );
}
