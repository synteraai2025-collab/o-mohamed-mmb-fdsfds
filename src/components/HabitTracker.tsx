'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Check, X } from 'lucide-react';

interface Habit {
  id: string;
  name: string;
  description?: string;
  frequency: 'daily' | 'weekly';
  targetDays: number;
  completedDates: string[];
  createdAt: string;
  color: string;
}

interface HabitFormData {
  name: string;
  description: string;
  frequency: 'daily' | 'weekly';
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

  const colorOptions = [
    { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
    { value: 'green', label: 'Green', class: 'bg-green-500' },
    { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
    { value: 'orange', label: 'Orange', class: 'bg-orange-500' },
    { value: 'pink', label: 'Pink', class: 'bg-pink-500' }
  ];

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = () => {
    try {
      const stored = localStorage.getItem('habits');
      if (stored) {
        setHabits(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load habits:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveHabits = (newHabits: Habit[]) => {
    try {
      localStorage.setItem('habits', JSON.stringify(newHabits));
      setHabits(newHabits);
    } catch (error) {
      console.error('Failed to save habits:', error);
    }
  };

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

    saveHabits([...habits, newHabit]);
    setFormData({
      name: '',
      description: '',
      frequency: 'daily',
      targetDays: 1,
      color: 'blue'
    });
    setShowAddForm(false);
  };

  const deleteHabit = (id: string) => {
    saveHabits(habits.filter(habit => habit.id !== id));
  };

  const toggleHabitCompletion = (habitId: string, date: string) => {
    const updatedHabits = habits.map(habit => {
      if (habit.id === habitId) {
        const completedDates = habit.completedDates.includes(date)
          ? habit.completedDates.filter(d => d !== date)
          : [...habit.completedDates, date];
        
        return { ...habit, completedDates };
      }
      return habit;
    });
    
    saveHabits(updatedHabits);
  };

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getWeekDates = () => {
    const today = new Date();
    const week = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      week.push(date.toISOString().split('T')[0]);
    }
    return week;
  };

  const getCompletionRate = (habit: Habit) => {
    const totalDays = Math.max(1, habit.completedDates.length);
    const targetDays = habit.targetDays;
    return Math.min(100, Math.round((totalDays / targetDays) * 100));
  };

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string; text: string; border: string }> = {
      blue: { bg: 'bg-blue-500', text: 'text-blue-600', border: 'border-blue-200' },
      green: { bg: 'bg-green-500', text: 'text-green-600', border: 'border-green-200' },
      purple: { bg: 'bg-purple-500', text: 'text-purple-600', border: 'border-purple-200' },
      orange: { bg: 'bg-orange-500', text: 'text-orange-600', border: 'border-orange-200' },
      pink: { bg: 'bg-pink-500', text: 'text-pink-600', border: 'border-pink-200' }
    };
    return colorMap[color] || colorMap.blue;
  };

  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded"></div>
            </div>
          </CardContent>
        </Card>
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
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="habit-description">Description (optional)</Label>
              <Input
                id="habit-description"
                placeholder="Add a brief description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <select
                  id="frequency"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value as 'daily' | 'weekly' })}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
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
                  onChange={(e) => setFormData({ ...formData, targetDays: parseInt(e.target.value) || 1 })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: color.value })}
                    className={cn(
                      "w-8 h-8 rounded-full border-2 transition-all",
                      color.class,
                      formData.color === color.value ? "border-primary scale-110" : "border-transparent"
                    )}
                    title={color.label}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={addHabit} className="flex-1">
                Add Habit
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAddForm(false)}
                className="flex-1"
              >
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
              <p className="text-lg font-medium">No habits yet</p>
              <p className="text-sm">Start building better habits by adding your first one!</p>
            </div>
            <Button onClick={() => setShowAddForm(true)}>
              Add Your First Habit
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {habits.map((habit) => {
            const colorClasses = getColorClasses(habit.color);
            const today = getTodayDate();
            const isCompletedToday = habit.completedDates.includes(today);
            const completionRate = getCompletionRate(habit);
            const weekDates = getWeekDates();

            return (
              <Card key={habit.id} className={cn("border-2", colorClasses.border)}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className={cn("text-lg font-semibold", colorClasses.text)}>
                        {habit.name}
                      </h3>
                      {habit.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {habit.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-muted-foreground">
                          {habit.frequency} • Target: {habit.targetDays} days
                        </span>
                        <span className={cn("text-xs px-2 py-1 rounded-full", colorClasses.bg, "text-white")}>
                          {completionRate}% complete
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteHabit(habit.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Today's Progress</span>
                      <Button
                        size="sm"
                        onClick={() => toggleHabitCompletion(habit.id, today)}
                        variant={isCompletedToday ? "default" : "outline"}
                        className="gap-2"
                      >
                        {isCompletedToday ? (
                          <>
                            <Check className="h-4 w-4" />
                            Completed
                          </>
                        ) : (
                          <>
                            <X className="h-4 w-4" />
                            Mark Complete
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <span className="text-sm font-medium">This Week</span>
                      <div className="grid grid-cols-7 gap-1">
                        {weekDates.map((date) => {
                          const isCompleted = habit.completedDates.includes(date);
                          const dateObj = new Date(date);
                          const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                          const dayNumber = dateObj.getDate();

                          return (
                            <button
                              key={date}
                              onClick={() => toggleHabitCompletion(habit.id, date)}
                              className={cn(
                                "p-2 rounded-lg text-center text-xs transition-all",
                                "border hover:scale-105",
                                isCompleted
                                  ? [colorClasses.bg, "text-white", "border-transparent"]
                                  : ["bg-background", "text-muted-foreground", "border-border hover:border-primary"]
                              )}
                              title={`${dayName} ${dayNumber}`}
                            >
                              <div className="font-medium">{dayName}</div>
                              <div className="text-lg">{dayNumber}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{habit.completedDates.length} / {habit.targetDays} days</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={cn("h-2 rounded-full transition-all", colorClasses.bg)}
                          style={{ width: `${Math.min(100, completionRate)}%` }}
                        />
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
