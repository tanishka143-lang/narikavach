import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export const createSosAlert = async (user, location) => {
  const sosData = {
    userId: user.uid,
    email: user.email,
    latitude: location.latitude,
    longitude: location.longitude,
    status: "ACTIVE",
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "sosAlerts"), sosData);

  return docRef.id;
};
