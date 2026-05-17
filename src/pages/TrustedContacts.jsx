import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import {
  addTrustedContact,
  getTrustedContacts,
} from "../services/contactService";

const TrustedContacts = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [contacts, setContacts] = useState([]);
  const [contactForm, setContactForm] = useState({
    name: "",
    phone: "",
    relation: "",
  });

  const fetchContacts = async () => {
    if (!currentUser) return;

    const data = await getTrustedContacts(currentUser.uid);
    setContacts(data);
  };

  const handleAddContact = async (e) => {
    e.preventDefault();

    await addTrustedContact(
      currentUser.uid,
      contactForm.name,
      contactForm.phone,
      contactForm.relation,
    );

    setContactForm({
      name: "",
      phone: "",
      relation: "",
    });

    fetchContacts();
  };

  useEffect(() => {
    fetchContacts();
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100 px-4 sm:px-6 py-6">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-6 bg-white text-rose-600 px-5 py-2 rounded-xl font-semibold shadow-md hover:bg-rose-50 transition"
        >
          ← Back to Dashboard
        </button>

        <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl p-5 sm:p-8 border border-white/40">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Trusted Contacts
          </h1>

          <p className="text-gray-600 mt-2">
            Add and manage people who can help you during emergencies.
          </p>

          <form onSubmit={handleAddContact} className="mt-6 space-y-4">
            <input
              type="text"
              placeholder="Contact Name"
              value={contactForm.name}
              onChange={(e) =>
                setContactForm({ ...contactForm, name: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400"
              required
            />

            <input
              type="tel"
              placeholder="Phone Number"
              value={contactForm.phone}
              onChange={(e) =>
                setContactForm({ ...contactForm, phone: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400"
              required
            />

            <input
              type="text"
              placeholder="Relation e.g. Mother, Friend"
              value={contactForm.relation}
              onChange={(e) =>
                setContactForm({ ...contactForm, relation: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400"
              required
            />

            <button
              type="submit"
              className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-xl font-semibold transition"
            >
              Add Trusted Contact
            </button>
          </form>

          <div className="mt-8 space-y-4">
            {contacts.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No trusted contacts added yet.
              </p>
            ) : (
              contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between sm:items-center bg-rose-50 p-4 rounded-2xl"
                >
                  <div>
                    <p className="font-semibold text-gray-800">
                      {contact.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      {contact.relation} • {contact.phone}
                    </p>
                  </div>

                  <a
                    href={`tel:${contact.phone}`}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-semibold text-center"
                  >
                    📞 Call
                  </a>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustedContacts;
