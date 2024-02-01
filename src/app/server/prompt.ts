"use server";

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
  "Create a journaling prompt that encourages reflection on a lesson learned from a mistake made this week. Keep the prompt concise and limited to two sentences.",
  "Generate a prompt that helps explore feelings about a recent change in life, focusing on the emotional journey. Ensure the prompt is brief, ideally two sentences.",
  "Craft a journaling prompt that invites contemplation on a moment of unexpected joy experienced recently. The prompt should be succinct, no more than two sentences.",
  "Develop a prompt for journaling about a conversation that had a significant impact, focusing on the insights gained. Limit the prompt to two sentences.",
  "Formulate a journaling prompt that encourages reflection on a goal that feels out of reach, exploring underlying fears or obstacles. Keep it to two sentences.",
  "Invent a prompt that guides reflection on a cherished memory with someone no longer in your life. The prompt should be brief and evocative, limited to two sentences.",
  "Compose a journaling prompt that sparks exploration of how a favorite book or movie has influenced personal beliefs or actions. Ensure the prompt is concise, within two sentences.",
  "Design a prompt that encourages journaling about a place that feels like home and why it holds that special significance. Keep the prompt to two sentences.",
  "Imagine a prompt that leads to journaling about a recent act of kindness, either given or received. Limit the prompt to two sentences for clarity.",
  "Conjure a prompt that delves into the complexities of a current world event and its personal impact. The prompt should be concise, no more than two sentences.",
  "Suggest a journaling prompt that reflects on a dream or ambition that has evolved over time. Keep the prompt succinct, ideally two sentences.",
  "Offer a prompt that encourages writing about a piece of advice that has profoundly shaped your life. Ensure the prompt is brief, limited to two sentences.",
  "Propose a journaling prompt that explores the significance of a recent challenge and the resilience it fostered. The prompt should be to the point, within two sentences.",
  "Create a prompt that encourages reflection on a moment this week that sparked gratitude. Limit the prompt to two sentences.",
  "Generate a journaling prompt that explores the theme of personal growth or transformation experienced lately. Keep it concise, no more than two sentences.",
  "Craft a prompt that invites introspection on a hobby or activity that brings joy and why. The prompt should be succinct, limited to two sentences.",
  "Develop a prompt for journaling about an aspiration and the steps needed to achieve it. Ensure the prompt is clear and concise, within two sentences.",
  "Formulate a journaling prompt that encourages exploration of a fear and how it can be overcome. Keep the prompt to two sentences.",
  "Invent a prompt that guides reflection on the impact of technology on daily life. The prompt should be brief, no more than two sentences.",
  "Compose a journaling prompt that sparks thoughts on the balance between work and personal life. Ensure the prompt is concise, limited to two sentences.",
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
    model: process.env.LLM_KEY ?? "mistralai/Mistral-7B-Instruct-v0.2",
    max_tokens: 100,
    temperature: 1.6,
    top_p: 0.8,
    seed: Math.floor(Math.random() * 1001),
    frequency_penalty: 1.2,
    presence_penalty: 1.0,
  };

  try {
    const response = await fetch(
      "https://api.together.xyz/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
        },
        body: JSON.stringify(requestData),
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = (await response.json()) as ChatCompletionResponse;
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching chat completion:", error);
  }
};
