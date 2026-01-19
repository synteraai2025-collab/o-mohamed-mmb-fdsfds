import { HabitTracker } from '@/components/HabitTracker';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Habit Tracker
          </h1>
          <p className="text-lg text-muted-foreground">
            Build better habits, one day at a time
          </p>
        </header>
        
        <main className="space-y-8">
          <HabitTracker />
        </main>
        
        <footer className="text-center mt-16 text-sm text-muted-foreground">
          <p>Track your daily habits and build lasting routines</p>
        </footer>
      </div>
    </div>
  );
}
