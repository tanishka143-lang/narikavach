import { addDoc, collection, getDocs, query, where } from "firebase/firestore";

import { db } from "../firebase/firebaseConfig";

// ADD CONTACT
export const addTrustedContact = async (userId, name, phone, relation) => {
  const contactData = {
    userId,
    name,
    phone,
    relation,
  };

  const docRef = await addDoc(collection(db, "trustedContacts"), contactData);

  return docRef.id;
};

// GET CONTACTS
export const getTrustedContacts = async (userId) => {
  const q = query(
    collection(db, "trustedContacts"),
    where("userId", "==", userId),
  );

  const querySnapshot = await getDocs(q);

  const contacts = [];

  querySnapshot.forEach((doc) => {
    contacts.push({
      id: doc.id,
      ...doc.data(),
    });
  });

  return contacts;
};
