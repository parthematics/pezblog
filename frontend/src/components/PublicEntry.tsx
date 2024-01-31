import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getEntryUsingSharedUid,
  getUsernameFromSharedAuthId,
} from "../supabase";
import { type BlogEntry } from "../types";

export const PublicEntry: React.FC = () => {
  const { sharingUid } = useParams();
  const [entry, setEntry] = useState<BlogEntry | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntry = async () => {
      if (sharingUid) {
        const sharedEntryData = await getEntryUsingSharedUid(sharingUid);
        if (sharedEntryData instanceof Error) {
          console.error("Error fetching entry: ", sharedEntryData);
          return <div>requested entry does not exist.</div>;
        } else if (sharedEntryData?.is_private === true) {
          return <div>you do not have access to this entry.</div>;
        } else {
          const usernameData = await getUsernameFromSharedAuthId(
            sharedEntryData?.user_auth_id
          );

          if (usernameData instanceof Error) {
            console.error("Error fetching user: ", usernameData);
          } else {
            setUsername(usernameData);
          }
          setEntry(sharedEntryData);
        }
      }
    };
    fetchEntry();
  }, [sharingUid]);

  if (!entry) {
    return (
      <div className="flex justify-center items-center h-screen">
        requested entry may not exist, or you may not have access to it!
      </div>
    );
  }

  return (
    <div className="flex justify-center p-4">
      <div className="w-full md:w-5/12 my-4 pb-3 border-b justify-center">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-lg">{entry.title}</h2>
          <span className="text-sm text-gray-600">
            {new Date(entry.created_at).toLocaleDateString() + " "}
            {new Date(entry.created_at).toLocaleTimeString()}
          </span>
        </div>
        {username ? (
          <h4 className="text-sm text-gray-600 mb-4">by {username}</h4>
        ) : null}
        <p className="mb-2 flex-grow whitespace-pre-line">{entry.content}</p>
        <div className="flex justify-start">
          <div className="flex-grow">
            {entry.tags &&
              entry.tags.map((tag, index) => (
                <button
                  onClick={() => {
                    return false;
                  }}
                  key={index}
                  className="bg-blue-100 text-gray-900 text-xs px-1.5 py-0.5 rounded mr-1"
                >
                  {tag}
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicEntry;
