import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { MapVisualization } from "@/components/dashboard/MapVisualization";
import { RecommendationsPanel } from "@/components/dashboard/RecommendationsPanel";
import { FarmInfoHeader } from "@/components/dashboard/FarmInfoHeader";
import { StatisticsChart } from "@/components/dashboard/StatisticsChart";
import { Sprout, AlertTriangle, Activity, MapPin } from "lucide-react";

const Dashboard = () => {
  // Dados mock
  const farmInfo = {
    consultant: "Rufer Haubricht Furtado Filho",
    crop: "Soja",
    season: "2025-2026",
  };

  // Dados para gráficos
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
    { name: "Alto Vigor", value: 110.4, percentage: 45 },
    { name: "Vigor Médio", value: 76.0, percentage: 31 },
    { name: "Baixo Vigor", value: 58.9, percentage: 24 },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Dashboard de Análise</h1>
          <p className="text-muted-foreground">
            Visão geral das análises da lavoura
          </p>
        </div>

        {/* Farm Info */}
        <FarmInfoHeader info={farmInfo} />

        {/* Metrics Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Área Total Mapeada"
            value="80 ha"
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

        {/* Statistics Charts */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          <StatisticsChart 
            data={weedsChartData}
            title="Evolução de Plantas Daninhas"
          />
          <StatisticsChart 
            data={failuresChartData}
            title="Evolução de Falhas de Plantio"
          />
          <StatisticsChart 
            data={vigorChartData}
            title="Evolução de Vigor"
          />
        </div>

        {/* Map Visualization */}
        <MapVisualization />

        {/* Recommendations */}
        <RecommendationsPanel />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
