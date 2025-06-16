async function handler({ prompt }) {
  if (!prompt) {
    return { error: "Missing prompt" };
  }

  const OPENROUTER_API_KEY = "YOUR-OPENROUTER-API-KEY"; // Replace with your actual OpenRouter API key

  const enhancedPrompt = `Create a detailed and creative headcanon based on the following prompt: ${prompt}. Make it engaging, imaginative, and consistent with the source material's tone. Keep the response between 100-300 words.`;

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://create.xyz", // Replace with your actual domain
          "X-Title": "Techblizr Headcanon Generator",
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: enhancedPrompt,
            },
          ],
          temperature: 0.8,
          max_tokens: 500,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("API request failed");
    }

    const data = await response.json();
    const headcanon = data.choices[0].message.content.trim();

    return { headcanon };
  } catch (error) {
    console.error("Error generating headcanon:", error);
    return { error: "Failed to generate headcanon" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}