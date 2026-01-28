'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Check, X } from 'lucide-react';

interface Habit {
  id: string;
  name: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'custom';
  targetDays: number;
  completedDates: string[];
  createdAt: string;
  color: string;
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
      completedDates: [],
      createdAt: new Date().toISOString(),
      color: formData.color
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
    
    for (let i = 0; i < sortedDates.length; i++) {
      const date = new Date(sortedDates[i]);
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      
      if (date.toDateString() === expectedDate.toDateString()) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const getCompletionRate = (habit: Habit): number => {
    const daysSinceCreated = Math.ceil(
      (new Date().getTime() - new Date(habit.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSinceCreated === 0) return 0;
    
    return Math.round((habit.completedDates.length / daysSinceCreated) * 100);
  };

  const colorMap = {
    blue: 'bg-blue-500 hover:bg-blue-600',
    green: 'bg-green-500 hover:bg-green-600',
    purple: 'bg-purple-500 hover:bg-purple-600',
    orange: 'bg-orange-500 hover:bg-orange-600',
    pink: 'bg-pink-500 hover:bg-pink-600'
  };

  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        <Card>
          <CardHeader>
            <CardTitle>Loading Habits...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Habit Tracker</h2>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Habit
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Habit</CardTitle>
            <CardDescription>Create a new habit to track your progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
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
                  placeholder="Add a brief description"
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
                    onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value as 'daily' | 'weekly' | 'custom' }))}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target-days">Target Days</Label>
                  <Input
                    id="target-days"
                    type="number"
                    min="1"
                    max="7"
                    value={formData.targetDays}
                    onChange={(e) => setFormData(prev => ({ ...prev, targetDays: parseInt(e.target.value) || 1 }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <select
                  id="color"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                >
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                  <option value="purple">Purple</option>
                  <option value="orange">Orange</option>
                  <option value="pink">Pink</option>
                </select>
              </div>

              <div className="flex gap-2">
                <Button onClick={addHabit} className="flex-1">
                  Add Habit
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {habits.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">No habits yet</h3>
                <p className="text-sm text-muted-foreground">
                  Start building better habits by adding your first one!
                </p>
              </div>
              <Button onClick={() => setShowAddForm(true)}>
                Add Your First Habit
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {habits.map((habit) => {
            const today = getTodayDate();
            const isCompletedToday = habit.completedDates.includes(today);
            const streak = getStreak(habit);
            const completionRate = getCompletionRate(habit);
            const colorClass = colorMap[habit.color as keyof typeof colorMap] || colorMap.blue;

            return (
              <Card key={habit.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{habit.name}</CardTitle>
                      {habit.description && (
                        <CardDescription>{habit.description}</CardDescription>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => deleteHabit(habit.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Button
                      className={cn(
                        "flex-1 mr-2",
                        isCompletedToday ? "bg-green-500 hover:bg-green-600" : colorClass
                      )}
                      onClick={() => toggleHabitCompletion(habit.id, today)}
                    >
                      {isCompletedToday ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Completed
                        </>
                      ) : (
                        'Mark Complete'
                      )}
                    </Button>
                  </div>

                  <div className="space-y-3">
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

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Frequency</span>
                      <span className="font-semibold capitalize">{habit.frequency}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Created</span>
                      <span>{new Date(habit.createdAt).toLocaleDateString()}</span>
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
