'use client';

import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Check, X } from 'lucide-react';

interface Habit {
  id: string;
  name: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'custom';
  targetDays: number;
  createdAt: string;
  completedDates: string[];
  color: string;
  isActive: boolean;
}

interface HabitFormData {
  name: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'custom';
  targetDays: number;
  color: string;
}

interface HabitTrackerProps {
  className?: string;
}

export function HabitTracker({ className }: HabitTrackerProps) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<HabitFormData>({
    name: '',
    description: '',
    frequency: 'daily',
    targetDays: 1,
    color: 'blue'
  });

  // Load habits from localStorage on mount
  useEffect(() => {
    const loadHabits = () => {
      try {
        const stored = localStorage.getItem('habits');
        if (stored) {
          const parsedHabits = JSON.parse(stored);
          setHabits(parsedHabits);
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
      targetDays: formData.targetDays,
      createdAt: new Date().toISOString(),
      completedDates: [],
      color: formData.color,
      isActive: true
    };

    setHabits(prev => [...prev, newHabit]);
    setFormData({
      name: '',
      description: '',
      frequency: 'daily',
      targetDays: 1,
      color: 'blue'
    });
    setShowAddForm(false);
  };

  const deleteHabit = (habitId: string) => {
    setHabits(prev => prev.filter(habit => habit.id !== habitId));
  };

  const toggleHabitCompletion = (habitId: string, date: string) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === habitId) {
        const isCompleted = habit.completedDates.includes(date);
        return {
          ...habit,
          completedDates: isCompleted
            ? habit.completedDates.filter(d => d !== date)
            : [...habit.completedDates, date]
        };
      }
      return habit;
    }));
  };

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getStreak = (habit: Habit): number => {
    if (habit.completedDates.length === 0) return 0;
    
    const sortedDates = [...habit.completedDates].sort().reverse();
    const today = new Date();
    let streak = 0;
    let currentDate = new Date(today);
    
    for (let i = 0; i < sortedDates.length; i++) {
      const dateStr = sortedDates[i];
      const checkDate = new Date(dateStr);
      const diffDays = Math.floor((currentDate.getTime() - checkDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === streak) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  const getCompletionRate = (habit: Habit): number => {
    const createdDate = new Date(habit.createdAt);
    const today = new Date();
    const daysSinceCreated = Math.floor((today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    return Math.round((habit.completedDates.length / daysSinceCreated) * 100);
  };

  const colorMap = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    pink: 'bg-pink-500'
  };

  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center p-8", className)}>
        <div className="animate-pulse text-muted-foreground">Loading habits...</div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Habit Tracker</h2>
        <Button onClick={() => setShowAddForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Habit
        </Button>
      </div>

      {showAddForm && (
        <Card className="border-primary/20">
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
                <Label htmlFor="habit-frequency">Frequency</Label>
                <select
                  id="habit-frequency"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={formData.frequency}
                  onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value as 'daily' | 'weekly' | 'custom' }))}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="habit-target">Target Days</Label>
                <Input
                  id="habit-target"
                  type="number"
                  min="1"
                  max="7"
                  value={formData.targetDays}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetDays: parseInt(e.target.value) || 1 }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex gap-2">
                {Object.keys(colorMap).map((color) => (
                  <button
                    key={color}
                    onClick={() => setFormData(prev => ({ ...prev, color }))}
                    className={cn(
                      "w-8 h-8 rounded-full border-2 transition-all",
                      colorMap[color as keyof typeof colorMap],
                      formData.color === color ? "border-primary scale-110" : "border-transparent hover:border-primary/50"
                    )}
                    aria-label={`Select ${color} color`}
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
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-muted-foreground mb-4">No habits yet</div>
            <p className="text-sm text-muted-foreground mb-4">
              Start building better habits by adding your first one!
            </p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Habit
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {habits.map((habit) => {
            const today = getTodayDate();
            const isCompletedToday = habit.completedDates.includes(today);
            const streak = getStreak(habit);
            const completionRate = getCompletionRate(habit);

            return (
              <Card key={habit.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-3 h-3 rounded-full", colorMap[habit.color as keyof typeof colorMap])} />
                      <CardTitle className="text-lg">{habit.name}</CardTitle>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteHabit(habit.id)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {habit.description && (
                    <p className="text-sm text-muted-foreground mt-1">{habit.description}</p>
                  )}
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Button
                      onClick={() => toggleHabitCompletion(habit.id, today)}
                      variant={isCompletedToday ? "default" : "outline"}
                      className="gap-2"
                    >
                      {isCompletedToday ? (
                        <><Check className="h-4 w-4" /> Completed</>
                      ) : (
                        <><X className="h-4 w-4" /> Mark Complete</>
                      )}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Current Streak</span>
                      <span className="font-semibold">{streak} days</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Completion Rate</span>
                      <span className="font-semibold">{completionRate}%</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Completed</span>
                      <span className="font-semibold">{habit.completedDates.length} times</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Progress</span>
                      <span>{habit.completedDates.length} / {Math.max(1, Math.floor((new Date().getTime() - new Date(habit.createdAt).getTime()) / (1000 * 60 * 60 * 24)) + 1)}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={cn("h-2 rounded-full transition-all", colorMap[habit.color as keyof typeof colorMap])}
                        style={{ width: `${Math.min(100, completionRate)}%` }}
                      />
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

