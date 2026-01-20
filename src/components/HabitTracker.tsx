'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Check, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Habit {
  id: string;
  name: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  targetDays: number;
  completedDays: string[]; // ISO date strings
  createdAt: string;
  color?: string;
}

interface HabitTrackerProps {
  className?: string;
}

export function HabitTracker({ className }: HabitTrackerProps) {
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: '1',
      name: 'Drink Water',
      description: 'Drink 8 glasses of water daily',
      frequency: 'daily',
      targetDays: 30,
      completedDays: [],
      createdAt: new Date().toISOString(),
      color: 'bg-blue-500',
    },
    {
      id: '2',
      name: 'Exercise',
      description: '30 minutes of physical activity',
      frequency: 'daily',
      targetDays: 21,
      completedDays: [],
      createdAt: new Date().toISOString(),
      color: 'bg-green-500',
    },
  ]);

  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitDescription, setNewHabitDescription] = useState('');
  const [newHabitFrequency, setNewHabitFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [newHabitTarget, setNewHabitTarget] = useState(30);
  const [showAddForm, setShowAddForm] = useState(false);

  const addHabit = () => {
    if (!newHabitName.trim()) return;

    const newHabit: Habit = {
      id: Date.now().toString(),
      name: newHabitName.trim(),
      description: newHabitDescription.trim() || undefined,
      frequency: newHabitFrequency,
      targetDays: newHabitTarget,
      completedDays: [],
      createdAt: new Date().toISOString(),
      color: `bg-${['blue', 'green', 'purple', 'pink', 'yellow', 'red'][Math.floor(Math.random() * 6)]}-500`,
    };

    setHabits([...habits, newHabit]);
    setNewHabitName('');
    setNewHabitDescription('');
    setNewHabitFrequency('daily');
    setNewHabitTarget(30);
    setShowAddForm(false);
  };

  const deleteHabit = (habitId: string) => {
    setHabits(habits.filter(habit => habit.id !== habitId));
  };

  const toggleHabitCompletion = (habitId: string, date: string) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const completedDays = habit.completedDays.includes(date)
          ? habit.completedDays.filter(d => d !== date)
          : [...habit.completedDays, date];
        
        return {
          ...habit,
          completedDays,
        };
      }
      return habit;
    }));
  };

  const isHabitCompletedToday = (habit: Habit): boolean => {
    const today = new Date().toISOString().split('T')[0];
    return habit.completedDays.includes(today);
  };

  const getCompletionPercentage = (habit: Habit): number => {
    return Math.min((habit.completedDays.length / habit.targetDays) * 100, 100);
  };

  const getStreak = (habit: Habit): number => {
    if (habit.completedDays.length === 0) return 0;
    
    const sortedDates = [...habit.completedDays].sort().reverse();
    const today = new Date();
    let streak = 0;
    
    for (let i = 0; i < sortedDates.length; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const checkDateStr = checkDate.toISOString().split('T')[0];
      
      if (sortedDates.includes(checkDateStr)) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    
    return streak;
  };

  return (
    <div className={cn('w-full max-w-4xl mx-auto p-4', className)}>
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">Habit Tracker</CardTitle>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            size="sm"
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Habit
          </Button>
        </CardHeader>
        <CardContent>
          {showAddForm && (
            <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Habit Name</label>
                  <Input
                    value={newHabitName}
                    onChange={(e) => setNewHabitName(e.target.value)}
                    placeholder="Enter habit name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Input
                    value={newHabitDescription}
                    onChange={(e) => setNewHabitDescription(e.target.value)}
                    placeholder="Optional description"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Frequency</label>
                  <select
                    value={newHabitFrequency}
                    onChange={(e) => setNewHabitFrequency(e.target.value as 'daily' | 'weekly' | 'monthly')}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Target Days</label>
                  <Input
                    type="number"
                    value={newHabitTarget}
                    onChange={(e) => setNewHabitTarget(parseInt(e.target.value) || 30)}
                    min="1"
                    max="365"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={addHabit} size="sm">
                  Add Habit
                </Button>
                <Button
                  onClick={() => setShowAddForm(false)}
                  size="sm"
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {habits.map((habit) => {
          const completionPercentage = getCompletionPercentage(habit);
          const streak = getStreak(habit);
          const isCompletedToday = isHabitCompletedToday(habit);
          const today = new Date().toISOString().split('T')[0];

          return (
            <Card key={habit.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn('w-3 h-3 rounded-full', habit.color)} />
                    <CardTitle className="text-lg font-semibold">{habit.name}</CardTitle>
                  </div>
                  <Button
                    onClick={() => deleteHabit(habit.id)}
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
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
                  <div className="text-sm text-muted-foreground">
                    {habit.completedDays.length} / {habit.targetDays} days
                  </div>
                  <div className="text-sm font-medium text-primary">
                    {completionPercentage.toFixed(0)}%
                  </div>
                </div>

                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className={cn(
                      'h-2 rounded-full transition-all duration-300',
                      habit.color || 'bg-primary'
                    )}
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Streak: </span>
                    <span className="font-medium text-primary">{streak} days</span>
                  </div>
                  <Button
                    onClick={() => toggleHabitCompletion(habit.id, today)}
                    size="sm"
                    variant={isCompletedToday ? 'default' : 'outline'}
                    className={cn(
                      'gap-2',
                      isCompletedToday && 'bg-accent hover:bg-accent/90'
                    )}
                  >
                    <Check className="h-4 w-4" />
                    {isCompletedToday ? 'Completed' : 'Mark Complete'}
                  </Button>
                </div>

                <div className="pt-2 border-t">
                  <div className="text-xs text-muted-foreground">
                    Frequency: {habit.frequency}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {habits.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-muted-foreground mb-4">
              No habits tracked yet. Start building better habits today!
            </div>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Habit
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
