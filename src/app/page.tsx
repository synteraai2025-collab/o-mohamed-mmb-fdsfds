import { HabitTracker } from '@/components/HabitTracker';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Habit Tracker
          </h1>
          <p className="text-lg text-muted-foreground">
            Build better habits, one day at a time
          </p>
        </div>
        <HabitTracker />
      </div>
    </div>
  );
}
