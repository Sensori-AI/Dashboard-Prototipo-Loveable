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
    const { farmData, period, sectors } = await req.json();
    
    console.log('Generating AI report for:', { period, sectors });

    // Use Lovable AI Gateway to generate intelligent report analysis
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const prompt = `Você é um especialista em análise agrícola. Analise os seguintes dados da fazenda e gere um relatório profissional detalhado em português:

Período: ${period}
Setores analisados: ${sectors.join(', ')}

Dados:
- Índice de Vigor: ${farmData.vigor}%
- Falhas detectadas: ${farmData.falhas}%
- Daninhas identificadas: ${farmData.daninhas}%
- Área total: ${farmData.area} hectares

Gere um relatório estruturado com:
1. Resumo Executivo (síntese dos principais indicadores)
2. Análise Detalhada por Indicador (vigor, falhas, daninhas)
3. Tendências Identificadas (comparação com períodos anteriores se aplicável)
4. Recomendações Técnicas (ações prioritárias e preventivas)
5. Previsões e Alertas (riscos potenciais)

Use linguagem técnica mas acessível. Seja específico e prático nas recomendações.`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { 
            role: 'user', 
            content: prompt 
          }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('Lovable AI Gateway error:', aiResponse.status, errorText);
      throw new Error(`Lovable AI Gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const reportContent = aiData.choices[0].message.content;

    // Structure the report response
    const report = {
      id: crypto.randomUUID(),
      generated_at: new Date().toISOString(),
      period,
      sectors,
      data: farmData,
      ai_analysis: reportContent,
      summary: {
        vigor: farmData.vigor,
        falhas: farmData.falhas,
        daninhas: farmData.daninhas,
        status: farmData.vigor > 80 ? 'Excelente' : farmData.vigor > 60 ? 'Bom' : 'Atenção Necessária'
      }
    };

    console.log('AI report generated successfully');

    return new Response(JSON.stringify(report), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating AI report:', error);
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
