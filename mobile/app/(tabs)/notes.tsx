import React from 'react';
import { ScrollView, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function NotesScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const notes = [
    { id: '1', title: 'Idea: App Marketing', content: 'Create a social media plan for the new app launch...', date: '2 hours ago' },
    { id: '2', title: 'Grocery List', content: 'Milk, Eggs, Bread, Avocado, Chicken Breast...', date: 'Yesterday' },
    { id: '3', title: 'Meeting Notes', content: 'Discussed the project timeline and budget allocation...', date: '3 days ago' },
  ];

  return (
    <ThemedView className="flex-1 pt-16">
      <View className="flex-row justify-between items-center px-5 mb-5">
        <ThemedText type="title">Notes</ThemedText>
        <IconSymbol name="note.text" color={theme.tint} size={32} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}>
        <View className="gap-4">
          {notes.map(note => (
            <ThemedView key={note.id} className="rounded-2xl p-4 shadow-sm" style={{ backgroundColor: theme.surface }}>
              <ThemedText className="text-lg font-bold mb-2" numberOfLines={1}>{note.title}</ThemedText>
              <ThemedText className="text-sm opacity-70 leading-5 mb-3" numberOfLines={3}>{note.content}</ThemedText>
              <ThemedText className="text-[11px] opacity-40 font-semibold">{note.date}</ThemedText>
            </ThemedView>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity className="absolute right-5 bottom-5 w-[60px] h-[60px] rounded-full justify-center items-center shadow-lg" style={{ backgroundColor: theme.tint }}>
        <IconSymbol name="chevron.right" color="#fff" size={30} />
      </TouchableOpacity>
    </ThemedView>
  );
}


