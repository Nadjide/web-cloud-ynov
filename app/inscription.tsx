import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { signUp } from '../auth_signup_password';
import { AppNavbar } from '../components/app-navbar';
import { auth, githubProvider } from '../firebaseConfig.js';

export default function InscriptionPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const showToast = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value);

  const isValidPassword = (value: string) => value.length >= 6;

  const isValidName = (value: string) => value.trim().length >= 2;

  const handleSubmit = async () => {
    if (!isValidName(name)) {
      showToast('Veuillez saisir un nom valide.', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showToast('Veuillez saisir une adresse email valide.', 'error');
      return;
    }

    if (!isValidPassword(password)) {
      showToast('Le mot de passe doit contenir au moins 6 caractères.', 'error');
      return;
    }

    try {
      await signUp(email, password, name.trim());
      showToast('Compte créé avec Firebase Auth.', 'success');
      router.replace('/profil');
    } catch {
      showToast('Impossible de créer le compte.', 'error');
    }
  };

  const handleGithubSignIn = async () => {
    if (Platform.OS !== 'web') {
      showToast('GitHub Auth est disponible sur le web uniquement pour ce projet.', 'error');
      return;
    }

    try {
      const { signInWithPopup } = await import('firebase/auth');
      await signInWithPopup(auth, githubProvider);
      showToast('Inscription/connexion GitHub réussie.', 'success');
    } catch (error) {
      showToast('Impossible d’utiliser GitHub.', 'error');
      console.error('Erreur GitHub Auth :', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AppNavbar />
      <View style={styles.hero}>
        <Text style={styles.kicker}>Créer un compte</Text>
        <Text style={styles.title}>Inscription</Text>
        <Text style={styles.subtitle}>
          Un formulaire clair, rapide et optimisé pour les trois informations essentielles.
        </Text>
      </View>

      {toastMessage ? (
        <View style={[styles.toast, toastType === 'success' ? styles.toastSuccess : styles.toastError]}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      ) : null}

      <View style={styles.form}>
        <Text style={styles.formHint}>Renseignez d’abord votre identité, puis vos accès.</Text>

        <Text style={styles.label}>Nom</Text>
        <TextInput
          style={styles.input}
          placeholder="Votre nom"
          autoCapitalize="words"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="email@exemple.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Mot de passe</Text>
        <TextInput
          style={styles.input}
          placeholder="Choisissez un mot de passe"
          secureTextEntry
          autoCapitalize="none"
          value={password}
          onChangeText={setPassword}
        />

        <Pressable style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Envoyer</Text>
        </Pressable>
      </View>

      <View style={styles.cardSection}>
        <Text style={styles.sectionTitle}>Provider téléphone</Text>
        <Text style={styles.helperText}>
          Réservé pour la création de compte par numéro de téléphone et code OTP.
        </Text>

        <Text style={styles.label}>Numéro de téléphone</Text>
        <TextInput
          style={styles.input}
          placeholder="+33 6 00 00 00 00"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />

        <Text style={styles.label}>Code OTP</Text>
        <TextInput
          style={styles.input}
          placeholder="123456"
          keyboardType="number-pad"
          value={otpCode}
          onChangeText={setOtpCode}
        />
      </View>

      <View style={styles.cardSection}>
        <Text style={styles.sectionTitle}>Provider GitHub</Text>
        <Text style={styles.helperText}>
          Connexion via le compte GitHub pour les utilisateurs web.
        </Text>

        <Pressable style={styles.secondaryButton} onPress={handleGithubSignIn}>
          <Text style={styles.secondaryButtonText}>Continuer avec GitHub</Text>
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
  hero: {
    width: '100%',
    maxWidth: 980,
    alignSelf: 'center',
    marginBottom: 16,
    backgroundColor: '#0f172a',
    borderRadius: 20,
    padding: 20,
  },
  kicker: {
    color: '#93c5fd',
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    color: '#cbd5e1',
    fontSize: 15,
    lineHeight: 22,
  },
  form: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 980,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  formHint: {
    fontSize: 13,
    color: '#475467',
    marginBottom: 16,
  },
  toast: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  toastSuccess: {
    backgroundColor: '#d1fadf',
  },
  toastError: {
    backgroundColor: '#fee4e2',
  },
  toastText: {
    color: '#101828',
    fontWeight: '600',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#344054',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d0d5dd',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
    backgroundColor: '#ffffff',
  },
  button: {
    marginTop: 8,
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
  cardSection: {
    marginTop: 16,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 980,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#101828',
    marginBottom: 4,
  },
  helperText: {
    fontSize: 13,
    color: '#667085',
    marginBottom: 14,
  },
  secondaryButton: {
    backgroundColor: '#111827',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  secondaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
