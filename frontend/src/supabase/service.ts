import { type User, type Session, type AuthError } from "@supabase/supabase-js";
import axios from "axios";
import {
  NewEntryResponse,
  EntriesResponse,
  EntryResponse,
  SharedEntryResponse,
  UserResponse,
} from "../types";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

interface AuthResponse {
  user?: User | null;
  session?: Session | null;
  error?: AuthError | Error | null;
}

export async function signUp(
  email: string,
  password: string,
  username: string
): Promise<AuthResponse> {
  try {
    const response = await axios.post(`${BACKEND_URL}/signup`, {
      email,
      password,
      username,
    });
    return response.data;
  } catch (error) {
    return { error: error as Error };
  }
}

export async function login(
  email: string | undefined,
  username: string | undefined,
  password: string
): Promise<AuthResponse> {
  try {
    const response = await axios.post(`${BACKEND_URL}/login`, {
      email,
      username,
      password,
    });
    return response.data;
  } catch (error) {
    return { error: error as Error };
  }
}

export async function logout() {
  try {
    const response = await axios.post(`${BACKEND_URL}/logout`);
    return response.data;
  } catch (error) {
    return { error: error as Error };
  }
}

export async function addNewEntry(
  userId: string,
  title?: string,
  content?: string,
  tags?: string[]
): Promise<NewEntryResponse | Error> {
  try {
    const response = await axios.post(`${BACKEND_URL}/entries`, {
      userId,
      title,
      content,
      tags,
    });
    if (response.data.error) {
      return response.data.error as Error;
    }
    return response.data.data;
  } catch (e) {
    return e as Error;
  }
}

export async function getAllEntries(
  userId: string
): Promise<EntriesResponse | Error> {
  try {
    const response = await axios.get(`${BACKEND_URL}/entries/${userId}`);
    if (response.data.error) {
      return response.data.error as Error;
    }
    console.log("response.data.data: ", response.data.data);
    return response.data.data;
  } catch (e) {
    return e as Error;
  }
}

export async function getEntry(
  entryId: number
): Promise<EntryResponse | Error> {
  try {
    const response = await axios.get(`${BACKEND_URL}/entry/${entryId}`);
    if (response.data.error) {
      return response.data.error as Error;
    }
    return response.data.data;
  } catch (e) {
    return e as Error;
  }
}

export async function deleteEntry(
  entryId: number
): Promise<EntryResponse | Error> {
  try {
    const response = await axios.delete(`${BACKEND_URL}/entry/${entryId}`);
    if (response.data.error) {
      return response.data.error as Error;
    }
    return response.data.data;
  } catch (e) {
    return e as Error;
  }
}

export async function getUser(userId: string): Promise<UserResponse | Error> {
  try {
    const response = await axios.get(`${BACKEND_URL}/user/${userId}`);
    if (response.data.error) {
      return response.data.error as Error;
    }
    return response.data.data;
  } catch (e) {
    return e as Error;
  }
}

export async function makeEntryPublic(
  entryId: number
): Promise<EntryResponse | Error> {
  try {
    const response = await axios.post(`${BACKEND_URL}/entry/public/${entryId}`);
    if (response.data.error) {
      return response.data.error as Error;
    }
    return response.data.data;
  } catch (e) {
    return e as Error;
  }
}

export async function associateEntryWithSharedUid(
  sharingUid: string,
  entryId: number
): Promise<SharedEntryResponse | Error> {
  try {
    const response = await axios.post(`${BACKEND_URL}/entry/share`, {
      sharingUid,
      entryId,
    });
    if (response.data.error) {
      return response.data.error as Error;
    }
    return response.data.data;
  } catch (e) {
    return e as Error;
  }
}

export async function getEntryUsingSharedUid(
  sharingUid: string
): Promise<EntryResponse | Error> {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/entry/shared/${sharingUid}`
    );
    if (response.data.error) {
      return response.data.error as Error;
    }
    return response.data.data;
  } catch (e) {
    return e as Error;
  }
}

export async function emailExists(email: string): Promise<boolean> {
  try {
    const response = await axios.get(`${BACKEND_URL}/email-exists/${email}`);
    if (response.data.error) {
      console.log("Error in email check: ", response);
      return false;
    }
    return response.data.exists as boolean;
  } catch (e) {
    return false;
  }
}

export async function usernameExists(username: string): Promise<boolean> {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/username-exists/${username}`
    );
    if (response.data.error) {
      console.log("Error in username check: ", response);
      return false;
    }
    return response.data.exists as boolean;
  } catch (e) {
    return false;
  }
}

export async function getUsernameFromSharedAuthId(
  userAuthId?: string | null
): Promise<string | Error> {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/username/${userAuthId ?? ""}`
    );
    if (response.data.error) {
      return response.data.error as Error;
    }
    return response.data.username as string;
  } catch (e) {
    return e as Error;
  }
}

export async function generatePrompt(): Promise<string | Error> {
  try {
    const response = await axios.get(`${BACKEND_URL}/prompt`);
    return response.data as string;
  } catch (e) {
    return e as Error;
  }
}
