import { HabitTracker } from "@/components/HabitTracker";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <HabitTracker />
      </div>
    </main>
  );
}

