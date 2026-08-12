import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/notify-consultation",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }),
});

http.route({
  path: "/notify-consultation",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const { name, email, brief } = await request.json();

      if (!name || !email || !brief) {
        return new Response(JSON.stringify({ error: "Missing required fields" }), {
          status: 400,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
      }

      // Save to database
      await ctx.runMutation(internal.consultations.save, { name, email, brief });

      const whatsappUrl = `https://wa.me/254113881734?text=${encodeURIComponent(
        `Hi, I'm ${name} (${email}). ${brief}`
      )}`;

      return new Response(
        JSON.stringify({ success: true, whatsappUrl }),
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    } catch (err) {
      return new Response(
        JSON.stringify({ error: "Internal server error" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        }
      );
    }
  }),
});

export default http;
