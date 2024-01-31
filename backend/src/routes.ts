// src/routes.ts
import express, { Request, Response } from "express";
import {
  signUp,
  login,
  logout,
  addNewEntry,
  getAllEntries,
  getEntry,
  deleteEntry,
  getUser,
  makeEntryPublic,
  associateEntryWithSharedUid,
  getEntryUsingSharedUid,
  emailExists,
  usernameExists,
  getUsernameFromSharedAuthId,
} from "./supabase";
import { generatePrompt } from "./prompt_gen/generatePrompt";

const router = express.Router();

// SignUp Route
router.post("/signup", async (req: Request, res: Response) => {
  const { email, password, username } = req.body;
  const response = await signUp(email, password, username);
  res.json(response);
});

// Login Route
router.post("/login", async (req: Request, res: Response) => {
  const { email, username, password } = req.body;
  const response = await login(email, username, password);
  res.json(response);
});

// Logout Route
router.post("/logout", async (req: Request, res: Response) => {
  const response = await logout();
  res.json(response);
});

// Add New Entry Route
router.post("/entries", async (req: Request, res: Response) => {
  const { userId, title, content, tags } = req.body;
  const response = await addNewEntry(userId, title, content, tags);
  res.json(response);
});

// Get All Entries Route
router.get("/entries/:userId", async (req: Request, res: Response) => {
  const { userId } = req.params;
  const response = await getAllEntries(userId);
  res.json(response);
});

// Get Single Entry Route
router.get("/entry/:entryId", async (req: Request, res: Response) => {
  const { entryId } = req.params;
  const response = await getEntry(parseInt(entryId));
  res.json(response);
});

// Delete Entry Route
router.delete("/entry/:entryId", async (req: Request, res: Response) => {
  const { entryId } = req.params;
  const response = await deleteEntry(parseInt(entryId));
  res.json(response);
});

// Get User Route
router.get("/user/:userId", async (req: Request, res: Response) => {
  const { userId } = req.params;
  const response = await getUser(userId);
  res.json(response);
});

// Make Entry Public Route
router.post("/entry/public/:entryId", async (req: Request, res: Response) => {
  const { entryId } = req.params;
  const response = await makeEntryPublic(parseInt(entryId));
  res.json(response);
});

// Associate Entry with Shared UID Route
router.post("/entry/share", async (req: Request, res: Response) => {
  const { sharingUid, entryId } = req.body;
  const response = await associateEntryWithSharedUid(sharingUid, entryId);
  res.json(response);
});

// Get Entry Using Shared UID Route
router.get("/entry/shared/:sharingUid", async (req: Request, res: Response) => {
  const { sharingUid } = req.params;
  const response = await getEntryUsingSharedUid(sharingUid);
  res.json(response);
});

// Email Exists Route
router.get("/email-exists/:email", async (req: Request, res: Response) => {
  const { email } = req.params;
  const exists = await emailExists(email);
  res.json({ exists });
});

// Username Exists Route
router.get(
  "/username-exists/:username",
  async (req: Request, res: Response) => {
    const { username } = req.params;
    const exists = await usernameExists(username);
    res.json({ exists });
  }
);

// Get Username from Shared Auth ID Route
router.get("/username/:sharedAuthId", async (req: Request, res: Response) => {
  const { sharedAuthId } = req.params;
  const response = await getUsernameFromSharedAuthId(sharedAuthId);
  res.json(response);
});

// Generate Prompt Route
router.get("/prompt", async (req: Request, res: Response) => {
  const prompt = await generatePrompt();
  res.json(prompt);
});

export default router;
