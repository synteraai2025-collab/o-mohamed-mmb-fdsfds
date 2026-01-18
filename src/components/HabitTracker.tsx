'use client';

import { useState } from 'react';
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
  frequency: 'daily' | 'weekly' | 'monthly';
  targetDays: number;
  completedDays: number;
  createdAt: Date;
  lastCompleted?: Date;
}

interface HabitFormData {
  name: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  targetDays: number;
}

export function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<HabitFormData>({
    name: '',
    description: '',
    frequency: 'daily',
    targetDays: 1,
  });

  const addHabit = () => {
    if (!formData.name.trim()) return;

    const newHabit: Habit = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      description: formData.description?.trim() || undefined,
      frequency: formData.frequency,
      targetDays: formData.targetDays,
      completedDays: 0,
      createdAt: new Date(),
    };

    setHabits([...habits, newHabit]);
    setFormData({ name: '', description: '', frequency: 'daily', targetDays: 1 });
    setShowAddForm(false);
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(habit => habit.id !== id));
  };

  const toggleHabitCompletion = (id: string) => {
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        const isCompleted = habit.lastCompleted && 
          new Date(habit.lastCompleted).toDateString() === new Date().toDateString();
        
        if (isCompleted) {
          return {
            ...habit,
            completedDays: Math.max(0, habit.completedDays - 1),
            lastCompleted: undefined,
          };
        } else {
          return {
            ...habit,
            completedDays: habit.completedDays + 1,
            lastCompleted: new Date(),
          };
        }
      }
      return habit;
    }));
  };

  const getProgressPercentage = (habit: Habit) => {
    return Math.min((habit.completedDays / habit.targetDays) * 100, 100);
  };

  const isHabitCompletedToday = (habit: Habit) => {
    return habit.lastCompleted && 
      new Date(habit.lastCompleted).toDateString() === new Date().toDateString();
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Habit Tracker</h1>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Habit
        </Button>
      </div>

      {showAddForm && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Add New Habit</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="habit-name" className="text-muted-foreground">Habit Name</Label>
              <Input
                id="habit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Drink 8 glasses of water"
                className="bg-background border-input text-foreground"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="habit-description" className="text-muted-foreground">Description (optional)</Label>
              <Input
                id="habit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="e.g., Stay hydrated throughout the day"
                className="bg-background border-input text-foreground"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="frequency" className="text-muted-foreground">Frequency</Label>
                <select
                  id="frequency"
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value as 'daily' | 'weekly' | 'monthly' })}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="target-days" className="text-muted-foreground">Target Days</Label>
                <Input
                  id="target-days"
                  type="number"
                  min="1"
                  max="30"
                  value={formData.targetDays}
                  onChange={(e) => setFormData({ ...formData, targetDays: parseInt(e.target.value) || 1 })}
                  className="bg-background border-input text-foreground"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={addHabit}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <Check className="w-4 h-4 mr-2" />
                Add Habit
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAddForm(false)}
                className="border-border text-muted-foreground hover:bg-muted"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {habits.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-lg font-semibold text-card-foreground mb-2">No habits yet</h3>
              <p className="text-muted-foreground mb-4">Start building better habits by adding your first one!</p>
              <Button
                onClick={() => setShowAddForm(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Habit
              </Button>
            </CardContent>
          </Card>
        ) : (
          habits.map((habit) => (
            <Card key={habit.id} className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-card-foreground mb-1">{habit.name}</h3>
                    {habit.description && (
                      <p className="text-sm text-muted-foreground mb-2">{habit.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="capitalize">{habit.frequency}</span>
                      <span>•</span>
                      <span>{habit.completedDays}/{habit.targetDays} days</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => toggleHabitCompletion(habit.id)}
                      variant={isHabitCompletedToday(habit) ? "default" : "outline"}
                      size="sm"
                      className={cn(
                        isHabitCompletedToday(habit) 
                          ? "bg-accent text-accent-foreground hover:bg-accent/90" 
                          : "border-border text-muted-foreground hover:bg-muted"
                      )}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => deleteHabit(habit.id)}
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium text-card-foreground">
                      {Math.round(getProgressPercentage(habit))}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={cn(
                        "h-2 rounded-full transition-all duration-300",
                        getProgressPercentage(habit) >= 100 
                          ? "bg-accent" 
                          : "bg-primary"
                      )}
                      style={{ width: `${getProgressPercentage(habit)}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
