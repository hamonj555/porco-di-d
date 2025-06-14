import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { colors } from "@/constants/colors";
import ProfileScreen from "@/components/ProfileScreen";

export default function ProfilePage() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" hidden={true} />
      <ProfileScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});