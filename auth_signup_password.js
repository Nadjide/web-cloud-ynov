import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig.js';

export const signUp = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Signed in
        const user = userCredential.user;

        console.log(user);
        console.log("User created successfully");
        // ...
    } catch (error) {
        console.error("Error creating user:", error);
    }
}