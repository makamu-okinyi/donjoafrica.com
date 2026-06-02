import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const NOTIFY_EMAIL = "Allan.mbuthia.nganga@gmail.com";
const NOTIFY_WHATSAPP = "+254113881734";

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { name, email, brief } = await req.json();

    if (!name || !email || !brief) {
      console.error("Missing required fields:", { name, email, brief });
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("New consultation request:", { name, email });

    // Save to database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error: dbError } = await supabase
      .from("consultations")
      .insert({ name, email, brief });

    if (dbError) {
      console.error("Database insert error:", dbError);
      throw new Error(`Database error: ${dbError.message}`);
    }

    console.log("Consultation saved to database");

    // Send email notification via Resend
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    let emailSent = false;

    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        const { error: emailError } = await resend.emails.send({
          from: "Consultancy <onboarding@resend.dev>",
          to: [NOTIFY_EMAIL],
          subject: `New Consultation Request from ${name}`,
          html: `
            <div style="font-family: 'DM Sans', sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #f0f0f3; border-radius: 16px;">
              <h1 style="color: #222222; font-size: 24px; margin-bottom: 24px;">📋 New Consultation Request</h1>
              <div style="background: #ffffff; border-radius: 12px; padding: 24px; margin-bottom: 16px;">
                <p style="margin: 0 0 12px 0; color: #666;"><strong style="color: #222;">Name:</strong> ${name}</p>
                <p style="margin: 0 0 12px 0; color: #666;"><strong style="color: #222;">Email:</strong> ${email}</p>
                <p style="margin: 0; color: #666;"><strong style="color: #222;">Project Brief:</strong></p>
                <p style="margin: 8px 0 0 0; color: #444; line-height: 1.6;">${brief}</p>
              </div>
              <p style="color: #999; font-size: 12px; text-align: center;">Sent from your consultancy website</p>
            </div>
          `,
        });

        if (emailError) {
          console.error("Email send error:", emailError);
        } else {
          emailSent = true;
          console.log("Email notification sent successfully");
        }
      } catch (emailErr) {
        console.error("Resend error:", emailErr);
      }
    } else {
      console.warn("RESEND_API_KEY not configured, skipping email");
    }

    // Generate WhatsApp deep link for client-side redirect
    const whatsappMessage = encodeURIComponent(
      `🔔 New Consultation Request!\n\n👤 Name: ${name}\n📧 Email: ${email}\n📝 Brief: ${brief}`
    );
    const whatsappUrl = `https://wa.me/${NOTIFY_WHATSAPP.replace("+", "")}?text=${whatsappMessage}`;

    console.log("WhatsApp URL generated");

    return new Response(
      JSON.stringify({
        success: true,
        emailSent,
        whatsappUrl,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Error in notify-consultation:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});