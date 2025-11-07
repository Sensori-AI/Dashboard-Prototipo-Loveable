import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Calendar, User, Leaf, Filter, Clock, History } from "lucide-react";
import { StatisticsChart } from "@/components/dashboard/StatisticsChart";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { toast } from "sonner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Sprout, AlertTriangle, Activity, MapPin, FileSpreadsheet, Mail } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { exportToCSV, exportToExcel, prepareReportData } from "@/utils/exportData";

const Reports = () => {
  const navigate = useNavigate();
  const [selectedSector, setSelectedSector] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("week");
  const [emailSchedule, setEmailSchedule] = useState({
    enabled: false,
    frequency: "weekly",
    email: "",
  });
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [aiReport, setAiReport] = useState<any>(null);

  const handleDownloadPDF = async () => {
    try {
      toast.loading("Gerando relatório em PDF...");
      
      const element = document.getElementById("report-content");
      if (!element) {
        toast.error("Erro ao encontrar conteúdo do relatório");
        return;
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const date = new Date().toLocaleDateString("pt-BR");
      pdf.save(`relatorio-sensoriAI-${date}.pdf`);
      
      toast.dismiss();
      toast.success("Relatório PDF gerado com sucesso!");
    } catch (error) {
      toast.dismiss();
      toast.error("Erro ao gerar relatório PDF");
      console.error(error);
    }
  };

  const weedsChartData = [
    { name: "S-001", value: 15.2, percentage: 39.3 },
    { name: "S-003", value: 12.8, percentage: 33.0 },
    { name: "S-007", value: 10.7, percentage: 27.7 },
  ];

  const failuresChartData = [
    { name: "S-002", value: 8.5, percentage: 41.7 },
    { name: "S-005", value: 6.9, percentage: 33.8 },
    { name: "S-009", value: 5.0, percentage: 24.5 },
  ];

  const vigorChartData = [
    { name: "Alto", value: 110.4, percentage: 45 },
    { name: "Médio", value: 76.0, percentage: 31 },
    { name: "Baixo", value: 58.9, percentage: 24 },
  ];

  const handleGenerateAIReport = async () => {
    setIsGeneratingReport(true);
    try {
      toast.loading("Gerando relatório com IA...");
      
      const { data, error } = await supabase.functions.invoke('generate-ai-report', {
        body: {
          farmData: {
            vigor: 72,
            falhas: 8.3,
            daninhas: 15.8,
            area: 245.3,
          },
          period: selectedPeriod === "week" ? "Última Semana" : selectedPeriod === "month" ? "Último Mês" : "Período Selecionado",
          sectors: selectedSector === "all" ? ["S-001", "S-002", "S-003"] : [selectedSector.toUpperCase()],
        },
      });

      if (error) throw error;
      
      setAiReport(data);
      toast.dismiss();
      toast.success("Relatório gerado com sucesso!");
    } catch (error) {
      console.error('Error generating report:', error);
      toast.dismiss();
      toast.error("Erro ao gerar relatório com IA");
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleScheduleEmail = async () => {
    if (!emailSchedule.email) {
      toast.error("Por favor, insira um email válido");
      return;
    }

    if (!emailSchedule.enabled) {
      toast.info("Ative o envio automático para criar o agendamento");
      return;
    }

    try {
      toast.loading("Criando agendamento...");

      const { data, error } = await supabase.functions.invoke('schedule-reports', {
        body: {
          action: 'create',
          schedule: {
            email: emailSchedule.email,
            frequency: emailSchedule.frequency,
            sectors: selectedSector === "all" ? ["S-001", "S-002", "S-003"] : [selectedSector.toUpperCase()],
          },
        },
      });

      if (error) throw error;

      toast.dismiss();
      toast.success("Agendamento criado com sucesso!", {
        description: `Relatórios serão enviados ${
          emailSchedule.frequency === 'weekly' ? 'semanalmente' : 
          emailSchedule.frequency === 'monthly' ? 'mensalmente' : 
          'quinzenalmente'
        } para ${emailSchedule.email}`,
      });
      
      // Reset form
      setEmailSchedule({ enabled: false, frequency: "weekly", email: "" });
    } catch (error: any) {
      toast.dismiss();
      console.error('Error scheduling email:', error);
      
      if (error.message?.includes('RESEND_API_KEY')) {
        toast.error("Configure a chave RESEND_API_KEY", {
          description: "Acesse as configurações do backend e adicione sua chave da API do Resend",
        });
      } else {
        toast.error("Erro ao criar agendamento", {
          description: error.message || "Tente novamente mais tarde",
        });
      }
    }
  };

  const handleExportCSV = () => {
    const reportData = aiReport || {
      generated_at: new Date().toISOString(),
      period: selectedPeriod,
      sectors: selectedSector === "all" ? ["S-001", "S-002", "S-003"] : [selectedSector.toUpperCase()],
      data: { vigor: 72, falhas: 8.3, daninhas: 15.8, area: 245.3 },
      summary: { status: "Bom" },
    };
    
    const csvData = prepareReportData(reportData);
    exportToCSV(csvData, `relatorio-${new Date().toLocaleDateString('pt-BR')}`);
    toast.success("Relatório exportado em CSV!");
  };

  const handleExportExcel = () => {
    const reportData = aiReport || {
      generated_at: new Date().toISOString(),
      period: selectedPeriod,
      sectors: selectedSector === "all" ? ["S-001", "S-002", "S-003"] : [selectedSector.toUpperCase()],
      data: { vigor: 72, falhas: 8.3, daninhas: 15.8, area: 245.3 },
      summary: { status: "Bom" },
    };
    
    const excelData = prepareReportData(reportData);
    exportToExcel(excelData, `relatorio-${new Date().toLocaleDateString('pt-BR')}`);
    toast.success("Relatório exportado em Excel!");
  };

  const handleSendEmail = async () => {
    if (!aiReport) {
      toast.error("Gere um relatório com IA antes de enviar por email");
      return;
    }

    // Dialog para coletar email
    const email = prompt("Digite o email para envio do relatório:");
    
    if (!email) {
      toast.info("Envio cancelado");
      return;
    }

    if (!email.includes('@')) {
      toast.error("Email inválido");
      return;
    }

    try {
      toast.loading("Enviando relatório por email...");

      const { data, error } = await supabase.functions.invoke('send-report-email', {
        body: {
          email,
          report: aiReport,
          farmName: "Fazenda Principal",
        },
      });

      if (error) throw error;

      toast.dismiss();
      toast.success("Relatório enviado com sucesso!", {
        description: `Email enviado para ${email}`,
      });
    } catch (error: any) {
      toast.dismiss();
      console.error('Error sending email:', error);
      
      if (error.message?.includes('RESEND_API_KEY')) {
        toast.error("Configure a chave RESEND_API_KEY nas configurações do backend");
      } else {
        toast.error("Erro ao enviar email", {
          description: error.message || "Tente novamente",
        });
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6">
        {/* Header com botões */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Relatório de Análise da Lavoura
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Resumo completo das análises realizadas
            </p>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <Button
              onClick={() => navigate("/reports-history")}
              variant="outline"
              className="gap-2"
            >
              <History className="h-4 w-4" />
              Histórico
            </Button>
            <Button
              onClick={handleGenerateAIReport}
              variant="default"
              className="gap-2"
              disabled={isGeneratingReport}
            >
              <Activity className="h-4 w-4" />
              {isGeneratingReport ? "Gerando..." : "Gerar com IA"}
            </Button>
            <Button
              onClick={handleSendEmail}
              variant="outline"
              className="gap-2"
              disabled={!aiReport}
              title={!aiReport ? "Gere um relatório primeiro" : "Enviar relatório por email"}
            >
              <Mail className="h-4 w-4" />
              Enviar Email
            </Button>
            <Button
              onClick={handleExportCSV}
              variant="outline"
              className="gap-2"
            >
              <FileSpreadsheet className="h-4 w-4" />
              CSV
            </Button>
            <Button
              onClick={handleExportExcel}
              variant="outline"
              className="gap-2"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Excel
            </Button>
            <Button onClick={handleDownloadPDF} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              PDF
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Clock className="h-4 w-4" />
                  Agendar
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Agendar Relatórios Automáticos</DialogTitle>
                  <DialogDescription>
                    Configure o envio automático de relatórios por email
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="enable-schedule"
                      checked={emailSchedule.enabled}
                      onCheckedChange={(checked) =>
                        setEmailSchedule({ ...emailSchedule, enabled: checked as boolean })
                      }
                    />
                    <Label htmlFor="enable-schedule">
                      Ativar envio automático de relatórios
                    </Label>
                  </div>

                  {emailSchedule.enabled && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="frequency">Frequência</Label>
                        <Select
                          value={emailSchedule.frequency}
                          onValueChange={(value) =>
                            setEmailSchedule({ ...emailSchedule, frequency: value })
                          }
                        >
                          <SelectTrigger id="frequency">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="weekly">Semanal</SelectItem>
                            <SelectItem value="biweekly">Quinzenal</SelectItem>
                            <SelectItem value="monthly">Mensal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="seuemail@exemplo.com"
                          value={emailSchedule.email}
                          onChange={(e) =>
                            setEmailSchedule({ ...emailSchedule, email: e.target.value })
                          }
                        />
                      </div>
                    </>
                  )}
                </div>
                <DialogFooter>
                  <Button onClick={handleScheduleEmail}>Salvar Agendamento</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button onClick={handleDownloadPDF} className="gap-2">
              <Download className="h-4 w-4" />
              Baixar PDF
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros Personalizados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="sector">Setor</Label>
                <Select value={selectedSector} onValueChange={setSelectedSector}>
                  <SelectTrigger id="sector">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Setores</SelectItem>
                    <SelectItem value="s-001">Setor S-001</SelectItem>
                    <SelectItem value="s-002">Setor S-002</SelectItem>
                    <SelectItem value="s-003">Setor S-003</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="period">Período</Label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger id="period">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Última Semana</SelectItem>
                    <SelectItem value="month">Último Mês</SelectItem>
                    <SelectItem value="quarter">Último Trimestre</SelectItem>
                    <SelectItem value="year">Último Ano</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="start-date">Data Inicial</Label>
                <Input id="start-date" type="date" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-date">Data Final</Label>
                <Input id="end-date" type="date" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conteúdo do relatório */}
        <div id="report-content" className="space-y-6 bg-background p-4 sm:p-6 rounded-lg">
          {/* Informações da Propriedade */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-primary" />
                Informações da Propriedade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Consultor</p>
                    <p className="font-semibold">Dr. Carlos Silva</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Sprout className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Cultura</p>
                    <p className="font-semibold">Soja</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Safra</p>
                    <p className="font-semibold">2024/2025</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Métricas Principais */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Área Total Mapeada"
              value="245.3 ha"
              subtitle="100% da propriedade"
              icon={MapPin}
              variant="success"
            />
            <MetricCard
              title="Plantas Daninhas"
              value="15.8%"
              subtitle="38.7 ha infestados"
              icon={Sprout}
              variant="warning"
              trend={{ value: "2.3% vs. mês anterior", isPositive: false }}
            />
            <MetricCard
              title="Falhas de Plantio"
              value="8.3%"
              subtitle="20.4 ha com falhas"
              icon={AlertTriangle}
              variant="danger"
            />
            <MetricCard
              title="Vigor Médio"
              value="72%"
              subtitle="Alto: 45% | Médio: 31% | Baixo: 24%"
              icon={Activity}
              variant="success"
              trend={{ value: "5% vs. semana anterior", isPositive: true }}
            />
          </div>

          {/* Gráficos Estatísticos */}
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Plantas Daninhas</CardTitle>
              </CardHeader>
              <CardContent>
                <StatisticsChart 
                  data={weedsChartData}
                  title="Evolução por Setor"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Falhas de Plantio</CardTitle>
              </CardHeader>
              <CardContent>
                <StatisticsChart 
                  data={failuresChartData}
                  title="Evolução por Setor"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Vigor da Cultura</CardTitle>
              </CardHeader>
              <CardContent>
                <StatisticsChart 
                  data={vigorChartData}
                  title="Distribuição de Vigor"
                />
              </CardContent>
            </Card>
          </div>

          {/* Resumo Simplificado para o Cliente */}
          {aiReport?.simplified_summary && (
            <Card className="border-2 border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  📋 Resumo Simplificado (Para o Cliente)
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Linguagem acessível e direta para facilitar o entendimento
                </p>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-sm text-foreground leading-relaxed bg-background p-4 rounded-lg">
                    {aiReport.simplified_summary}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Relatório Técnico Completo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-primary" />
                {aiReport ? '📊 Relatório Técnico Completo (Detalhado)' : 'Análise Profissional com IA'}
              </CardTitle>
              {aiReport && (
                <p className="text-sm text-muted-foreground">
                  Análise técnica detalhada para agrônomos e consultores
                </p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {aiReport ? (
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-sm text-foreground leading-relaxed">
                    {aiReport.technical_report || aiReport.ai_analysis}
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Plantas Daninhas</h4>
                    <p className="text-sm text-muted-foreground">
                      Após análise da IA, foram identificadas plantas daninhas em 3 setores principais da lavoura. 
                      O Setor S-001 apresenta o maior nível de infestação (39.3% da área), seguido pelo Setor S-003 (33.0%). 
                      As espécies predominantes incluem Buva e Capim-Amargoso, que requerem intervenção imediata 
                      para evitar perdas de produtividade.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Falhas de Plantio</h4>
                    <p className="text-sm text-muted-foreground">
                      Foram detectadas falhas de plantio em 20.4 hectares (8.3% da área total). O Setor S-002 apresenta 
                      a maior concentração de falhas (41.7%), indicando possíveis problemas na distribuição de sementes 
                      ou na regulagem da plantadeira. Recomenda-se replantio nas áreas mais críticas e revisão do 
                      equipamento para evitar recorrência.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Vigor da Cultura</h4>
                    <p className="text-sm text-muted-foreground">
                      A análise de vigor indica que 45% da área total apresenta alto desenvolvimento vegetativo, 
                      demonstrando boa saúde das plantas. As áreas com vigor médio (31%) podem se beneficiar 
                      de aplicação localizada de nutrientes. As zonas de baixo vigor (24%) requerem investigação 
                      adicional para identificar possíveis deficiências nutricionais ou problemas no solo.
                    </p>
                  </div>
                  
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border">
                    <p className="text-sm text-muted-foreground italic">
                      💡 Clique em &quot;Gerar com IA&quot; para obter uma análise técnica completa + resumo simplificado para o cliente
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Recomendações */}
          <Card>
            <CardHeader>
              <CardTitle>Recomendações Prioritárias</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-destructive/10 text-destructive flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  <div>
                    <p className="font-semibold text-sm">Controle Imediato de Plantas Daninhas</p>
                    <p className="text-xs text-muted-foreground">
                      Aplicar herbicida seletivo nos Setores S-001 e S-003 com prioridade alta
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-warning/10 text-warning flex items-center justify-center text-xs font-bold">
                    2
                  </span>
                  <div>
                    <p className="font-semibold text-sm">Replantio em Áreas Críticas</p>
                    <p className="text-xs text-muted-foreground">
                      Realizar replantio no Setor S-002 onde as falhas excedem 40%
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                    3
                  </span>
                  <div>
                    <p className="font-semibold text-sm">Adubação de Cobertura Localizada</p>
                    <p className="text-xs text-muted-foreground">
                      Aplicar fertilizantes nas zonas de baixo vigor identificadas
                    </p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Rodapé do Relatório */}
          <div className="text-center pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Relatório gerado em {new Date().toLocaleDateString("pt-BR")} às {new Date().toLocaleTimeString("pt-BR")}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              sensoriAI - Análise Agrícola Inteligente
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
