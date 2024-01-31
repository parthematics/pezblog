import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

interface ChatMessage {
  role: string;
  content: string;
}

interface ChatCompletionRequest {
  messages: ChatMessage[];
  model: string;
  max_tokens: number;
  temperature: number;
  top_p: number;
  seed: number;
  frequency_penalty: number;
  presence_penalty: number;
}

interface ChatCompletionResponse {
  choices: { message: { content: string } }[];
}

const prompts = [
  "Generate a journaling prompt for deep self-reflection about my personal experiences. Output just the prompt and keep it two sentences at most.",
  "Generate an insightful journaling prompt focusing on my emotions and relationships with others. Output just the prompt and keep it two sentences at most.",
  "Generate a new journaling prompt to help me reflect and explore my thoughts about today. Output just the prompt and keep it two sentences at most.",
  "Generate a creative journaling prompt to help me recount the events of today, no matter how mundane or interesting they may be. Output just the prompt and keep it two sentences at most.",
];

export const generatePrompt = async () => {
  const chosenPrompt = prompts[Math.floor(Math.random() * prompts.length)];
  const requestData: ChatCompletionRequest = {
    messages: [
      {
        role: "system",
        content:
          "You are an AI assistant that assists humans with journaling by coming up with short, easy to understand, yet thought-provoking prompts",
      },
      {
        role: "user",
        content: chosenPrompt,
      },
    ],
    model: process.env.MODEL_TO_USE ?? "mistralai/Mistral-7B-Instruct-v0.2",
    max_tokens: 100,
    temperature: 1.6,
    top_p: 0.8,
    seed: Math.floor(Math.random() * 1001),
    frequency_penalty: 1.2,
    presence_penalty: 1.0,
  };

  try {
    const response = await axios.post<ChatCompletionResponse>(
      "https://api.together.xyz/v1/chat/completions",
      requestData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
        },
      }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching chat completion:", error);
  }
};
