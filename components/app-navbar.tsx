import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const NAV_ITEMS = [
  { href: '/', label: 'Accueil' },
  { href: '/connexion', label: 'Connexion' },
  { href: '/inscription', label: 'Inscription' },
  { href: '/profil', label: 'Profil' },
];

export function AppNavbar() {
  return (
    <View style={styles.navbar}>
      {NAV_ITEMS.map((item) => (
        <Link key={item.href} href={item.href} asChild>
          <Pressable style={styles.navButton}>
            <Text style={styles.navText}>{item.label}</Text>
          </Pressable>
        </Link>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 8,
    marginBottom: 24,
    width: '100%',
    maxWidth: 980,
    alignSelf: 'center',
  },
  navButton: {
    flexGrow: 1,
    flexBasis: '22%',
    minWidth: 120,
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
});
