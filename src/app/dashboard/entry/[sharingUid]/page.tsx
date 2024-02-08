"use server";

import React from "react";
import { getEntryUsingSharedUid, getUsernameFromAuthId } from "@/app/server";
import { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";

type Props = {
  params: { sharingUid: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { data: entryData } = await getEntryUsingSharedUid(params.sharingUid);
  if (entryData) {
    const { data: user, error: userError } = await getUsernameFromAuthId(
      entryData?.user_auth_id ?? ""
    );
    if (user?.username) {
      return {
        openGraph: {
          title: `pezblog: "${entryData.title}" by ${user.username}`,
          description: entryData.content ?? "",
          type: "article",
          publishedTime: entryData.created_at,
          authors: [user.username],
          tags: entryData.tags,
          ...(entryData.image_url
            ? {
                images: [{ url: entryData.image_url, width: 800, height: 600 }],
              }
            : { images: "https://pezblog.vercel.app/logo192.png" }),
        },
      };
    }
    return {
      title: entryData.title ?? "pezblog: the blog you've always missed",
      description:
        entryData.content ??
        "get started using pezblog today and keep track of what matters.",
    };
  } else {
    return {
      title: "pezblog: the blog you've always missed",
      description:
        "get started using pezblog today and keep track of what matters.",
    };
  }
}

const PublicEntry = async ({ params }: Props) => {
  const { data: entryData, error: entryError } = await getEntryUsingSharedUid(
    params.sharingUid
  );
  if (entryError) {
    console.error("Error fetching entry: ", entryError);
    return <div>requested entry does not exist.</div>;
  } else if (entryData?.is_private === true) {
    return <div>you do not have access to this entry.</div>;
  } else {
    const { data: user, error: userError } = await getUsernameFromAuthId(
      entryData?.user_auth_id ?? ""
    );
    if (userError) {
      console.error("Error fetching user: ", userError);
      return <div>error fetching user who this entry belongs to.</div>;
    }
    if (!entryData) {
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
            <h2 className="font-bold text-lg">{entryData.title}</h2>
            <span className="text-sm text-gray-600">
              {new Date(entryData.created_at).toLocaleDateString() + " "}
              {new Date(entryData.created_at).toLocaleTimeString()}
            </span>
          </div>
          {user ? (
            <h4 className="text-sm text-gray-600 mb-4">by {user.username}</h4>
          ) : null}
          <p className="mb-2 flex-grow whitespace-pre-line">
            {entryData.content}
          </p>
          {entryData.image_url && (
            <Image
              src={entryData.image_url}
              alt={entryData.title ?? "image failed to load"}
              width={500}
              height={500}
              className="w-full h-auto mb-4 mt-4"
              priority
            />
          )}
          <div className="flex justify-start">
            <div className="flex-grow">
              {entryData.tags &&
                entryData.tags.map((tag, index) => (
                  <button
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
  }
};

export default PublicEntry;
