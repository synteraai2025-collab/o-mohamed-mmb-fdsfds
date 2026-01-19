'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface Habit {
  id: string;
  name: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  targetCount: number;
  currentCount: number;
  streak: number;
  lastCompleted?: Date;
  createdAt: Date;
  color: string;
}

interface HabitTrackerProps {
  className?: string;
}

interface HabitFormData {
  name: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  targetCount: number;
  color: string;
}

const COLORS = [
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-yellow-500',
  'bg-red-500',
  'bg-indigo-500',
  'bg-teal-500',
];

export function HabitTracker({ className }: HabitTrackerProps) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<HabitFormData>({
    name: '',
    description: '',
    frequency: 'daily',
    targetCount: 1,
    color: COLORS[0],
  });

  // Load habits from localStorage on mount
  useEffect(() => {
    try {
      const savedHabits = localStorage.getItem('habits');
      if (savedHabits) {
        const parsedHabits = JSON.parse(savedHabits).map((habit: any) => ({
          ...habit,
          lastCompleted: habit.lastCompleted ? new Date(habit.lastCompleted) : undefined,
          createdAt: new Date(habit.createdAt),
        }));
        setHabits(parsedHabits);
      }
    } catch (error) {
      console.error('Error loading habits:', error);
      setError('Failed to load habits');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save habits to localStorage whenever habits change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem('habits', JSON.stringify(habits));
      } catch (error) {
        console.error('Error saving habits:', error);
        setError('Failed to save habits');
      }
    }
  }, [habits, isLoading]);

  const addHabit = (data: HabitFormData) => {
    try {
      const newHabit: Habit = {
        id: Date.now().toString(),
        name: data.name.trim(),
        description: data.description?.trim(),
        frequency: data.frequency,
        targetCount: data.targetCount,
        currentCount: 0,
        streak: 0,
        createdAt: new Date(),
        color: data.color,
      };

      setHabits(prev => [...prev, newHabit]);
      setFormData({
        name: '',
        description: '',
        frequency: 'daily',
        targetCount: 1,
        color: COLORS[0],
      });
      setShowAddForm(false);
      setError(null);
    } catch (error) {
      console.error('Error adding habit:', error);
      setError('Failed to add habit');
    }
  };

  const completeHabit = (habitId: string) => {
    try {
      setHabits(prev => prev.map(habit => {
        if (habit.id === habitId) {
          const newCount = habit.currentCount + 1;
          const isCompleted = newCount >= habit.targetCount;
          
          let newStreak = habit.streak;
          if (isCompleted) {
            const today = new Date().toDateString();
            const lastCompleted = habit.lastCompleted?.toDateString();
            
            if (lastCompleted !== today) {
              newStreak = habit.streak + 1;
            }
          }

          return {
            ...habit,
            currentCount: newCount,
            streak: newStreak,
            lastCompleted: isCompleted ? new Date() : habit.lastCompleted,
          };
        }
        return habit;
      }));
      setError(null);
    } catch (error) {
      console.error('Error completing habit:', error);
      setError('Failed to complete habit');
    }
  };

  const deleteHabit = (habitId: string) => {
    try {
      setHabits(prev => prev.filter(habit => habit.id !== habitId));
      setError(null);
    } catch (error) {
      console.error('Error deleting habit:', error);
      setError('Failed to delete habit');
    }
  };

  const resetDailyProgress = () => {
    const today = new Date().toDateString();
    setHabits(prev => prev.map(habit => {
      if (habit.frequency === 'daily') {
        const lastCompleted = habit.lastCompleted?.toDateString();
        if (lastCompleted !== today) {
          return { ...habit, currentCount: 0 };
        }
      }
      return habit;
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Habit name is required');
      return;
    }
    addHabit(formData);
  };

  if (isLoading) {
    return (
      <div className={cn('flex items-center justify-center p-8', className)}>
        <div className="text-muted-foreground">Loading habits...</div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {error && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">My Habits</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          {showAddForm ? 'Cancel' : 'Add Habit'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-card p-6 rounded-lg border space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="habit-name" className="text-sm font-medium text-foreground">
                Habit Name *
              </label>
              <input
                id="habit-name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="e.g., Drink 8 glasses of water"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="habit-description" className="text-sm font-medium text-foreground">
                Description
              </label>
              <input
                id="habit-description"
                type="text"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Optional description"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="habit-frequency" className="text-sm font-medium text-foreground">
                Frequency
              </label>
              <select
                id="habit-frequency"
                value={formData.frequency}
                onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value as 'daily' | 'weekly' | 'monthly' }))}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="habit-target" className="text-sm font-medium text-foreground">
                Target Count
              </label>
              <input
                id="habit-target"
                type="number"
                min="1"
                max="100"
                value={formData.targetCount}
                onChange={(e) => setFormData(prev => ({ ...prev, targetCount: parseInt(e.target.value) || 1 }))}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium text-foreground">Color</label>
              <div className="flex gap-2 flex-wrap">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, color }))}
                    className={cn(
                      'w-8 h-8 rounded-full border-2 transition-all',
                      color,
                      formData.color === color ? 'ring-2 ring-ring scale-110' : 'hover:scale-105'
                    )}
                    aria-label={`Select ${color} color`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              Add Habit
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="bg-muted text-muted-foreground px-4 py-2 rounded-md hover:bg-muted/80 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {habits.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">No habits yet</div>
          <div className="text-sm text-muted-foreground">
            Click "Add Habit" to start tracking your first habit!
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {habits.map((habit) => {
            const progress = (habit.currentCount / habit.targetCount) * 100;
            const isCompleted = habit.currentCount >= habit.targetCount;

            return (
              <div key={habit.id} className="bg-card p-6 rounded-lg border shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn('w-4 h-4 rounded-full', habit.color)} />
                    <div>
                      <h3 className="font-semibold text-foreground">{habit.name}</h3>
                      {habit.description && (
                        <p className="text-sm text-muted-foreground">{habit.description}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteHabit(habit.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                    aria-label="Delete habit"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">
                      {habit.currentCount}/{habit.targetCount}
                    </span>
                  </div>

                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={cn(
                        'h-2 rounded-full transition-all duration-300',
                        habit.color,
                        isCompleted ? 'bg-accent' : ''
                      )}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      🔥 {habit.streak} day streak
                    </div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {habit.frequency}
                    </div>
                  </div>

                  {!isCompleted && (
                    <button
                      onClick={() => completeHabit(habit.id)}
                      className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
                    >
                      Complete
                    </button>
                  )}

                  {isCompleted && (
                    <div className="w-full bg-accent text-accent-foreground py-2 rounded-md text-sm font-medium text-center">
                      ✓ Completed Today!
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
