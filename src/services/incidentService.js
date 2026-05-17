import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export const createIncidentReport = async (user, incidentData) => {
  const reportData = {
    userId: user.uid,
    email: user.email,
    title: incidentData.title,
    description: incidentData.description,
    category: incidentData.category,
    threatLevel: incidentData.threatLevel,
    location: incidentData.location,
    status: "REPORTED",
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "incidentReports"), reportData);

  return docRef.id;
};
