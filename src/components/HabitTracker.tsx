'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Calendar } from 'lucide-react';

export interface Habit {
  id: string;
  name: string;
  completed: boolean;
  date: Date;
  streak?: number;
}

export interface HabitTrackerProps {
  habits?: Habit[];
  onHabitToggle?: (habitId: string) => void;
  onHabitAdd?: (habitName: string) => void;
  onHabitDelete?: (habitId: string) => void;
}

export function HabitTracker({ 
  habits: initialHabits = [], 
  onHabitToggle,
  onHabitAdd,
  onHabitDelete 
}: HabitTrackerProps) {
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [newHabitName, setNewHabitName] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const handleToggleHabit = (habitId: string) => {
    const updatedHabits = habits.map(habit => 
      habit.id === habitId 
        ? { ...habit, completed: !habit.completed }
        : habit
    );
    setHabits(updatedHabits);
    onHabitToggle?.(habitId);
  };

  const handleAddHabit = () => {
    if (newHabitName.trim()) {
      const newHabit: Habit = {
        id: Date.now().toString(),
        name: newHabitName.trim(),
        completed: false,
        date: new Date(),
        streak: 0
      };
      const updatedHabits = [...habits, newHabit];
      setHabits(updatedHabits);
      setNewHabitName('');
      onHabitAdd?.(newHabitName.trim());
    }
  };

  const handleDeleteHabit = (habitId: string) => {
    const updatedHabits = habits.filter(habit => habit.id !== habitId);
    setHabits(updatedHabits);
    onHabitDelete?.(habitId);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddHabit();
    }
  };

  const completedCount = habits.filter(habit => habit.completed).length;
  const totalCount = habits.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Habit Tracker</h1>
        <p className="text-muted-foreground">Build better habits, one day at a time</p>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
      </div>

      {/* Progress Card */}
      {totalCount > 0 && (
        <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Today's Progress</p>
                <p className="text-2xl font-bold text-foreground">
                  {completedCount} / {totalCount} habits
                </p>
              </div>
              <div className="text-right">
                <Badge 
                  variant="secondary" 
                  className={cn(
                    "text-lg font-semibold",
                    completionRate === 100 && "bg-accent text-accent-foreground"
                  )}
                >
                  {completionRate}%
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">Complete</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    completionRate === 100 ? "bg-accent" : "bg-primary"
                  )}
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add New Habit */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add a new habit..."
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
            <Button 
              onClick={handleAddHabit}
              disabled={!newHabitName.trim()}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Habits List */}
      <div className="space-y-3">
        {habits.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-12 text-center">
              <div className="space-y-2">
                <p className="text-lg font-medium text-muted-foreground">No habits yet</p>
                <p className="text-sm text-muted-foreground">
                  Add your first habit above to get started!
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          habits.map((habit) => (
            <Card 
              key={habit.id} 
              className={cn(
                "transition-all duration-200 hover:shadow-md",
                habit.completed && "border-accent/50 bg-accent/5"
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={habit.completed}
                    onCheckedChange={() => handleToggleHabit(habit.id)}
                    className="h-5 w-5"
                  />
                  <div className="flex-1 space-y-1">
                    <p className={cn(
                      "font-medium transition-all",
                      habit.completed 
                        ? "line-through text-muted-foreground" 
                        : "text-foreground"
                    )}>
                      {habit.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{habit.date.toLocaleDateString()}</span>
                      {habit.streak && habit.streak > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-accent font-medium">
                            🔥 {habit.streak} day streak
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteHabit(habit.id)}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Motivational Message */}
      {totalCount > 0 && completionRate === 100 && (
        <Card className="bg-gradient-to-r from-accent/10 to-primary/10 border-accent/50">
          <CardContent className="p-6 text-center">
            <p className="text-lg font-semibold text-accent">🎉 Amazing! All habits completed!</p>
            <p className="text-sm text-muted-foreground mt-1">
              Keep up the great work! You're building amazing habits.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
