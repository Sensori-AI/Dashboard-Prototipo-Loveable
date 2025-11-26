import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Leaf, 
  Brain, 
  TrendingDown, 
  BarChart3, 
  Shield, 
  Zap, 
  Users, 
  CheckCircle2, 
  ArrowRight,
  Satellite,
  Database,
  Cpu,
  Lock,
  Star,
  Building2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ContactForm } from "@/components/ContactForm";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Satellite,
      title: "Monitoramento Inteligente",
      description: "Acompanhe sua lavoura em tempo real com mapas de alta resolução, análise de vigor e detecção de anomalias."
    },
    {
      icon: Brain,
      title: "Tomada de Decisão Baseada em IA",
      description: "Relatórios automáticos com recomendações precisas geradas por inteligência artificial agronômica."
    },
    {
      icon: TrendingDown,
      title: "Redução de Custos Operacionais",
      description: "Otimize o uso de insumos, identifique falhas de plantio e reduza desperdícios em até 30%."
    },
    {
      icon: BarChart3,
      title: "Gestão Integrada de Talhões",
      description: "Visualize todos os setores da propriedade em um único painel com métricas atualizadas."
    }
  ];

  const plans = [
    {
      name: "Starter",
      price: "R$ 297",
      period: "/mês",
      description: "Para pequenos produtores",
      features: [
        "Até 100 hectares",
        "3 usuários inclusos",
        "Mapas de vigor e daninhas",
        "Relatórios mensais",
        "Suporte por email"
      ]
    },
    {
      name: "Profissional",
      price: "R$ 897",
      period: "/mês",
      description: "Fazendas médias e equipes",
      featured: true,
      features: [
        "Até 500 hectares",
        "10 usuários inclusos",
        "Todos os mapas e análises",
        "Relatórios semanais com IA",
        "Integrações avançadas",
        "Suporte prioritário"
      ]
    },
    {
      name: "Empresarial",
      price: "Sob consulta",
      period: "",
      description: "Grandes operações",
      features: [
        "Hectares ilimitados",
        "Usuários ilimitados",
        "API personalizada",
        "Consultoria especializada",
        "SLA garantido",
        "Treinamento in loco"
      ]
    }
  ];

  const testimonials = [
    {
      name: "Roberto Ferreira",
      role: "Gerente de Operações",
      company: "Fazenda Santa Clara",
      content: "Com a SensoriAI conseguimos reduzir 25% no uso de defensivos identificando focos de daninhas com precisão. A plataforma se pagou em dois meses.",
      avatar: "RF"
    },
    {
      name: "Marina Costa",
      role: "Engenheira Agrônoma",
      company: "AgroTech Consultoria",
      content: "Atendemos 15 propriedades e a SensoriAI se tornou nossa principal ferramenta de diagnóstico. Os relatórios de IA economizam horas de trabalho.",
      avatar: "MC"
    },
    {
      name: "João Almeida",
      role: "Produtor Rural",
      company: "Sítio Boa Vista",
      content: "Finalmente consigo ver o que está acontecendo em cada talhão sem precisar percorrer a propriedade toda. A visão integrada mudou minha forma de gerir.",
      avatar: "JA"
    }
  ];

  const stats = [
    { value: "50.000+", label: "Hectares Monitorados" },
    { value: "300+", label: "Produtores Ativos" },
    { value: "15", label: "Estados Atendidos" },
    { value: "98%", label: "Satisfação dos Clientes" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-foreground">SensoriAI</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Funcionalidades
            </a>
            <a href="#plans" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Planos
            </a>
            <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Sobre
            </a>
            <Button onClick={() => navigate('/dashboard')} variant="outline" size="sm">
              Acessar Plataforma
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-20 md:py-32 animate-fade-in">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-6">
            <Badge variant="secondary" className="w-fit">
              <Zap className="h-3 w-3 mr-1" />
              Agricultura de Precisão
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
              Inteligência Agrícola que Multiplica seus Resultados
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              Transforme dados de satélite em decisões estratégicas. Monitore vigor, detecte plantas daninhas e otimize sua operação com IA agronômica.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-base" onClick={() => navigate('/dashboard')}>
                Começar Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-base" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                Solicitar Demonstração
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 p-8 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-4 w-full">
                <Card className="p-4 space-y-2 hover:scale-105 transition-transform">
                  <Satellite className="h-8 w-8 text-primary" />
                  <p className="text-sm font-semibold">Mapas HD</p>
                </Card>
                <Card className="p-4 space-y-2 hover:scale-105 transition-transform">
                  <Brain className="h-8 w-8 text-secondary" />
                  <p className="text-sm font-semibold">IA Agronômica</p>
                </Card>
                <Card className="p-4 space-y-2 hover:scale-105 transition-transform">
                  <BarChart3 className="h-8 w-8 text-accent" />
                  <p className="text-sm font-semibold">Análises</p>
                </Card>
                <Card className="p-4 space-y-2 hover:scale-105 transition-transform">
                  <Shield className="h-8 w-8 text-success" />
                  <p className="text-sm font-semibold">Seguro</p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Access Section */}
      <section className="bg-primary/5 py-12 border-y border-border animate-fade-in">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-2xl font-bold text-foreground">Já é cliente?</h3>
              <p className="text-muted-foreground max-w-2xl">
                Acesse sua conta para visualizar mapas detalhados, análises de talhões e relatórios operacionais da sua propriedade.
              </p>
            </div>
            <Button size="lg" onClick={() => navigate('/dashboard')} className="shrink-0">
              <Users className="mr-2 h-5 w-5" />
              Acessar Dashboard
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container py-20 animate-fade-in">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Tecnologia que Impulsiona o Agronegócio
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ferramentas completas para monitoramento, análise e gestão inteligente da sua lavoura
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 space-y-4 hover:shadow-lg transition-shadow animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <p className="text-4xl md:text-5xl font-bold">{stat.value}</p>
                <p className="text-primary-foreground/80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="container py-20 animate-fade-in">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Sobre a SensoriAI
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p className="text-base">
                <strong className="text-foreground">Nossa Missão:</strong> Democratizar o acesso à agricultura de precisão, oferecendo tecnologia de ponta para produtores de todos os portes.
              </p>
              <p className="text-base">
                <strong className="text-foreground">Nossa Visão:</strong> Ser a principal plataforma de inteligência agrícola da América Latina, conectando dados, pessoas e decisões estratégicas.
              </p>
              <p className="text-base">
                <strong className="text-foreground">Nossos Valores:</strong> Inovação contínua, compromisso com resultados reais, transparência na comunicação e respeito ao meio ambiente.
              </p>
            </div>
          </div>
          <Card className="p-8 space-y-6">
            <h3 className="text-xl font-semibold text-foreground">Nosso Impacto</h3>
            <div className="space-y-4">
              {[
                "Redução média de 28% em custos com defensivos",
                "Aumento de 15% na produtividade média",
                "Economia de 40 horas/mês em gestão operacional",
                "Decisões 3x mais rápidas com IA"
              ].map((impact, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">{impact}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* Plans Section */}
      <section id="plans" className="bg-muted/50 py-20 animate-fade-in">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Planos para Cada Necessidade
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Escolha o plano ideal para o tamanho da sua operação
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`p-8 space-y-6 ${plan.featured ? 'border-primary border-2 shadow-lg scale-105' : ''} animate-scale-in`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {plan.featured && (
                  <Badge className="w-fit">Mais Popular</Badge>
                )}
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-4xl font-bold text-foreground">
                    {plan.price}
                    <span className="text-lg font-normal text-muted-foreground">{plan.period}</span>
                  </p>
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant={plan.featured ? "default" : "outline"}>
                  {plan.price === "Sob consulta" ? "Falar com Vendas" : "Testar Agora"}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="container py-20 animate-fade-in">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Integração Completa
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Conecte sensores, drones, APIs e sistemas externos em uma única plataforma
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="p-6 space-y-4 text-center">
            <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mx-auto">
              <Database className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Dados Multi-fonte</h3>
            <p className="text-sm text-muted-foreground">
              Imagens de satélite, drones, sensores de solo e estações meteorológicas
            </p>
          </Card>
          <Card className="p-6 space-y-4 text-center">
            <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mx-auto">
              <Cpu className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">IA Especializada</h3>
            <p className="text-sm text-muted-foreground">
              Modelos de machine learning treinados especificamente para agricultura
            </p>
          </Card>
          <Card className="p-6 space-y-4 text-center">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">API Aberta</h3>
            <p className="text-sm text-muted-foreground">
              Integre com ERPs, sistemas de gestão e outras ferramentas da sua operação
            </p>
          </Card>
        </div>
      </section>

      {/* Security Section */}
      <section className="bg-muted/30 py-16 animate-fade-in">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Lock className="h-12 w-12 text-primary mx-auto" />
            <h2 className="text-3xl font-bold text-foreground">Segurança e Privacidade</h2>
            <p className="text-muted-foreground">
              Seus dados agrícolas são protegidos com criptografia de ponta a ponta, autenticação avançada e conformidade com LGPD. Servidores em nuvem redundantes garantem disponibilidade 24/7 e backups automáticos diários.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Badge variant="secondary">ISO 27001</Badge>
              <Badge variant="secondary">LGPD Compliant</Badge>
              <Badge variant="secondary">SSL/TLS</Badge>
              <Badge variant="secondary">Backup Diário</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container py-20 animate-fade-in">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            O Que Nossos Clientes Dizem
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Histórias reais de quem transformou a gestão da lavoura com a SensoriAI
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 space-y-4 animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground italic">"{testimonial.content}"</p>
              <div className="flex items-center gap-3 pt-4 border-t">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">{testimonial.avatar}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.company}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Partners Section */}
      <section className="bg-muted/50 py-16 animate-fade-in">
        <div className="container text-center space-y-8">
          <h3 className="text-2xl font-bold text-foreground">Empresas que Confiam na SensoriAI</h3>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Building2 className="h-8 w-8 text-muted-foreground" />
                <span className="text-muted-foreground font-semibold">Partner {i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="container py-20 animate-fade-in">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Entre em Contato
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Preencha o formulário e nossa equipe entrará em contato para apresentar a plataforma
          </p>
        </div>
        <ContactForm />
      </section>

      {/* Final CTA Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Comece Hoje Mesmo a Transformar sua Lavoura
          </h2>
          <p className="text-primary-foreground/90 max-w-2xl mx-auto text-lg">
            Teste gratuitamente por 14 dias. Sem necessidade de cartão de crédito.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" variant="secondary" onClick={() => navigate('/auth')}>
              Começar Teste Gratuito
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
              Agendar Demonstração
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 border-t border-border">
        <div className="container py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Leaf className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold text-foreground">SensoriAI</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Inteligência agrícola que multiplica resultados no campo.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Produto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Funcionalidades</a></li>
                <li><a href="#plans" className="hover:text-foreground transition-colors">Planos</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Integrações</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">API</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#about" className="hover:text-foreground transition-colors">Sobre</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contato</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Carreiras</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacidade</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">LGPD</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © 2025 SensoriAI Agro Insight. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
