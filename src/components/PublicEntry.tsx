import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BlogEntry, supabase, getEntryUsingSharedUid } from "../supabase";

export const PublicEntry: React.FC = () => {
  const { sharingUid } = useParams();
  const [entry, setEntry] = useState<BlogEntry | null>(null);
  const [user, setUser] = useState<{ username: string | null } | null>(null);

  useEffect(() => {
    const fetchEntry = async () => {
      if (sharingUid) {
        const { data, error } = await getEntryUsingSharedUid(sharingUid);
        if (error) {
          console.error("Error fetching entry: ", error);
          return <div>requested entry does not exist.</div>;
        } else if (data?.is_private === true) {
          return <div>you do not have access to this entry.</div>;
        } else {
          const { data: user, error } = await supabase
            .from("users")
            .select("username")
            .eq("auth_id", data?.user_auth_id ?? "")
            .single();

          if (error) {
            console.error("Error fetching user: ", error);
          } else {
            setUser(user);
          }
          setEntry(data);
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
        {user ? (
          <h4 className="text-sm text-gray-600 mb-4">by {user.username}</h4>
        ) : null}
        <p className="mb-1 flex-grow whitespace-pre-line">{entry.content}</p>
      </div>
    </div>
  );
};

export default PublicEntry;
