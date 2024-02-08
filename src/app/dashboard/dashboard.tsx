"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  type ChangeEvent,
} from "react";
import {
  addNewEntry,
  editEntry,
  getAllEntries,
  deleteEntry,
  deleteImage,
  makeEntryPublic,
  associateEntryWithSharedUid,
  getUsernameFromAuthId,
  calculateStreak,
  copyToClipboard,
  stringToList,
  generatePrompt,
  hashCode,
  type BlogEntry,
} from "@/app/server";
import { User as SupabaseUser } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";

export default function DashboardPage({ user }: { user: SupabaseUser | null }) {
  const [entries, setEntries] = useState<BlogEntry[]>([]);
  const [streak, setStreak] = useState<number>(0);
  const [newEntryTitle, setNewEntryTitle] = useState("");
  const [newEntryContent, setNewEntryContent] = useState("");
  const [newEntryTags, setNewEntryTags] = useState("");
  const [filteringByTag, setFilteringByTag] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [isPromptLoading, setIsPromptLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [editedEntryTuple, setEditedEntryTuple] = useState<
    [number | null, number | null]
  >([null, null]);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const fetchEntries = async () => {
      if (user) {
        const userAuthId = user?.id;
        const { data: usernameData } = await getUsernameFromAuthId(userAuthId);
        setUsername(usernameData?.username ?? "");

        const { data, error } = await getAllEntries(userAuthId);
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
    fetchEntries();
  }, [user]);

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

  if (isLoading) {
    if (user) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div>
            <i
              className="fas fa-spinner fa-spin"
              style={{ fontSize: "60px" }}
            ></i>
          </div>
        </div>
      );
    } else {
      if (!user) {
        return (
          <div className="flex justify-center items-center h-screen">
            <div>
              <a href="/">please log in to view this page</a>
            </div>
          </div>
        );
      }
    }
  }

  // Handle new entry submission
  const handleNewEntrySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      console.error("User auth id not found");
      return;
    }
    const { data, error } = await addNewEntry(
      user?.id,
      newEntryTitle,
      newEntryContent,
      newEntryTags ? stringToList(newEntryTags) : [],
      imageUrl
    );

    if (error) {
      console.error("Error adding new entry:", error);
    } else {
      if (data && data[0]) {
        setEntries([data[0], ...entries]);
        clearForm();
      }
    }
  };

  const handleEditedEntrySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      console.error("User auth id not found");
      return;
    }
    // In the case where we're editing an existing entry
    const editedEntryId = editedEntryTuple[0] ?? -1;
    const editedEntryIdx = editedEntryTuple[1] ?? -1;
    const { error } = await editEntry(
      editedEntryId ?? -1,
      newEntryTitle,
      newEntryContent,
      newEntryTags ? stringToList(newEntryTags) : []
    );
    if (error) {
      console.error("Error editing entry:", error);
    } else {
      clearForm();
      entries[editedEntryIdx].title = newEntryTitle;
      entries[editedEntryIdx].content = newEntryContent;
      entries[editedEntryIdx].tags = newEntryTags
        ? stringToList(newEntryTags)
        : [];
      setEntries(entries);
    }
  };

  const handleDeleteEntry = async (
    entryId: number,
    entryImageUrl?: string | null | undefined
  ) => {
    const confirmDelete = window.confirm(
      "are you sure you want to delete this entry?"
    );
    if (confirmDelete) {
      const { error: dbDeleteError } = await deleteEntry(entryId);
      const { error: imageDeleteError } = entryImageUrl
        ? await deleteImage(entryImageUrl)
        : { error: null };
      if (dbDeleteError) {
        console.error("Error deleting entry: ", dbDeleteError);
      } else if (imageDeleteError) {
        console.error("Error deleting image: ", imageDeleteError);
      } else {
        setEntries(entries.filter((entry) => entry.id !== entryId));
      }
    }
  };

  const handleEditEntry = async (entryId: number) => {
    const entryToEditIdx = entries.findIndex((entry) => entry.id === entryId);
    const entryToEdit = entries[entryToEditIdx];
    setNewEntryTitle(entryToEdit?.title ?? "");
    setNewEntryContent(entryToEdit?.content ?? "");
    setNewEntryTags(entryToEdit?.tags?.join(" ") ?? "");
    setEditedEntryTuple([entryId, entryToEditIdx]);
    setIsEditing(true);
    // Ensure state updates have been flushed to DOM
    requestAnimationFrame(() => {
      const textArea = textAreaRef.current;
      if (textArea) {
        textArea.style.height = "auto";
        textArea.style.height = `${textArea.scrollHeight}px`;
      }
      window.scrollTo(0, 0);
    });
  };

  const handlePromptGeneration = async () => {
    setIsPromptLoading(true);
    const prompt = await generatePrompt();
    setNewEntryContent(prompt ?? newEntryContent);
    setIsPromptLoading(false);
    // Ensure state updates have been flushed to DOM
    requestAnimationFrame(() => {
      const textArea = textAreaRef.current;
      if (textArea) {
        textArea.style.height = "auto";
        textArea.style.height = `${textArea.scrollHeight}px`;
      }
    });
  };

  const handleShareEntry = async (entryId: number, timestamp: string) => {
    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    // quickly generate a unique id for the entry to be shared (don't reveal the actual entry id)
    const sharingUid = hashCode(user?.id + timestamp);
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

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setImageUploadLoading(true);
      const response = await fetch("images/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (result.error) {
        throw new Error(result.error);
      } else {
        const imageUrl = result.url;
        setImageUrl(imageUrl);
        setImageUploadLoading(false);
      }
    } catch (error) {
      console.error("Error uploading image: ", error);
    }
  };

  const clearForm = () => {
    setNewEntryTitle("");
    setNewEntryContent("");
    setNewEntryTags("");
    setEditedEntryTuple([null, null]);
    setIsEditing(false);
    setImageUrl(null);
    const textArea = textAreaRef.current;
    if (textArea) {
      textArea.style.height = "auto";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 px-4">
      <h1 className="text-2xl font-bold mt-6 -mb-5">
        {username ? `entries by ${username}` : "my entries"}
      </h1>
      <h3>
        {streak > 0 ? "🔥 " : ""}
        {streak} day streak
        {streak > 0 ? " 🔥" : ""}
      </h3>
      <form
        onSubmit={isEditing ? handleEditedEntrySubmit : handleNewEntrySubmit}
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
          className="px-4 py-2 border rounded w-full md:w-2/3 mb-4"
        />
        <div className="text-center mb-5">
          {!imageUrl && (
            <button
              type="button"
              className="underline text-blue-600 hover:text-blue-800 focus:outline-none focus:shadow-outline"
              onClick={() => document.getElementById("fileInput")?.click()}
              disabled={imageUrl !== null}
            >
              {imageUploadLoading ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                "upload image (optional)"
              )}
            </button>
          )}
          <input
            type="file"
            id="fileInput"
            accept="image/png, image/jpg, image/jpeg, .heic"
            onChange={handleImageUpload}
            className="hidden"
            disabled={imageUrl !== null}
          />
          {imageUrl && (
            <a
              href={imageUrl}
              className="underline text-gray-600 hover:text-gray-800"
            >
              image uploaded!
            </a>
          )}
        </div>
        <div className="justify-center">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-800 mr-4"
          >
            {isEditing ? "save entry" : "add entry"}
          </button>
          {!isEditing ? (
            <button
              type="button"
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-800"
              onClick={handlePromptGeneration}
            >
              {isPromptLoading ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                "✨ help me think ✨"
              )}
            </button>
          ) : (
            <button
              type="button"
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-800"
              onClick={clearForm}
            >
              undo
            </button>
          )}
        </div>
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
            {entry.image_url && (
              <Image
                src={entry.image_url}
                alt={entry.title ?? "image failed to load"}
                width={500}
                height={500}
                className="w-full h-auto mb-4 mt-4"
              />
            )}
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
                  await handleEditEntry(entry.id);
                }}
                className="text-blue-400 hover:text-blue-600 text-sm pr-2"
              >
                edit
              </button>
              <button
                onClick={async () => {
                  await handleShareEntry(entry.id, entry.created_at);
                }}
                className="text-blue-600 hover:text-blue-800 text-sm pr-2"
              >
                share
              </button>
              <button
                onClick={async () => {
                  await handleDeleteEntry(entry.id, entry.image_url);
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
}
