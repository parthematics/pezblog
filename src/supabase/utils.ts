import { BlogEntry } from "./types";

export function calculateStreak(entries: BlogEntry[]) {
  if (entries.length === 0) {
    return 0;
  }
  // Assuming entries are sorted in descending order of createdAt
  let latestEntryDate = new Date(entries[0].created_at);
  latestEntryDate.setHours(0, 0, 0, 0);

  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Normalize current date to start of the day

  let streak = latestEntryDate.getTime() === currentDate.getTime() ? 1 : 0;

  for (let i = 0; i < entries.length; i++) {
    let entryDate = new Date(entries[i].created_at);
    entryDate.setHours(0, 0, 0, 0); // Normalize entry date

    // Calculate the difference in days
    const diffInTime = currentDate.getTime() - entryDate.getTime();
    const diffInDays = diffInTime / (1000 * 3600 * 24);
    console.log(entries[i].title, diffInDays, streak);

    if (diffInDays === 1) {
      // Entry was made yesterday, increment streak
      streak++;
      currentDate = entryDate; // Set currentDate to entryDate for next iteration
    } else if (diffInDays === 0) {
      // Entry is for today, check next entry
      continue;
    } else {
      // Gap found, streak ends
      break;
    }
  }

  return streak;
}

export const copyToClipboard = (text: string): Promise<void> => {
  // new Clipboard API
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }
  // fallback for older browsers
  else {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    // Avoid scrolling to bottom
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    return new Promise((resolve, reject) => {
      document.execCommand("copy") ? resolve() : reject();
      textArea.remove();
    });
  }
};
