'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Check, X, Trash2 } from 'lucide-react';

interface Habit {
  id: string;
  name: string;
  description?: string;
  completedDates: string[];
  createdAt: string;
  color: string;
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
      completedDates: [],
      createdAt: new Date().toISOString(),
      color: 'bg-blue-500',
    },
    {
      id: '2',
      name: 'Exercise',
      description: '30 minutes of physical activity',
      completedDates: [],
      createdAt: new Date().toISOString(),
      color: 'bg-green-500',
    },
  ]);
  
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitDescription, setNewHabitDescription] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-indigo-500',
    'bg-teal-500',
  ];

  const addHabit = () => {
    if (!newHabitName.trim()) return;
    
    const newHabit: Habit = {
      id: Date.now().toString(),
      name: newHabitName.trim(),
      description: newHabitDescription.trim() || undefined,
      completedDates: [],
      createdAt: new Date().toISOString(),
      color: colors[habits.length % colors.length],
    };
    
    setHabits([...habits, newHabit]);
    setNewHabitName('');
    setNewHabitDescription('');
    setShowAddForm(false);
  };

  const deleteHabit = (habitId: string) => {
    setHabits(habits.filter(habit => habit.id !== habitId));
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

  const isHabitCompletedToday = (habit: Habit) => {
    const today = new Date().toISOString().split('T')[0];
    return habit.completedDates.includes(today);
  };

  const getStreak = (habit: Habit) => {
    if (habit.completedDates.length === 0) return 0;
    
    const sortedDates = [...habit.completedDates].sort().reverse();
    const today = new Date();
    let streak = 0;
    
    for (let i = 0; i < sortedDates.length; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const checkDateStr = checkDate.toISOString().split('T')[0];
      
      if (sortedDates.includes(checkDateStr)) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const getCompletionRate = (habit: Habit) => {
    const createdDate = new Date(habit.createdAt);
    const today = new Date();
    const daysSinceCreation = Math.ceil((today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const completedDays = habit.completedDates.length;
    
    return Math.round((completedDays / daysSinceCreation) * 100);
  };

  return (
    <Card className={cn('w-full max-w-4xl mx-auto', className)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold">Habit Tracker</CardTitle>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Habit
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {showAddForm && (
          <Card className="border-dashed">
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="habit-name">Habit Name</Label>
                <Input
                  id="habit-name"
                  placeholder="Enter habit name..."
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addHabit()}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="habit-description">Description (Optional)</Label>
                <Input
                  id="habit-description"
                  placeholder="Enter description..."
                  value={newHabitDescription}
                  onChange={(e) => setNewHabitDescription(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addHabit()}
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={addHabit} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Habit
                </Button>
                <Button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewHabitName('');
                    setNewHabitDescription('');
                  }}
                  variant="outline"
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {habits.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">No habits yet</div>
            <Button onClick={() => setShowAddForm(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Your First Habit
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {habits.map((habit) => {
              const isCompletedToday = isHabitCompletedToday(habit);
              const streak = getStreak(habit);
              const completionRate = getCompletionRate(habit);
              
              return (
                <Card key={habit.id} className="relative">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          'w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg',
                          habit.color,
                          isCompletedToday && 'ring-2 ring-offset-2 ring-accent'
                        )}>
                          {habit.name.charAt(0).toUpperCase()}
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{habit.name}</h3>
                          {habit.description && (
                            <p className="text-sm text-muted-foreground">{habit.description}</p>
                          )}
                          
                          <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                            <span>🔥 {streak} day streak</span>
                            <span>📊 {completionRate}% completion</span>
                            <span>✅ {habit.completedDates.length} days</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => toggleHabitCompletion(habit.id, new Date().toISOString().split('T')[0])}
                          variant={isCompletedToday ? 'default' : 'outline'}
                          size="sm"
                          className="gap-2"
                        >
                          <Check className="h-4 w-4" />
                          {isCompletedToday ? 'Completed' : 'Mark Complete'}
                        </Button>
                        
                        <Button
                          onClick={() => deleteHabit(habit.id)}
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
        
        {habits.length > 0 && (
          <div className="text-center text-sm text-muted-foreground">
            Total habits: {habits.length} | 
            Completed today: {habits.filter(isHabitCompletedToday).length} | 
            Overall completion: {Math.round(habits.reduce((acc, habit) => acc + getCompletionRate(habit), 0) / habits.length)}%
          </div>
        )}
      </CardContent>
    </Card>
  );
}
