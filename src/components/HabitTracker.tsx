'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Habit {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  completedDates: string[];
}

interface HabitTrackerProps {
  className?: string;
}

export function HabitTracker({ className }: HabitTrackerProps) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitDescription, setNewHabitDescription] = useState('');

  const addHabit = () => {
    if (!newHabitName.trim()) return;

    const newHabit: Habit = {
      id: Date.now().toString(),
      name: newHabitName.trim(),
      description: newHabitDescription.trim() || undefined,
      createdAt: new Date(),
      completedDates: [],
    };

    setHabits([...habits, newHabit]);
    setNewHabitName('');
    setNewHabitDescription('');
  };

  const toggleHabitCompletion = (habitId: string, date: string) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const isCompleted = habit.completedDates.includes(date);
        return {
          ...habit,
          completedDates: isCompleted
            ? habit.completedDates.filter(d => d !== date)
            : [...habit.completedDates, date],
        };
      }
      return habit;
    }));
  };

  const deleteHabit = (habitId: string) => {
    setHabits(habits.filter(habit => habit.id !== habitId));
  };

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getWeekDates = () => {
    const today = new Date();
    const weekDates = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      weekDates.push(date.toISOString().split('T')[0]);
    }
    
    return weekDates;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const weekDates = getWeekDates();
  const todayDate = getTodayDate();

  return (
    <Card className={cn('w-full max-w-4xl', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Habit Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Habit Form */}
        <div className="space-y-4 rounded-lg border p-4">
          <h3 className="text-lg font-semibold">Add New Habit</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="habit-name">Habit Name</Label>
              <Input
                id="habit-name"
                placeholder="e.g., Drink 8 glasses of water"
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addHabit()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="habit-description">Description (Optional)</Label>
              <Input
                id="habit-description"
                placeholder="e.g., Stay hydrated throughout the day"
                value={newHabitDescription}
                onChange={(e) => setNewHabitDescription(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addHabit()}
              />
            </div>
          </div>
          <Button onClick={addHabit} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Habit
          </Button>
        </div>

        {/* Habits List */}
        {habits.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground">No habits yet</h3>
            <p className="text-muted-foreground">Add your first habit to start tracking your progress!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {habits.map((habit) => (
              <Card key={habit.id} className="border-2">
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {/* Habit Header */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-semibold text-lg">{habit.name}</h4>
                        {habit.description && (
                          <p className="text-sm text-muted-foreground">{habit.description}</p>
                        )}
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

                    {/* Weekly Progress */}
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-muted-foreground">This Week's Progress</h5>
                      <div className="grid grid-cols-7 gap-2">
                        {weekDates.map((date) => {
                          const isCompleted = habit.completedDates.includes(date);
                          const isToday = date === todayDate;
                          
                          return (
                            <div key={date} className="text-center space-y-1">
                              <div className="text-xs text-muted-foreground">
                                {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                              </div>
                              <Checkbox
                                checked={isCompleted}
                                onCheckedChange={() => toggleHabitCompletion(habit.id, date)}
                                className={cn(
                                  'h-8 w-8 rounded-full border-2 transition-colors',
                                  isToday && 'ring-2 ring-primary ring-offset-2',
                                  isCompleted
                                    ? 'bg-accent border-accent data-[state=checked]:bg-accent'
                                    : 'bg-background hover:bg-accent/10'
                                )}
                              />
                              <div className="text-xs text-muted-foreground">
                                {new Date(date).getDate()}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Weekly: {habit.completedDates.filter(date => weekDates.includes(date)).length}/7</span>
                      <span>Total: {habit.completedDates.length} days</span>
                      <span>Streak: {calculateStreak(habit.completedDates)} days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function calculateStreak(completedDates: string[]): number {
  if (completedDates.length === 0) return 0;
  
  const sortedDates = completedDates
    .map(date => new Date(date))
    .sort((a, b) => b.getTime() - a.getTime());
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let streak = 0;
  let currentDate = new Date(today);
  
  for (const date of sortedDates) {
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    
    if (checkDate.getTime() === currentDate.getTime()) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (checkDate.getTime() < currentDate.getTime()) {
      break;
    }
  }
  
  return streak;
}
