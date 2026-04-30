import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppNavbar } from '../../components/app-navbar';

export default function Page() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AppNavbar />

      <View style={styles.content}>
        <Text style={styles.title}>Bienvenue sur Web Cloud Ynov</Text>
        <Text style={styles.subtitle}>
          Utilisez la barre de navigation pour aller vers la connexion ou l’inscription.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f6f8fb',
    paddingVertical: 56,
    paddingHorizontal: 16,
  },
  content: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 980,
    alignSelf: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#101828',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#475467',
    lineHeight: 22,
  },
});