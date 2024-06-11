import { initializeApp } from "firebase/app";
import "firebase/firestore"; // Si vas a usar Firestore
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: 'AIzaSyCjbyg4-S11znlXWftRXOFarBld47sCUps',
  authDomain: 'resumen-actividades-2024-1.firebaseapp.com',
  projectId: 'resumen-actividades-2024-1',
  storageBucket: 'resumen-actividades-2024-1.appspot.com',
  messagingSenderId: '37634715487',
  appId: '1:37634715487:web:793fc166f1ae9ada2f50ea',
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar instancias de Firestore y Storage si los necesitas
export const db = getFirestore(app);
export const storage = getStorage(app);
console.log("Storage object:", storage);

