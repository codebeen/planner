import React from 'react';
import { ScrollView, View, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { HelloWave } from '@/components/hello-wave';

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  return (
    <ThemedView className="flex-1 pt-16">
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <ThemedText className="text-base opacity-60">Good Morning,</ThemedText>
            <ThemedText type="title" className="text-3xl font-extrabold">Darben</ThemedText>
          </View>
          <View className="w-12 h-12 rounded-full justify-center items-center" style={{ backgroundColor: theme.pink200 }}>
            <ThemedText className="font-bold" style={{ color: theme.pink700 }}>D</ThemedText>
          </View>
        </View>

        <ThemedView className="rounded-[32px] p-6 h-[180px] overflow-hidden mb-8 relative" style={{ backgroundColor: theme.tint }}>
          <View className="z-10 justify-center h-full">
            <ThemedText className="text-white text-2xl font-extrabold mb-2">Today's Focus</ThemedText>
            <ThemedText className="text-white/80 text-sm max-w-[70%] mb-4">You have 5 tasks to complete today. You can do it!</ThemedText>
            <TouchableOpacity className="bg-white px-4 py-2 rounded-xl self-start">
              <ThemedText className="font-bold" style={{ color: theme.tint }}>View Tasks</ThemedText>
            </TouchableOpacity>
          </View>
          <IconSymbol name="paperplane.fill" color="rgba(255,255,255,0.2)" size={120} className="absolute -right-5 -bottom-5" />
        </ThemedView>

        <View className="mb-4">
          <ThemedText type="subtitle">Stats Today</ThemedText>
        </View>
        <View className="flex-row gap-4 mb-8">
          <ThemedView className="flex-1 rounded-3xl p-5 items-center shadow-sm" style={{ backgroundColor: theme.surface }}>
            <IconSymbol name="calendar" color={theme.tint} size={24} />
            <ThemedText className="text-xl font-extrabold mt-3">1</ThemedText>
            <ThemedText className="text-xs opacity-50 mt-0.5">Scheduled Events</ThemedText>
          </ThemedView>
          <ThemedView className="flex-1 rounded-3xl p-5 items-center shadow-sm" style={{ backgroundColor: theme.surface }}>
            <IconSymbol name="list.bullet" color={theme.tint} size={24} />
            <ThemedText className="text-xl font-extrabold mt-3">3/8</ThemedText>
            <ThemedText className="text-xs opacity-50 mt-0.5">Tasks Done</ThemedText>
          </ThemedView>
        </View>
        <View className="flex-row gap-4 mb-8">
          <ThemedView className="flex-1 rounded-3xl p-5 items-center shadow-sm" style={{ backgroundColor: theme.surface }}>
            <IconSymbol name="note.text" color={theme.tint} size={24} />
            <ThemedText className="text-xl font-extrabold mt-3">1</ThemedText>
            <ThemedText className="text-xs opacity-50 mt-0.5">Notes Taken</ThemedText>
          </ThemedView>
          <ThemedView className="flex-1 rounded-3xl p-5 items-center shadow-sm" style={{ backgroundColor: theme.surface }}>
            <IconSymbol name="fork.knife" color={theme.tint} size={24} />
            <ThemedText className="text-xl font-extrabold mt-3">2</ThemedText>
            <ThemedText className="text-xs opacity-50 mt-0.5">Meals Logged</ThemedText>
          </ThemedView>
        </View>

        <View className="mb-4">
          <ThemedText type="subtitle">Today's Schedule</ThemedText>
        </View>

        <ThemedView className="flex-row items-center p-4 rounded-2xl shadow-sm mb-6" style={{ backgroundColor: theme.surface }}>
          <View className="w-10 h-10 rounded-xl justify-center items-center" style={{ backgroundColor: theme.pink50 }}>
            <IconSymbol name="note.text" color={theme.tint} size={20} />
          </View>
          <View className="flex-1 ml-3">
            <ThemedText className="text-base font-bold">App Design Ideas</ThemedText>
            <ThemedText className="text-sm opacity-50 mt-0.5" numberOfLines={1}>Focus on pink theme and modern cards...</ThemedText>
          </View>
          <IconSymbol name="chevron.right" color={theme.pink300} size={20} />
        </ThemedView>

        <View className="mb-4">
          <ThemedText type="subtitle">Recent Notes</ThemedText>
        </View>

        <ThemedView className="flex-row items-center p-4 rounded-2xl shadow-sm" style={{ backgroundColor: theme.surface }}>
          <View className="w-10 h-10 rounded-xl justify-center items-center" style={{ backgroundColor: theme.pink50 }}>
            <IconSymbol name="note.text" color={theme.tint} size={20} />
          </View>
          <View className="flex-1 ml-3">
            <ThemedText className="text-base font-bold">App Design Ideas</ThemedText>
            <ThemedText className="text-sm opacity-50 mt-0.5" numberOfLines={1}>Focus on pink theme and modern cards...</ThemedText>
          </View>
          <IconSymbol name="chevron.right" color={theme.pink300} size={20} />
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}


