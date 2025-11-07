import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.80.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { action, schedule } = await req.json();

    console.log('Schedule action:', action, schedule);

    if (action === 'create') {
      // Store schedule configuration
      const { data, error } = await supabase
        .from('report_schedules')
        .insert({
          email: schedule.email,
          frequency: schedule.frequency,
          sectors: schedule.sectors,
          enabled: true,
          next_execution: calculateNextExecution(schedule.frequency),
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true, schedule: data }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'execute') {
      // This function is called by a cron job or scheduler
      // Fetch all active schedules that are due
      const { data: schedules, error } = await supabase
        .from('report_schedules')
        .select('*')
        .eq('enabled', true)
        .lte('next_execution', new Date().toISOString());

      if (error) throw error;

      const results = [];

      for (const schedule of schedules) {
        try {
          // Generate report with AI
          const reportResponse = await fetch(
            `${supabaseUrl}/functions/v1/generate-ai-report`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${supabaseServiceKey}`,
              },
              body: JSON.stringify({
                farmData: {
                  vigor: 85, // This should come from actual data
                  falhas: 8,
                  daninhas: 12,
                  area: 500,
                },
                period: getCurrentPeriod(schedule.frequency),
                sectors: schedule.sectors,
              }),
            }
          );

          const report = await reportResponse.json();

          // Send email
          await fetch(
            `${supabaseUrl}/functions/v1/send-report-email`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${supabaseServiceKey}`,
              },
              body: JSON.stringify({
                email: schedule.email,
                report,
                farmName: 'Fazenda Principal',
              }),
            }
          );

          // Update next execution time
          await supabase
            .from('report_schedules')
            .update({ 
              next_execution: calculateNextExecution(schedule.frequency),
              last_execution: new Date().toISOString(),
            })
            .eq('id', schedule.id);

          results.push({ id: schedule.id, status: 'success' });
        } catch (err) {
          console.error(`Error processing schedule ${schedule.id}:`, err);
          const errorMessage = err instanceof Error ? err.message : 'Unknown error';
          results.push({ id: schedule.id, status: 'error', error: errorMessage });
        }
      }

      return new Response(
        JSON.stringify({ success: true, results }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    throw new Error('Invalid action');
  } catch (error) {
    console.error('Error in schedule-reports:', error);
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

function calculateNextExecution(frequency: string): string {
  const now = new Date();
  switch (frequency) {
    case 'weekly':
      now.setDate(now.getDate() + 7);
      break;
    case 'bi-weekly':
      now.setDate(now.getDate() + 14);
      break;
    case 'monthly':
      now.setMonth(now.getMonth() + 1);
      break;
  }
  return now.toISOString();
}

function getCurrentPeriod(frequency: string): string {
  const now = new Date();
  const start = new Date();
  
  switch (frequency) {
    case 'weekly':
      start.setDate(now.getDate() - 7);
      break;
    case 'bi-weekly':
      start.setDate(now.getDate() - 14);
      break;
    case 'monthly':
      start.setMonth(now.getMonth() - 1);
      break;
  }
  
  return `${start.toLocaleDateString('pt-BR')} - ${now.toLocaleDateString('pt-BR')}`;
}
