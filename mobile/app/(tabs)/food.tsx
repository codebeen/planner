import React from 'react';
import { ScrollView, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function FoodScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const meals = [
    { id: '1', type: 'Breakfast', name: 'Oatmeal with Blueberries', calories: 350 },
    { id: '2', type: 'Lunch', name: 'Grilled Chicken Salad', calories: 450 },
    { id: '3', type: 'Dinner', name: 'Salmon and Quinoa', calories: 600 },
    { id: '4', type: 'Snack', name: 'Greek Yogurt', calories: 150 },
  ];

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const goal = 2000;

  return (
    <ThemedView className="flex-1 pt-16">
      <View className="flex-row justify-between items-center px-5 mb-5">
        <ThemedText type="title">Food Log</ThemedText>
        <IconSymbol name="fork.knife" color={theme.tint} size={32} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        <ThemedView className="rounded-3xl p-6 shadow-md" style={{ backgroundColor: theme.surface }}>
          <View className="gap-3">
            <View className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: theme.border }}>
              <View 
                className="h-full rounded-full" 
                style={{ width: `${(totalCalories / goal) * 100}%`, backgroundColor: theme.tint }} 
              />
            </View>
            <View className="flex-row justify-between items-baseline">
              <ThemedText className="text-3xl font-extrabold">
                {totalCalories} <ThemedText className="text-base font-normal opacity-60">kcal</ThemedText>
              </ThemedText>
              <ThemedText className="text-sm opacity-50">of {goal} kcal</ThemedText>
            </View>
          </View>
        </ThemedView>

        <View className="mt-6">
          {meals.map(meal => (
            <ThemedView key={meal.id} className="rounded-2xl p-4 mb-3 shadow-sm" style={{ backgroundColor: theme.surface }}>
              <View className="flex-row justify-between mb-1">
                <ThemedText className="text-[10px] font-bold uppercase tracking-widest opacity-50">{meal.type}</ThemedText>
                <ThemedText className="text-sm font-semibold">{meal.calories} kcal</ThemedText>
              </View>
              <ThemedText className="text-base font-medium">{meal.name}</ThemedText>
            </ThemedView>
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}


