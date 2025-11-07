import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, report, farmName } = await req.json();
    
    console.log('Sending report email to:', email);

    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY not configured. Please add it in the backend settings.');
    }

    // Format report data for email
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 800px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .metric { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .metric-label { font-size: 14px; color: #6b7280; text-transform: uppercase; }
            .metric-value { font-size: 32px; font-weight: bold; color: #10b981; }
            .analysis { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; white-space: pre-wrap; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌾 Relatório Agrícola - ${farmName}</h1>
              <p>Período: ${report.period}</p>
              <p>Gerado em: ${new Date(report.generated_at).toLocaleString('pt-BR')}</p>
            </div>
            <div class="content">
              <h2>📊 Indicadores Principais</h2>
              <div class="metric">
                <div class="metric-label">Índice de Vigor</div>
                <div class="metric-value">${report.data.vigor}%</div>
              </div>
              <div class="metric">
                <div class="metric-label">Falhas Detectadas</div>
                <div class="metric-value">${report.data.falhas}%</div>
              </div>
              <div class="metric">
                <div class="metric-label">Daninhas Identificadas</div>
                <div class="metric-value">${report.data.daninhas}%</div>
              </div>
              
              <h2>🤖 Análise com IA</h2>
              <div class="analysis">${report.ai_analysis}</div>
              
              <h2>✅ Status Geral</h2>
              <p style="font-size: 20px; font-weight: bold; color: ${report.summary.status === 'Excelente' ? '#10b981' : report.summary.status === 'Bom' ? '#f59e0b' : '#ef4444'}">
                ${report.summary.status}
              </p>
            </div>
            <div class="footer">
              <p>Este é um relatório automático gerado pelo SensoriAI</p>
              <p>Setores analisados: ${report.sectors.join(', ')}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'SensoriAI <relatorios@sensori.ai>',
        to: [email],
        subject: `🌾 Relatório Agrícola - ${farmName} - ${report.period}`,
        html: emailHtml,
      }),
    });

    if (!resendResponse.ok) {
      const error = await resendResponse.text();
      throw new Error(`Resend API error: ${error}`);
    }

    const result = await resendResponse.json();
    console.log('Email sent successfully:', result.id);

    return new Response(
      JSON.stringify({ success: true, emailId: result.id }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
