import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { auth, githubProvider } from '../firebaseConfig.js';

export default function ConnexionPage() {
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

  const handleSubmit = async () => {
    if (!isValidEmail(email)) {
      showToast('Veuillez saisir une adresse email valide.', 'error');
      return;
    }

    if (!isValidPassword(password)) {
      showToast('Le mot de passe doit contenir au moins 6 caractères.', 'error');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      showToast('Connexion réussie avec Firebase Auth.', 'success');
      console.log('Utilisateur connecté :', auth.currentUser);
    } catch (error) {
      showToast('Impossible de se connecter.', 'error');
      console.error('Erreur de connexion :', error);
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
      showToast('Connexion GitHub réussie.', 'success');
    } catch (error) {
      showToast('Impossible de se connecter avec GitHub.', 'error');
      console.error('Erreur GitHub Auth :', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>

      {toastMessage ? (
        <View style={[styles.toast, toastType === 'success' ? styles.toastSuccess : styles.toastError]}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      ) : null}

      <View style={styles.form}>
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
          placeholder="Votre mot de passe"
          secureTextEntry
          autoCapitalize="none"
          value={password}
          onChangeText={setPassword}
        />

        <Pressable style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Envoyer</Text>
        </Pressable>
      </View>

      <View style={styles.phoneSection}>
        <Text style={styles.sectionTitle}>Provider téléphone</Text>
        <Text style={styles.helperText}>
          Réservé pour la connexion par numéro de téléphone et code OTP.
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

      <View style={styles.providerSection}>
        <Text style={styles.sectionTitle}>Provider GitHub</Text>
        <Text style={styles.helperText}>
          Connexion via le compte GitHub pour les utilisateurs web.
        </Text>

        <Pressable style={styles.secondaryButton} onPress={handleGithubSignIn}>
          <Text style={styles.secondaryButtonText}>Se connecter avec GitHub</Text>
        </Pressable>
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#101828',
    marginBottom: 20,
  },
  form: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
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
  phoneSection: {
    marginTop: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
  },
  providerSection: {
    marginTop: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
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
  },
  secondaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
