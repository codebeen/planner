import React from 'react';
import { ScrollView, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function TasksScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const tasks = [
    { id: '1', title: 'Finish mobile UI', completed: true, category: 'Work' },
    { id: '2', title: 'Buy groceries', completed: false, category: 'Personal' },
    { id: '3', title: 'Meeting with team', completed: false, category: 'Work' },
    { id: '4', title: 'Workout', completed: false, category: 'Health' },
  ];

  return (
    <ThemedView className="flex-1 pt-16">
      <View className="flex-row justify-between items-center px-5 mb-5">
        <ThemedText type="title">My Tasks</ThemedText>
        <IconSymbol name="list.bullet" color={theme.tint} size={32} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        {tasks.map((task) => (
          <ThemedView key={task.id} className="rounded-2xl p-4 mb-3 flex-row items-center shadow-sm" style={{ backgroundColor: theme.surface }}>
            <View className="flex-row items-center">
              <IconSymbol 
                name={task.completed ? 'chevron.right' : 'list.bullet'} 
                color={task.completed ? theme.pink300 : theme.tint} 
                size={20} 
              />
              <View className="ml-3">
                <ThemedText 
                  className={`text-base font-semibold ${task.completed ? 'line-through opacity-40' : ''}`}
                  style={task.completed ? { color: theme.pink300 } : {}}
                >
                  {task.title}
                </ThemedText>
                <ThemedText className="text-xs opacity-60 mt-0.5">{task.category}</ThemedText>
              </View>
            </View>
          </ThemedView>
        ))}
      </ScrollView>
    </ThemedView>
  );
}


