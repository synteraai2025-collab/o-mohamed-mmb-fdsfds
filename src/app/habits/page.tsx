import { HabitTracker } from '@/components/HabitTracker';

export default function HabitsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">
          Build Better Habits
        </h1>
        <p className="text-lg text-muted-foreground">
          Track your daily habits and build consistency one day at a time
        </p>
      </div>
      
      <HabitTracker className="w-full" />
    </div>
  );
}
