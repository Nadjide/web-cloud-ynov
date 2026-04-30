import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppNavbar } from '../components/app-navbar';
import { auth } from '../firebaseConfig.js';

export default function ProfilPage() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.replace('/connexion');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AppNavbar />

      <View style={styles.content}>
        <Text style={styles.title}>Profil</Text>
        <Text style={styles.message}>Ici s’affichera prochainement votre profil</Text>

        <Pressable style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Déconnexion</Text>
        </Pressable>
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
    paddingBottom: 48,
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
    fontSize: 28,
    fontWeight: '700',
    color: '#101828',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: '#344054',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#1d4ed8',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
