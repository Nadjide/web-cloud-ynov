import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function Page() {
  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <Link href="/" asChild>
          <Pressable style={styles.navButton}>
            <Text style={styles.navText}>Accueil</Text>
          </Pressable>
        </Link>
        <Link href="../connexion" asChild>
          <Pressable style={styles.navButton}>
            <Text style={styles.navText}>Connexion</Text>
          </Pressable>
        </Link>
        <Link href="../inscription" asChild>
          <Pressable style={styles.navButton}>
            <Text style={styles.navText}>Inscription</Text>
          </Pressable>
        </Link>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Bienvenue sur Web Cloud Ynov</Text>
        <Text style={styles.subtitle}>
          Utilisez la barre de navigation pour aller vers la connexion ou l'inscription.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8fb',
    paddingTop: 56,
    paddingHorizontal: 16,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 8,
    marginBottom: 24,
  },
  navButton: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: '#e9eefc',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  navText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a2b6d',
  },
  content: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
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