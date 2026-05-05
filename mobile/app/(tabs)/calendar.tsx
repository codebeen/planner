import React from 'react';
import { ScrollView, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function CalendarScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dates = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <ThemedView className="flex-1 pt-16">
      <View className="flex-row justify-between items-center px-5 mb-5">
        <ThemedText type="title">Calendar</ThemedText>
        <IconSymbol name="calendar" color={theme.tint} size={32} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        <ThemedView className="rounded-3xl p-5 shadow-md" style={{ backgroundColor: theme.surface }}>
          <View className="flex-row justify-between mb-4">
            {days.map(day => (
              <ThemedText key={day} className="w-10 text-center text-xs font-semibold opacity-50">{day}</ThemedText>
            ))}
          </View>
          <View className="flex-row flex-wrap justify-between">
            {dates.map(date => (
              <View key={date} className={`w-10 h-10 justify-center items-center mb-2 ${date === 6 ? 'bg-primary rounded-full' : ''}`}>
                <ThemedText className={`text-sm font-medium ${date === 6 ? 'text-white' : ''}`}>{date}</ThemedText>
              </View>
            ))}
          </View>
        </ThemedView>

        <View className="mt-6">
          <ThemedText type="subtitle">Upcoming Events</ThemedText>
          <ThemedView className="mt-3 p-4 rounded-xl shadow-sm border-l-4" style={{ backgroundColor: theme.surface, borderLeftColor: theme.tint }}>
            <ThemedText className="text-xs opacity-60">10:00 AM</ThemedText>
            <ThemedText className="text-base font-semibold mt-1">Project Planning</ThemedText>
          </ThemedView>
        </View>
      </ScrollView>
    </ThemedView>
  );
}


