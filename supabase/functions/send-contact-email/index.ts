import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactRequest {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ 
          error: "Email service not configured. Please add RESEND_API_KEY." 
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { name, email, company, phone, message }: ContactRequest = await req.json();

    console.log('Sending contact emails for:', email);

    // Send email to admin
    const adminEmailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "SensoriAI Agro <onboarding@resend.dev>",
        to: ["contato@sensoriai.com"],
        reply_to: email,
        subject: `Novo Contato: ${name} - ${company || 'Empresa não informada'}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0;">Nova Solicitação de Contato</h1>
            </div>
            
            <div style="padding: 30px; background-color: #f9fafb;">
              <h2 style="color: #1f2937; margin-top: 0;">Informações do Contato</h2>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <p style="margin: 10px 0;"><strong>Nome:</strong> ${name}</p>
                <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
                ${company ? `<p style="margin: 10px 0;"><strong>Empresa:</strong> ${company}</p>` : ''}
                ${phone ? `<p style="margin: 10px 0;"><strong>Telefone:</strong> ${phone}</p>` : ''}
              </div>
              
              <div style="background: white; padding: 20px; border-radius: 8px;">
                <h3 style="color: #1f2937; margin-top: 0;">Mensagem:</h3>
                <p style="color: #4b5563; line-height: 1.6; white-space: pre-wrap;">${message}</p>
              </div>
            </div>
            
            <div style="padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
              <p>Este email foi enviado automaticamente pelo formulário de contato do SensoriAI Agro Insight</p>
            </div>
          </div>
        `,
      }),
    });

    if (!adminEmailResponse.ok) {
      const errorData = await adminEmailResponse.json();
      console.error("Error sending admin email:", errorData);
      throw new Error(`Failed to send admin email: ${JSON.stringify(errorData)}`);
    }

    const adminData = await adminEmailResponse.json();
    console.log("Admin email sent successfully:", adminData);

    // Send confirmation email to user
    const userEmailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "SensoriAI Agro <onboarding@resend.dev>",
        to: [email],
        subject: "Recebemos sua mensagem - SensoriAI Agro Insight",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0;">Obrigado pelo seu contato!</h1>
            </div>
            
            <div style="padding: 30px; background-color: #f9fafb;">
              <p style="color: #1f2937; font-size: 16px; line-height: 1.6;">
                Olá <strong>${name}</strong>,
              </p>
              
              <p style="color: #4b5563; line-height: 1.6;">
                Recebemos sua mensagem e nossa equipe entrará em contato em breve.
              </p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #1f2937; margin-top: 0;">Sua mensagem:</h3>
                <p style="color: #6b7280; line-height: 1.6; white-space: pre-wrap;">${message}</p>
              </div>
              
              <p style="color: #4b5563; line-height: 1.6;">
                Enquanto isso, você pode conhecer mais sobre nossa plataforma em 
                <a href="https://sensoriai-agro-insight.lovable.app" style="color: #10b981; text-decoration: none;">nosso site</a>.
              </p>
            </div>
            
            <div style="padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
              <p>SensoriAI Agro Insight - Tecnologia para Agricultura de Precisão</p>
            </div>
          </div>
        `,
      }),
    });

    if (!userEmailResponse.ok) {
      const errorData = await userEmailResponse.json();
      console.error("Error sending user email:", errorData);
      throw new Error(`Failed to send user email: ${JSON.stringify(errorData)}`);
    }

    const userData = await userEmailResponse.json();
    console.log("User confirmation email sent successfully:", userData);

    return new Response(
      JSON.stringify({ 
        success: true,
        adminEmailId: adminData.id,
        userEmailId: userData.id
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
