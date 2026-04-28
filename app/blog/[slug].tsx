import { useLocalSearchParams } from "expo-router";
import { ThemedText } from "../../components/themed-text";
import { ThemedView } from "../../components/themed-view";

export default function BlogPage() {
  const { slug } = useLocalSearchParams();
  
  return (
    <ThemedView>
      <ThemedText>Blog Post: {slug}</ThemedText>
    </ThemedView>
  );
}