import React from "react";
import { Tabs } from "expo-router";
import { colors } from "@/constants/colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { display: 'none' }, // Hide the tab bar since we're using our custom one
        headerShown: false, // Hide the header since we're using our custom one
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profilo",
        }}
      />
    </Tabs>
  );
}