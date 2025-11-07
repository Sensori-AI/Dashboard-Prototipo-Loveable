import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function callLovableAI(apiKey: string, messages: any[]) {
  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'openai/gpt-5-mini',
      messages,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Lovable AI Gateway error:', response.status, errorText);
    throw new Error(`Lovable AI error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? '';
}

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

    // Primeira IA: Gera relatório técnico detalhado
    const technicalPrompt = `Você é um especialista sênior em agronomia com 20 anos de experiência em análise de lavouras. Analise os seguintes dados da fazenda e gere um relatório técnico profissional e detalhado em português:

Período: ${period}
Setores analisados: ${sectors.join(', ')}

Dados Coletados:
- Índice de Vigor Vegetativo: ${farmData.vigor}% (NDVI médio)
- Falhas de Plantio Detectadas: ${farmData.falhas}% da área
- Plantas Daninhas Identificadas: ${farmData.daninhas}% de infestação
- Área Total Mapeada: ${farmData.area} hectares

Gere um relatório técnico completo com:

1. RESUMO EXECUTIVO
   - Status geral da lavoura (Excelente/Bom/Regular/Crítico)
   - Principais indicadores e tendências
   - Prioridades de ação imediata

2. ANÁLISE DETALHADA POR INDICADOR
   - Vigor Vegetativo: análise do NDVI, distribuição espacial, causas de variação
   - Falhas de Plantio: localização, densidade de falhas, impacto na produtividade
   - Plantas Daninhas: espécies predominantes prováveis, nível de competição, distribuição

3. DIAGNÓSTICO AGRONÔMICO
   - Interpretação técnica dos dados
   - Possíveis causas dos problemas identificados
   - Correlações entre indicadores
   - Comparação com padrões ideais para a cultura

4. RECOMENDAÇÕES TÉCNICAS PRIORIZADAS
   - Ações imediatas (próximos 7 dias)
   - Ações de curto prazo (próximas 2-4 semanas)
   - Ações de médio prazo (próximo ciclo)
   - Produtos e dosagens recomendadas quando aplicável

5. ALERTAS E PREVISÕES
   - Riscos potenciais identificados
   - Impacto estimado na produtividade
   - Janelas de oportunidade para intervenção

Use terminologia técnica precisa, cite índices agronômicos relevantes e seja específico nas recomendações com doses, produtos e estratégias de aplicação.`;

    console.log('Gerando relatório técnico com GPT...');
    
    // Primeira IA: Gera relatório técnico completo
    const technicalReport = await callLovableAI(lovableApiKey, [
      { 
        role: 'user', 
        content: technicalPrompt 
      }
    ]);

    console.log('Relatório técnico gerado. Criando resumo simplificado...');

    // Segunda IA: Resume o relatório técnico de forma simplificada para o cliente
    const summaryPrompt = `Você é um consultor agrícola que precisa explicar análises técnicas para produtores rurais de forma clara e acessível.

Leia o seguinte relatório técnico detalhado e crie um RESUMO SIMPLIFICADO em português, usando linguagem simples e direta que qualquer produtor rural possa entender facilmente:

RELATÓRIO TÉCNICO:
${technicalReport}

Crie um resumo executivo simplificado com:

📊 O QUE ENCONTRAMOS
- Explique em 2-3 frases simples o estado geral da lavoura
- Use analogias do dia a dia quando possível

⚠️ PONTOS DE ATENÇÃO
- Liste 3-4 principais problemas em linguagem simples
- Explique POR QUE cada problema é importante
- Use emojis para facilitar a leitura

✅ O QUE FAZER AGORA
- Liste 3-5 ações práticas e diretas
- Evite termos técnicos, use linguagem do produtor
- Priorize do mais urgente para o menos urgente
- Se mencionar produtos, explique o objetivo em termos simples

💰 IMPACTO ESPERADO
- Explique em linguagem simples o que acontece se não agir
- Estime benefícios das ações recomendadas

REGRAS IMPORTANTES:
- Use linguagem coloquial e acessível
- Evite jargões técnicos (substitua por explicações simples)
- Seja direto e prático
- Use bullets e emojis para facilitar leitura
- Máximo 300 palavras no total`;

    const simplifiedSummary = await callLovableAI(lovableApiKey, [
      { 
        role: 'user', 
        content: summaryPrompt 
      }
    ]);

    console.log('Resumo simplificado criado com sucesso!');

    // Structure the report response
    const report = {
      id: crypto.randomUUID(),
      generated_at: new Date().toISOString(),
      period,
      sectors,
      data: farmData,
      technical_report: technicalReport,
      simplified_summary: simplifiedSummary,
      ai_analysis: technicalReport, // Para compatibilidade
      summary: {
        vigor: farmData.vigor,
        falhas: farmData.falhas,
        daninhas: farmData.daninhas,
        status: farmData.vigor > 80 ? 'Excelente' : farmData.vigor > 60 ? 'Bom' : 'Atenção Necessária'
      }
    };

    console.log('Relatório completo gerado: técnico + resumo simplificado');

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
