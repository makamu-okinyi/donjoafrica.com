import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { auth } from "./auth";

const http = httpRouter();
auth.addHttpRoutes(http);

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...cors } });

http.route({ path: "/notify-consultation", method: "OPTIONS", handler: httpAction(async () => new Response(null, { headers: cors })) });

http.route({
  path: "/notify-consultation",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const { name, email, brief } = await request.json();
      if (!name || !email || !brief) return json({ error: "Missing required fields" }, 400);
      await ctx.runMutation(internal.consultations.save, { name, email, brief });
      const whatsappUrl = `https://wa.me/254113881734?text=${encodeURIComponent(`Hi, I'm ${name} (${email}). ${brief}`)}`;
      return json({ success: true, whatsappUrl });
    } catch (err) {
      const rate = err instanceof Error && err.message.includes("RATE_LIMITED");
      return json({ error: rate ? "Too many requests. Please try again later." : "Internal server error" }, rate ? 429 : 500);
    }
  }),
});

export default http;
