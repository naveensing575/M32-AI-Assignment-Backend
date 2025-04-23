import fetch from "node-fetch";

const OPENROUTER_API_KEY = process.env.OPEN_ROUTER_AI_KEY!;
const BASE_URL = "https://openrouter.ai/api/v1/chat/completions";

interface ChatCompletionRequest {
  prompt: string;
  model?: string;
}

interface ChatCompletionResponse {
  choices: { message: { content: string } }[];
  error?: { message: string };
}

export const generateWithLLM = async ({
  prompt,
  model = "mistralai/mistral-7b-instruct",
}: ChatCompletionRequest): Promise<string> => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:3000",
      "X-Title": "m32-ai-assistant",
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are an AI assistant for educators. Generate educational content clearly.",
        },
        { role: "user", content: prompt },
      ],
    }),
  });

  const data = (await response.json()) as ChatCompletionResponse;

  if (!response.ok || !data.choices?.length) {
    throw new Error(data.error?.message ?? "LLM generation failed");
  }

  return data.choices[0].message.content;
};
