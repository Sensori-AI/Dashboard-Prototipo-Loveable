import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { ConsultantChatbot } from "./ConsultantChatbot";
import { Separator } from "@/components/ui/separator";

interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  category: string;
}

const mockRecommendations: Recommendation[] = [
  {
    id: "1",
    title: "Controle de Plantas Daninhas Urgente",
    description: "Foi detectada uma infestação de 15.8% de plantas daninhas na área nordeste. Recomenda-se aplicação localizada de herbicida nas zonas marcadas em vermelho no mapa.",
    priority: "high",
    category: "Plantas Daninhas",
  },
  {
    id: "2",
    title: "Replantio em Áreas de Falha",
    description: "Identificadas falhas de plantio em 8.3% da área total. As zonas georreferenciadas devem ser replantadas para maximizar a produtividade.",
    priority: "medium",
    category: "Falhas de Plantio",
  },
  {
    id: "3",
    title: "Aplicação de Fertilizante em Zonas de Baixo Vigor",
    description: "23.4% da área apresenta vigor baixo a médio. Recomenda-se análise de solo e aplicação variada de fertilizantes nas zonas identificadas.",
    priority: "medium",
    category: "Vigor",
  },
];

export const RecommendationsPanel = () => {
  const observationsText = `Após a análise detalhada realizada pela inteligência artificial da sensoriAI, foram observados os seguintes problemas na lavoura:

• **Infestação por Plantas Daninhas**: Detectada presença significativa de plantas daninhas em 15.8% da área total (38.7 hectares), com concentração maior nos setores S-001, S-003 e S-007. A infestação apresenta tendência de crescimento de 2.3% em relação ao mês anterior, indicando necessidade de intervenção imediata.

• **Falhas de Plantio Críticas**: Identificadas falhas de plantio em 8.3% da propriedade (20.4 hectares), distribuídas principalmente nos setores S-002, S-005 e S-009. Essas falhas comprometem a densidade ideal de plantas por metro quadrado e podem impactar significativamente a produtividade esperada para a safra.

• **Variação no Vigor Vegetativo**: Mapeamento de vigor mostra distribuição desigual, com 45% da área em alto vigor, 31% em vigor médio e 24% em baixo vigor. As áreas de baixo vigor necessitam atenção especial, podendo indicar problemas nutricionais, compactação do solo ou deficiência hídrica.

• **Georreferenciamento Completo**: Todos os 245.3 hectares foram mapeados com precisão, permitindo intervenções localizadas e otimização no uso de insumos agrícolas.`;

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case "medium":
        return <Info className="h-4 w-4 text-warning" />;
      case "low":
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      case "low":
        return "default";
      default:
        return "default";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Observações */}
        <Card>
          <CardHeader>
            <CardTitle>Observações da Análise</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <p className="text-foreground whitespace-pre-line leading-relaxed">
                {observationsText}
              </p>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Recomendações */}
        <Card>
          <CardHeader>
            <CardTitle>Recomendações Agronômicas Prioritárias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRecommendations.map((recommendation) => (
                <div
                  key={recommendation.id}
                  className="flex gap-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-shrink-0">
                    {getPriorityIcon(recommendation.priority)}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-semibold text-foreground">
                        {recommendation.title}
                      </h3>
                      <Badge variant="outline" className="flex-shrink-0">
                        {recommendation.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {recommendation.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chatbot */}
      <div className="lg:col-span-1">
        <ConsultantChatbot />
      </div>
    </div>
  );
};
