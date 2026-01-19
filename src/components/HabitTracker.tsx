'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Check, X } from 'lucide-react';

export interface Habit {
  id: string;
  name: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  targetCount: number;
  currentCount: number;
  streak: number;
  lastCompleted?: string;
  createdAt: string;
  color: string;
}

export interface HabitTrackerProps {
  className?: string;
}

export interface HabitFormData {
  name: string;
  description: string;
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
    const loadHabits = () => {
      try {
        const stored = localStorage.getItem('habits');
        if (stored) {
          const parsedHabits = JSON.parse(stored);
          // Reset daily habits if it's a new day
          const updatedHabits = parsedHabits.map((habit: Habit) => {
            if (habit.frequency === 'daily' && habit.lastCompleted) {
              const lastCompletedDate = new Date(habit.lastCompleted);
              const today = new Date();
              const isSameDay = lastCompletedDate.toDateString() === today.toDateString();
              if (!isSameDay) {
                return { ...habit, currentCount: 0 };
              }
            }
            return habit;
          });
          setHabits(updatedHabits);
        }
      } catch (error) {
        console.error('Failed to load habits:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHabits();
  }, []);

  // Save habits to localStorage whenever habits change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem('habits', JSON.stringify(habits));
      } catch (error) {
        console.error('Failed to save habits:', error);
      }
    }
  }, [habits, isLoading]);

  const addHabit = () => {
    if (!formData.name.trim()) return;

    const newHabit: Habit = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      frequency: formData.frequency,
      targetCount: formData.targetCount,
      currentCount: 0,
      streak: 0,
      createdAt: new Date().toISOString(),
      color: formData.color,
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
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(habit => habit.id !== id));
  };

  const completeHabit = (id: string) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === id) {
        const newCount = Math.min(habit.currentCount + 1, habit.targetCount);
        const isCompleted = newCount >= habit.targetCount;
        const now = new Date().toISOString();
        
        let newStreak = habit.streak;
        if (isCompleted && habit.lastCompleted) {
          const lastDate = new Date(habit.lastCompleted);
          const today = new Date();
          const daysDiff = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysDiff === 1) {
            newStreak += 1;
          } else if (daysDiff > 1) {
            newStreak = 1;
          }
        } else if (isCompleted) {
          newStreak = 1;
        }

        return {
          ...habit,
          currentCount: newCount,
          streak: newStreak,
          lastCompleted: isCompleted ? now : habit.lastCompleted,
        };
      }
      return habit;
    }));
  };

  const uncompleteHabit = (id: string) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === id) {
        return {
          ...habit,
          currentCount: Math.max(habit.currentCount - 1, 0),
        };
      }
      return habit;
    }));
  };

  const getProgressPercentage = (habit: Habit) => {
    return Math.min((habit.currentCount / habit.targetCount) * 100, 100);
  };

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'Today';
      case 'weekly': return 'This week';
      case 'monthly': return 'This month';
      default: return 'Period';
    }
  };

  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-20 bg-muted rounded"></div>
              <div className="h-20 bg-muted rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">My Habits</h2>
        <Button onClick={() => setShowAddForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Habit
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Habit</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="habit-name">Habit Name</Label>
              <Input
                id="habit-name"
                placeholder="e.g., Drink 8 glasses of water"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="habit-description">Description (optional)</Label>
              <Input
                id="habit-description"
                placeholder="Add a description..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <select
                  id="frequency"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={formData.frequency}
                  onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value as 'daily' | 'weekly' | 'monthly' }))}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="target-count">Target Count</Label>
                <Input
                  id="target-count"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.targetCount}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetCount: parseInt(e.target.value) || 1 }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    className={cn(
                      "w-8 h-8 rounded-full border-2 transition-all",
                      color,
                      formData.color === color ? "border-primary scale-110" : "border-transparent hover:border-border"
                    )}
                    onClick={() => setFormData(prev => ({ ...prev, color }))}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={addHabit} className="flex-1">
                Add Habit
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {habits.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-muted-foreground mb-4">
              <Plus className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-lg">No habits yet</p>
              <p className="text-sm">Click "Add Habit" to get started on your journey!</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {habits.map((habit) => {
            const progress = getProgressPercentage(habit);
            const isCompleted = habit.currentCount >= habit.targetCount;
            
            return (
              <Card key={habit.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className={cn("w-3 h-3 rounded-full mt-2", habit.color)} />
                      <div>
                        <h3 className="font-semibold text-lg">{habit.name}</h3>
                        {habit.description && (
                          <p className="text-sm text-muted-foreground">{habit.description}</p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteHabit(habit.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {getFrequencyLabel(habit.frequency)}
                      </span>
                      <span className="font-medium">
                        {habit.currentCount} / {habit.targetCount}
                      </span>
                    </div>

                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={cn(
                          "h-2 rounded-full transition-all duration-300",
                          habit.color,
                          isCompleted ? "bg-accent" : ""
                        )}
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {habit.streak > 0 && (
                          <Badge variant="secondary" className="gap-1">
                            🔥 {habit.streak} day streak
                          </Badge>
                        )}
                        {isCompleted && (
                          <Badge variant="default" className="gap-1">
                            <Check className="h-3 w-3" />
                            Completed
                          </Badge>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {habit.currentCount > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => uncompleteHabit(habit.id)}
                            className="gap-1"
                          >
                            <X className="h-3 w-3" />
                            Undo
                          </Button>
                        )}
                        {!isCompleted && (
                          <Button
                            size="sm"
                            onClick={() => completeHabit(habit.id)}
                            className="gap-1"
                          >
                            <Check className="h-3 w-3" />
                            Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
