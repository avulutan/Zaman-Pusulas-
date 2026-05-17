import { NextRequest, NextResponse } from "next/server";

/**
 * Zaman Pusulası — LLM Chat API Route
 *
 * Secure backend endpoint for chatbot LLM integration.
 * - API key read from environment variables only
 * - Safe system prompt for student planning context
 * - Sends only minimal required user context
 * - Returns concise Turkish responses
 * - Never mutates user data directly
 * - Returns suggested actions requiring user confirmation
 */

// ─── Types ──────────────────────────────────────────────────────────

interface ChatRequest {
  userMessage: string;
  userContextSummary?: string;
}

interface SuggestedAction {
  type: "add_task" | "modify_plan" | "reschedule" | "info";
  description: string;
  data?: Record<string, unknown>;
}

interface ChatResponse {
  assistantResponse: string;
  suggestedActions: SuggestedAction[];
  error?: string;
}

// ─── System Prompt ──────────────────────────────────────────────────

const SYSTEM_PROMPT = `Sen "Zaman Pusulası" adlı öğrenci planlama uygulamasının yapay zeka asistanısın.

Kurallar:
- Türkçe yanıt ver, kısa ve net ol (en fazla 3-4 cümle).
- Öğrenciyi destekleyici, motive edici ve saygılı bir ton kullan.
- Suçlayıcı, utandırıcı veya baskılayan dil kullanma.
- Psikolojik tanı koyma, akademik başarı garantisi verme.
- Kullanıcının planında değişiklik öneriyorsan, bunu "suggestedAction" olarak döndür.
- Kesinlikle doğrudan veri değiştirme — tüm değişiklikler kullanıcı onayı gerektirir.
- Görev ekleme, silme veya değiştirme önerisini JSON formatında suggestedActions alanında belirt.
- Kullanıcının gönderdiği bağlam özetini kullanarak kişiselleştirilmiş öneriler sun.
- Gereksiz uzun cevaplar üretme.`;

// ─── Fallback Response ──────────────────────────────────────────────

const FALLBACK_RESPONSE: ChatResponse = {
  assistantResponse:
    "Şu an yanıt oluşturamıyorum, ancak planını kontrol etmek için görevler sayfasına göz atabilirsin. Birazdan tekrar dene. 🙏",
  suggestedActions: [],
};

// ─── Route Handler ──────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.LLM_API_KEY;
    const model = process.env.LLM_MODEL || "gemini-2.0-flash";

    // Check if API key is configured
    if (!apiKey) {
      // Return a mock response if not configured (development mode)
      return NextResponse.json<ChatResponse>({
        assistantResponse:
          "YZ asistanı henüz yapılandırılmadı. LLM_API_KEY ortam değişkenini ayarlayın. Şu an mock modda çalışıyorum.",
        suggestedActions: [],
      });
    }

    // Parse request body
    const body: ChatRequest = await request.json();

    if (!body.userMessage || body.userMessage.trim().length === 0) {
      return NextResponse.json<ChatResponse>(
        {
          assistantResponse: "Lütfen bir mesaj girin.",
          suggestedActions: [],
          error: "empty_message",
        },
        { status: 400 }
      );
    }

    // Build messages for the LLM
    const messages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      ...(body.userContextSummary
        ? [
            {
              role: "system" as const,
              content: `Kullanıcı bağlam özeti:\n${body.userContextSummary}`,
            },
          ]
        : []),
      { role: "user" as const, content: body.userMessage },
    ];

    // Call LLM API (Gemini-style endpoint)
    // Note: Adapt this to your specific LLM provider (OpenAI, Gemini, etc.)
    const llmResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: messages.map((m) => ({
            role: m.role === "system" ? "user" : m.role,
            parts: [{ text: m.content }],
          })),
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          },
        }),
      }
    );

    if (!llmResponse.ok) {
      console.error("LLM API error:", llmResponse.status, await llmResponse.text());
      return NextResponse.json<ChatResponse>(FALLBACK_RESPONSE);
    }

    const llmData = await llmResponse.json();
    const responseText =
      llmData?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    if (!responseText) {
      return NextResponse.json<ChatResponse>(FALLBACK_RESPONSE);
    }

    // Try to extract suggested actions from the response
    // The LLM might include JSON blocks for actions
    let suggestedActions: SuggestedAction[] = [];
    let cleanResponse = responseText;

    const jsonMatch = responseText.match(/```json\n?([\s\S]*?)```/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        if (Array.isArray(parsed)) {
          suggestedActions = parsed;
        } else if (parsed.suggestedActions) {
          suggestedActions = parsed.suggestedActions;
        }
        cleanResponse = responseText.replace(/```json\n?[\s\S]*?```/, "").trim();
      } catch {
        // JSON parsing failed — treat entire response as text
      }
    }

    return NextResponse.json<ChatResponse>({
      assistantResponse: cleanResponse,
      suggestedActions,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json<ChatResponse>(FALLBACK_RESPONSE, { status: 500 });
  }
}
