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
    
    console.log('Enviando relatório por email para:', email);

    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    if (!resendApiKey) {
      return new Response(
        JSON.stringify({ 
          error: 'RESEND_API_KEY não configurado', 
          details: 'Configure a chave da API do Resend nas configurações do backend para habilitar o envio de emails.' 
        }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Determinar o template baseado no tipo de relatório
    const simplifiedSummary = report.simplified_summary || '';
    const technicalReport = report.technical_report || report.ai_analysis || '';
    
    // Format report data for email
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
              line-height: 1.6; 
              color: #333; 
              margin: 0;
              padding: 0;
              background: #f5f5f5;
            }
            .container { 
              max-width: 800px; 
              margin: 20px auto; 
              background: white;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .header { 
              background: linear-gradient(135deg, #10b981, #059669); 
              color: white; 
              padding: 40px 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0 0 10px 0;
              font-size: 28px;
            }
            .header p {
              margin: 5px 0;
              opacity: 0.95;
            }
            .content { 
              padding: 30px;
            }
            .summary-box {
              background: #f0fdf4;
              border-left: 4px solid #10b981;
              padding: 20px;
              margin: 20px 0;
              border-radius: 8px;
            }
            .summary-box h2 {
              margin-top: 0;
              color: #059669;
              font-size: 20px;
            }
            .metric { 
              background: #f9fafb;
              padding: 20px; 
              margin: 15px 0; 
              border-radius: 8px; 
              border: 1px solid #e5e7eb;
            }
            .metric-label { 
              font-size: 12px; 
              color: #6b7280; 
              text-transform: uppercase; 
              font-weight: 600;
              letter-spacing: 0.5px;
            }
            .metric-value { 
              font-size: 32px; 
              font-weight: bold; 
              color: #10b981; 
              margin: 5px 0;
            }
            .technical-report {
              background: white;
              padding: 25px;
              margin: 20px 0;
              border-radius: 8px;
              border: 1px solid #e5e7eb;
              white-space: pre-wrap;
              line-height: 1.8;
            }
            .technical-report h3 {
              color: #111827;
              border-bottom: 2px solid #10b981;
              padding-bottom: 10px;
              margin-top: 25px;
            }
            .footer { 
              text-align: center; 
              padding: 30px 20px; 
              color: #6b7280; 
              font-size: 13px; 
              background: #f9fafb;
              border-top: 1px solid #e5e7eb;
            }
            .metrics-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 15px;
              margin: 20px 0;
            }
            .btn {
              display: inline-block;
              background: #10b981;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 6px;
              margin-top: 20px;
              font-weight: 600;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌾 ${farmName}</h1>
              <p><strong>Relatório Agrícola Inteligente</strong></p>
              <p>Período: ${report.period}</p>
              <p>Gerado em: ${new Date(report.generated_at).toLocaleString('pt-BR', { 
                dateStyle: 'long', 
                timeStyle: 'short' 
              })}</p>
            </div>
            
            <div class="content">
              ${simplifiedSummary ? `
                <div class="summary-box">
                  <h2>📋 Resumo para o Produtor</h2>
                  <div style="white-space: pre-wrap; line-height: 1.8;">${simplifiedSummary}</div>
                </div>
              ` : ''}
              
              <h2 style="color: #111827; margin-top: 30px;">📊 Indicadores Principais</h2>
              <div class="metrics-grid">
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
              </div>
              
              ${technicalReport ? `
                <h2 style="color: #111827; margin-top: 30px;">📊 Análise Técnica Completa</h2>
                <div class="technical-report">${technicalReport}</div>
              ` : ''}
              
              <div style="text-align: center; margin-top: 30px;">
                <p style="color: #6b7280;">Status Geral: <strong style="color: ${
                  report.summary.status === 'Excelente' ? '#10b981' : 
                  report.summary.status === 'Bom' ? '#f59e0b' : '#ef4444'
                }; font-size: 18px;">${report.summary.status}</strong></p>
              </div>
            </div>
            
            <div class="footer">
              <p><strong>SensoriAI</strong> - Inteligência Artificial para Agricultura de Precisão</p>
              <p>Setores analisados: ${report.sectors.join(', ')}</p>
              <p style="margin-top: 15px; font-size: 11px; color: #9ca3af;">
                Este relatório foi gerado automaticamente usando análise de imagens e inteligência artificial.
              </p>
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
        from: 'SensoriAI Relatórios <relatorios@sensori.ai>',
        to: [email],
        subject: `🌾 Relatório ${farmName} - ${report.period}`,
        html: emailHtml,
      }),
    });

    if (!resendResponse.ok) {
      const error = await resendResponse.text();
      console.error('Resend API error:', resendResponse.status, error);
      throw new Error(`Erro ao enviar email via Resend: ${resendResponse.status}`);
    }

    const result = await resendResponse.json();
    console.log('Email enviado com sucesso:', result.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        emailId: result.id,
        message: 'Email enviado com sucesso!' 
      }), 
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
