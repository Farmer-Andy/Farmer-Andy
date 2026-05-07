import { AIChatAgent } from "agents";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText, type Message } from "ai";

export interface Env {
  OPENROUTER_API_KEY: string;
  CLOUDY_AGENT: DurableObjectNamespace;
}

const SYSTEM_PROMPT = `You are Cloudy, a helpful AI assistant powered by DeepSeek running on Cloudflare Workers.
You are knowledgeable, concise, and friendly.`;

export class CloudyAgent extends AIChatAgent<Env> {
  async onChatMessage(onFinish: (messages: Message[]) => void) {
    const openrouter = createOpenRouter({
      apiKey: this.env.OPENROUTER_API_KEY,
    });

    const result = streamText({
      model: openrouter("deepseek/deepseek-v4-flash"),
      messages: this.messages,
      system: SYSTEM_PROMPT,
      onFinish: async ({ responseMessages }) => {
        onFinish(responseMessages);
      },
    });

    return result.toDataStreamResponse();
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Route: /agents/cloudy/<agent-id>  (WebSocket or HTTP streaming)
    const agentMatch = url.pathname.match(/^\/agents\/cloudy\/([^/]+)/);
    if (agentMatch) {
      const agentId = agentMatch[1];
      const id = env.CLOUDY_AGENT.idFromName(agentId);
      const stub = env.CLOUDY_AGENT.get(id);
      return stub.fetch(request);
    }

    // Health check / info endpoint
    if (url.pathname === "/" || url.pathname === "") {
      return Response.json({
        name: "cloudy-sdk-test",
        status: "ok",
        usage: {
          chat: "POST /agents/cloudy/{agent-id}  — start or continue a conversation",
          websocket: "WS  /agents/cloudy/{agent-id}  — real-time streaming chat",
          note: "Use any string as the agent-id to namespace separate conversations",
        },
      });
    }

    return new Response("Not found", { status: 404 });
  },
};
