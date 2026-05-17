"use client";

import * as React from "react";
import {
  Bot,
  Send,
  User,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Trash2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  mockTodayTasks,
  mockUpcoming,
  taskTypeLabels,
} from "@/lib/mock-data";
import {
  sortByDeadlineAndPriority,
  getDepartureAdvice,
  detectConflicts,
} from "@/lib/planner";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  suggestedAction?: {
    type: "add_task" | "modify_plan" | "reschedule" | "info";
    description: string;
    status: "pending" | "accepted" | "rejected";
  };
}

const promptChips = [
  "Bugün ne yapmalıyım?",
  "Yarınki sınavım için plan yap",
  "Planım bozuldu, yeniden düzenle",
  "En önemli görevlerimi göster",
];

/** Build a context summary from current planner data to send to the API */
function buildContextSummary(): string {
  const sorted = sortByDeadlineAndPriority([...mockTodayTasks, ...mockUpcoming]);
  const conflicts = detectConflicts(mockTodayTasks);
  const todaySummary = mockTodayTasks
    .map((t) => {
      const advice = getDepartureAdvice(t);
      return `- ${t.title} (${taskTypeLabels[t.type]}, ${t.priority})${
        t.startTime ? ` ${t.startTime}–${t.endTime}` : ""
      }${t.location ? `, ${t.location}` : ""}${
        advice ? ` [${advice}]` : ""
      }`;
    })
    .join("\n");

  const conflictSummary =
    conflicts.length > 0
      ? `Çakışmalar: ${conflicts
          .map((c) => `${c.taskA.title} ↔ ${c.taskB.title} (${c.overlapMinutes} dk)`)
          .join(", ")}`
      : "Çakışma yok.";

  return `Bugünkü görevler:\n${todaySummary}\n\n${conflictSummary}\n\nYaklaşan: ${sorted
    .slice(0, 3)
    .map((t) => t.title)
    .join(", ")}`;
}

export default function ChatPage() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  async function sendMessage(text: string) {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const contextSummary = buildContextSummary();
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userMessage: text,
          userContextSummary: contextSummary,
        }),
      });

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: data.assistantResponse,
        suggestedAction:
          data.suggestedActions?.length > 0
            ? {
                type: data.suggestedActions[0].type ?? "info",
                description: data.suggestedActions[0].description ?? "",
                status: "pending",
              }
            : undefined,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content:
          "Yanıt alırken bir sorun oluştu. Lütfen tekrar dene. İnternet bağlantını kontrol edebilirsin.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleActionResponse(msgId: string, accepted: boolean) {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === msgId && msg.suggestedAction
          ? {
              ...msg,
              suggestedAction: {
                ...msg.suggestedAction,
                status: accepted ? "accepted" : "rejected",
              },
            }
          : msg
      )
    );
  }

  function clearChat() {
    setMessages([]);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col md:h-[calc(100vh-6rem)]">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">YZ Asistan</h1>
          <p className="mt-1 text-muted-foreground">
            Planınla ilgili doğal dilde soru sor ve öneriler al.
          </p>
        </div>
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-muted-foreground"
            onClick={clearChat}
            aria-label="Sohbeti temizle"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Temizle
          </Button>
        )}
      </div>

      {/* Warning */}
      <div
        className="mt-4 flex items-start gap-2 rounded-lg border border-chart-4/30 bg-chart-4/5 p-3 text-xs text-muted-foreground"
        role="alert"
      >
        <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-chart-4" />
        <p>
          YZ önerileri yalnızca rehber niteliğindedir. Planında değişiklik
          yapmadan önce senin onayını alır. Hiçbir değişiklik izinsiz
          uygulanmaz.
        </p>
      </div>

      {/* Messages area */}
      <div
        ref={scrollRef}
        className="mt-4 flex-1 overflow-y-auto rounded-lg border border-border/50 bg-muted/20 p-4"
        id="chat-messages"
        role="log"
        aria-label="Sohbet mesajları"
        aria-live="polite"
      >
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Bot className="h-8 w-8" />
            </div>
            <div className="text-center">
              <p className="font-medium">
                Merhaba! Ben Zaman Pusulası asistanın 👋
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Planınla ilgili sorularını yanıtlayabilirim. Aşağıdaki
                önerilerden birini dene veya kendi sorunu yaz.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Sparkles className="h-4 w-4" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] space-y-2 ${
                    msg.role === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border/50 text-card-foreground"
                    }`}
                  >
                    {msg.content}
                  </div>

                  {/* Action card */}
                  {msg.suggestedAction && (
                    <Card className="border-primary/20 bg-primary/5 mt-2 max-w-sm">
                      <CardContent className="p-3">
                        <div className="flex items-start gap-2">
                          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <div className="flex-1 space-y-2">
                            <p className="text-xs font-medium">
                              Önerilen Değişiklik:
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {msg.suggestedAction.description}
                            </p>
                            {msg.suggestedAction.status === "pending" ? (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  className="gap-1 h-7 text-xs"
                                  onClick={() =>
                                    handleActionResponse(msg.id, true)
                                  }
                                >
                                  <CheckCircle2 className="h-3 w-3" />
                                  Onayla
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-1 h-7 text-xs"
                                  onClick={() =>
                                    handleActionResponse(msg.id, false)
                                  }
                                >
                                  <XCircle className="h-3 w-3" />
                                  Reddet
                                </Button>
                              </div>
                            ) : (
                              <Badge
                                variant={
                                  msg.suggestedAction.status === "accepted"
                                    ? "default"
                                    : "secondary"
                                }
                                className="text-[10px]"
                              >
                                {msg.suggestedAction.status === "accepted"
                                  ? "✓ Onaylandı"
                                  : "✗ Reddedildi"}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3" aria-label="Yanıt bekleniyor">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="inline-block rounded-2xl border border-border/50 bg-card px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-primary/40 [animation-delay:0ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-primary/40 [animation-delay:150ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-primary/40 [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Prompt chips */}
      {messages.length === 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {promptChips.map((chip) => (
            <Button
              key={chip}
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => sendMessage(chip)}
            >
              {chip}
            </Button>
          ))}
        </div>
      )}

      <Separator className="my-3" />

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="flex shrink-0 gap-2"
        id="chat-input-form"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Sorunuzu yazın..."
          disabled={isLoading}
          className="flex-1"
          id="chat-input"
          aria-label="Mesaj girişi"
        />
        <Button
          type="submit"
          size="icon"
          disabled={isLoading || !input.trim()}
          id="chat-send-btn"
          aria-label="Gönder"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
