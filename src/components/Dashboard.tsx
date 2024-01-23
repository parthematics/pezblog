import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  type ChangeEvent,
} from "react";
import { useAuth } from "./AuthContext";
import {
  addNewEntry,
  getAllEntries,
  getUser,
  deleteEntry,
  makeEntryPublic,
  associateEntryWithSharedUid,
  calculateStreak,
  copyToClipboard,
  stringToList,
  type BlogEntry,
  type User,
} from "../supabase";

export const Dashboard: React.FC = () => {
  const { session } = useAuth();
  const [entries, setEntries] = useState<BlogEntry[]>([]);
  const [streak, setStreak] = useState<number>(0);
  const [user, setUser] = useState<User | null>(null);
  const [newEntryTitle, setNewEntryTitle] = useState("");
  const [newEntryContent, setNewEntryContent] = useState("");
  const [newEntryTags, setNewEntryTags] = useState("");
  const [filteringByTag, setFilteringByTag] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const fetchEntries = async () => {
      if (session) {
        const { data, error } = await getAllEntries(session.user.id);
        if (error) {
          console.error("Error fetching entries: ", error);
        } else {
          const sortedEntries = data?.sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          );
          setEntries(sortedEntries ?? []);
        }
        setIsLoading(false);
      }
    };

    const fetchUser = async () => {
      if (session) {
        const { data: user, error } = await getUser(session.user.id);
        if (error) {
          console.error("Error fetching user: ", error);
        } else {
          setUser(user);
        }
      }
    };

    fetchEntries();
    fetchUser();
  }, [session]);

  useEffect(() => {
    const streak = calculateStreak(entries ?? []);
    setStreak(streak);
  }, [entries]);

  const filteredEntries = useMemo(() => {
    if (!filteringByTag) {
      return entries;
    }
    return entries.filter((entry) => entry.tags?.includes(filteringByTag));
  }, [entries, filteringByTag]);

  // Handle new entry submission
  const handleNewEntrySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    const { data, error } = await addNewEntry(
      session.user.id,
      newEntryTitle,
      newEntryContent,
      newEntryTags ? stringToList(newEntryTags) : []
    );

    if (error) {
      console.error("Error adding new entry:", error);
    } else {
      if (data && data[0]) {
        setEntries([data[0], ...entries]);
        setNewEntryTitle("");
        setNewEntryContent("");
        setNewEntryTags("");
      }
    }
  };

  const handleDeleteEntry = async (entryId: number) => {
    const confirmDelete = window.confirm(
      "are you sure you want to delete this entry?"
    );
    if (confirmDelete) {
      const { error } = await deleteEntry(entryId);
      if (error) {
        console.error("Error deleting entry:", error);
      } else {
        setEntries(entries.filter((entry) => entry.id !== entryId));
      }
    }
  };

  const handleShareEntry = async (entryId: number) => {
    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    const sharingUid = Math.random().toString(36).substring(2, 15);
    const shareableLink = `${baseUrl}/dashboard/entry/${sharingUid}`;
    // copy link to clipboard first bc Apple devices have specific requirements
    copyToClipboard(shareableLink).then(
      () => {
        alert("link copied to clipboard!");
      },
      (err) => {
        console.error("Could not copy link: ", err);
      }
    );
    const { error: publicError } = await makeEntryPublic(entryId);
    if (publicError) {
      console.error("Error marking entry as public: ", publicError);
    } else {
      const { error: sharingError } = await associateEntryWithSharedUid(
        sharingUid,
        entryId
      );
      if (sharingError) {
        console.error(
          "Error associating entry with sharing uid: ",
          sharingError
        );
      }
    }
  };

  const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNewEntryContent(e.target.value);
    const textArea = textAreaRef.current;
    if (textArea) {
      textArea.style.height = "auto";
      textArea.style.height = `${textArea.scrollHeight}px`;
    }
  };

  if (!session) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div>
          <a href="/">please log in to view this page</a>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-8 px-4">
      <h1 className="text-2xl font-bold mt-6 -mb-5">
        {user?.username ?? "my"}
        {user?.username ? "'s" : ""} entries
      </h1>
      <h3>
        {streak > 0 ? "🔥 " : ""}
        {streak} day streak
        {streak > 0 ? " 🔥" : ""}
      </h3>
      <form
        onSubmit={handleNewEntrySubmit}
        className="flex flex-col items-center w-full md:w-1/2"
      >
        <input
          type="text"
          value={newEntryTitle}
          onChange={(e) => {
            setNewEntryTitle(e.target.value);
          }}
          placeholder="title"
          required={true}
          className="px-4 py-2 border rounded w-full md:w-2/3 mb-4"
        />
        <textarea
          ref={textAreaRef}
          value={newEntryContent}
          onChange={handleTextAreaChange}
          placeholder="content"
          required
          className="px-4 py-2 border rounded w-full md:w-2/3 mb-4"
        />
        <input
          type="text"
          value={newEntryTags}
          onChange={(e) => {
            setNewEntryTags(e.target.value);
          }}
          placeholder="tags (optional, space separated)"
          className="px-4 py-2 border rounded w-full md:w-2/3 mb-8"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-800"
        >
          add entry
        </button>
      </form>
      {filteringByTag && (
        <div className="w-full md:w-5/12 flex justify-between">
          <h2 className="text-md -mb-4">
            entries tagged with: "<strong>{filteringByTag}</strong>"
          </h2>
        </div>
      )}
      <div className="w-full md:w-5/12">
        {filteredEntries.map((entry, index) => (
          <div key={index} className="my-4 pb-3 border-b">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-bold text-lg">{entry.title}</h2>
              <span className="text-sm text-gray-600">
                {new Date(entry.created_at).toLocaleDateString() + " "}
                {new Date(entry.created_at).toLocaleTimeString()}
              </span>
            </div>
            <p className="mb-2 flex-grow whitespace-pre-line">
              {entry.content}
            </p>
            <div className="flex justify-end">
              <div className="flex-grow">
                {entry.tags &&
                  entry.tags.map((tag, index) =>
                    tag !== filteringByTag ? (
                      <button
                        key={index}
                        onClick={() => {
                          setFilteringByTag(tag);
                        }}
                        className="bg-blue-100 hover:bg-blue-300 text-gray-900 text-xs px-1.5 py-0.5 rounded mr-1"
                      >
                        {tag}
                      </button>
                    ) : (
                      <button
                        key={index}
                        onClick={() => {
                          setFilteringByTag("");
                        }}
                        className="bg-blue-600 hover:bg-blue-800 text-white hover:text-white text-xs px-1.5 py-0.5 rounded mr-1"
                      >
                        {tag}
                      </button>
                    )
                  )}
              </div>
              <button
                onClick={async () => {
                  await handleShareEntry(entry.id);
                }}
                className="text-blue-600 hover:text-blue-800 text-sm pr-2"
              >
                share
              </button>
              <button
                onClick={async () => {
                  await handleDeleteEntry(entry.id);
                }}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
