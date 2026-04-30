# Web Cloud Ynov

Projet individuel Expo / React Native avec Expo Router, Firebase Auth et déploiement Web sur GitHub Pages.

## Déploiement

Application Web déployée : https://nadjide.github.io/web-cloud-ynov/

## Fonctionnalités

- Navigation Expo Router avec pages Accueil, Connexion, Inscription et Profil
- Inscription avec nom, email et mot de passe
- Connexion par email / mot de passe
- Connexion par téléphone avec OTP
- Connexion avec GitHub
- Connexion avec Facebook prête côté code
- Connexion anonyme prête côté code
- Toast de feedback visuel
- Redirection vers la page Profil après authentification
- Déconnexion avec retour vers la page Connexion

## Lancement local

```bash
npm install
npx expo start
```

## Build Web

```bash
npm run predeploy
```

## Notes

- Le provider Facebook est implémenté dans le projet, mais j'ai pas reussi à créer un compte meta il me bloquait la création de celui-ci, comme quoi mon appareil est pas de confiance et ça peut importe l'appareil ...
- Le lien GitHub Pages est : https://nadjide.github.io/web-cloud-ynov/
