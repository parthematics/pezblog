import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { addNewEntry, getAllEntries } from "../supabase/service";
import { BlogEntry } from "../supabase";

export const Dashboard: React.FC = () => {
  const { session } = useAuth();
  const [entries, setEntries] = useState<BlogEntry[]>([]);
  const [newEntryTitle, setNewEntryTitle] = useState("");
  const [newEntryContent, setNewEntryContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch entries
  useEffect(() => {
    const fetchEntries = async () => {
      if (session) {
        const { data, error } = await getAllEntries(session.user.id);
        if (error) {
          console.error("Error fetching entries:", error);
        } else {
          setEntries(data ?? []);
        }
        setIsLoading(false);
      }
    };

    fetchEntries();
  }, [session]);

  // Handle new entry submission
  const handleNewEntrySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    const { data, error } = await addNewEntry(
      session.user.id,
      newEntryTitle,
      newEntryContent
    );

    if (error) {
      console.error("Error adding new entry:", error);
    } else {
      if (data && data[0]) {
        setEntries([...entries, data[0]]);
        setNewEntryTitle(data[0].title ?? "");
        setNewEntryContent(data[0].content ?? "");
      }
    }
  };

  if (!session) {
    return <div>Please log in to view this page.</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <form onSubmit={handleNewEntrySubmit}>
        <input
          type="text"
          value={newEntryTitle}
          onChange={(e) => setNewEntryTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <textarea
          value={newEntryContent}
          onChange={(e) => setNewEntryContent(e.target.value)}
          placeholder="Content"
          required
        />
        <button type="submit">Add Entry</button>
      </form>
      <div>
        {entries.map((entry, index) => (
          <div key={index}>
            <h3>{entry.title}</h3>
            <p>{entry.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
