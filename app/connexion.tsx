import { useRouter } from 'expo-router';
import {
    RecaptchaVerifier,
    signInAnonymously,
    signInWithEmailAndPassword,
    signInWithPhoneNumber,
} from 'firebase/auth';
import { useEffect, useRef, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { AppNavbar } from '../components/app-navbar';
import { auth, facebookProvider, githubProvider } from '../firebaseConfig.js';

export default function ConnexionPage() {
  const router = useRouter();
  const [phoneStep, setPhoneStep] = useState<'phone' | 'otp'>('phone');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const recaptchaVerifier = useRef<RecaptchaVerifier | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      return;
    }

    if (!recaptchaVerifier.current) {
      recaptchaVerifier.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });
      recaptchaVerifier.current.render().catch((error) => {
        console.error('Erreur reCAPTCHA :', error);
      });
    }

    return () => {
      recaptchaVerifier.current?.clear();
      recaptchaVerifier.current = null;
    };
  }, []);

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
      router.replace('/profil');
    } catch (error) {
      showToast('Impossible de se connecter.', 'error');
      console.error('Erreur de connexion :', error);
    }
  };

  const handlePhoneSend = async () => {
    if (Platform.OS !== 'web') {
      showToast('La connexion par téléphone est prête pour le web dans ce projet.', 'error');
      return;
    }

    if (!phoneNumber.trim()) {
      showToast('Veuillez saisir un numéro de téléphone.', 'error');
      return;
    }

    try {
      if (!recaptchaVerifier.current) {
        showToast('reCAPTCHA non prêt.', 'error');
        return;
      }

      const result = await signInWithPhoneNumber(auth, phoneNumber.trim(), recaptchaVerifier.current);
      setConfirmationResult(result);
      setPhoneStep('otp');
      showToast('Code OTP envoyé au téléphone.', 'success');
    } catch (error) {
      showToast('Impossible d’envoyer le code OTP.', 'error');
      console.error('Erreur téléphone Auth :', error);
    }
  };

  const handlePhoneVerify = async () => {
    if (!confirmationResult) {
      showToast('Veuillez d’abord envoyer le code OTP.', 'error');
      return;
    }

    if (!otpCode.trim()) {
      showToast('Veuillez saisir le code OTP.', 'error');
      return;
    }

    try {
      await confirmationResult.confirm(otpCode.trim());
      showToast('Connexion téléphone réussie.', 'success');
      router.replace('/profil');
    } catch (error) {
      showToast('Code OTP invalide.', 'error');
      console.error('Erreur OTP :', error);
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
      router.replace('/profil');
    } catch (error) {
      showToast('Impossible de se connecter avec GitHub.', 'error');
      console.error('Erreur GitHub Auth :', error);
    }
  };

  const handleFacebookSignIn = async () => {
    if (Platform.OS !== 'web') {
      showToast('Facebook Auth est disponible sur le web uniquement pour ce projet.', 'error');
      return;
    }

    try {
      const { signInWithPopup } = await import('firebase/auth');
      await signInWithPopup(auth, facebookProvider);
      showToast('Connexion Facebook réussie.', 'success');
      router.replace('/profil');
    } catch (error) {
      showToast('Impossible de se connecter avec Facebook.', 'error');
      console.error('Erreur Facebook Auth :', error);
    }
  };

  const handleAnonymousSignIn = async () => {
    try {
      await signInAnonymously(auth);
      showToast('Connexion anonyme réussie.', 'success');
      router.replace('/profil');
    } catch (error) {
      showToast('Impossible de se connecter anonymement.', 'error');
      console.error('Erreur Auth anonyme :', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AppNavbar />
      <View style={styles.hero}>
        <Text style={styles.kicker}>Authentification</Text>
        <Text style={styles.title}>Connexion</Text>
        <Text style={styles.subtitle}>
          Choisissez votre méthode de connexion et avancez étape par étape.
        </Text>
      </View>

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

      <View style={styles.cardSection}>
        <Text style={styles.sectionTitle}>Autres providers</Text>
        <Text style={styles.helperText}>
          GitHub, Facebook et connexion anonyme sont prêts à être activés.
        </Text>

        <Pressable style={styles.secondaryButton} onPress={handleGithubSignIn}>
          <Text style={styles.secondaryButtonText}>Se connecter avec GitHub</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={handleFacebookSignIn}>
          <Text style={styles.secondaryButtonText}>Se connecter avec Facebook</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={handleAnonymousSignIn}>
          <Text style={styles.secondaryButtonText}>Connexion anonyme</Text>
        </Pressable>
      </View>

      <View style={styles.cardSection}>
        <Text style={styles.sectionTitle}>Provider téléphone</Text>
        <Text style={styles.helperText}>
          1. Saisissez votre numéro.
          2. Envoyez le code.
          3. Le champ OTP apparaît ensuite.
        </Text>

        <Text style={styles.label}>Numéro de téléphone</Text>
        <TextInput
          style={styles.input}
          placeholder="+33 6 00 00 00 00"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />

        <Pressable style={styles.secondaryButton} onPress={handlePhoneSend}>
          <Text style={styles.secondaryButtonText}>Envoyer le code OTP</Text>
        </Pressable>

        {phoneStep === 'otp' ? (
          <View style={styles.otpBlock}>
            <Text style={styles.label}>Code OTP</Text>
            <TextInput
              style={styles.input}
              placeholder="123456"
              keyboardType="number-pad"
              value={otpCode}
              onChangeText={setOtpCode}
            />

            <Pressable style={styles.secondaryButton} onPress={handlePhoneVerify}>
              <Text style={styles.secondaryButtonText}>Vérifier le code OTP</Text>
            </Pressable>
          </View>
        ) : null}
      </View>

      <View nativeID="recaptcha-container" style={styles.recaptcha} />
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
  otpBlock: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
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
  recaptcha: {
    width: 0,
    height: 0,
    overflow: 'hidden',
  },
});
