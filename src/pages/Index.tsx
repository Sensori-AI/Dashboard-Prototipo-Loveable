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
  Building2,
  MapPin,
  Sparkles,
  TrendingUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ContactForm } from "@/components/ContactForm";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "Inteligência Artificial Aplicada",
      description: "Desenvolvemos soluções com IA de ponta que transformam dados em insights estratégicos para seu negócio."
    },
    {
      icon: Cpu,
      title: "Plataformas Escaláveis",
      description: "Sistemas robustos e escaláveis que crescem com sua operação, suportando de startups a grandes corporações."
    },
    {
      icon: Zap,
      title: "Desenvolvimento Ágil",
      description: "Entregamos soluções de software de alta qualidade com metodologias ágeis e tecnologias modernas."
    },
    {
      icon: Database,
      title: "Soluções Multi-Setoriais",
      description: "Experiência em desenvolver sistemas para diversos setores: agronegócio, varejo, logística, saúde e mais."
    }
  ];

  const plans = [
    {
      name: "Projeto Sob Medida",
      price: "Sob consulta",
      period: "",
      description: "Desenvolvimento customizado",
      features: [
        "Levantamento completo de requisitos",
        "Arquitetura sob medida para seu negócio",
        "Desenvolvimento ágil com entregas iterativas",
        "Integração com sistemas existentes",
        "Documentação técnica completa",
        "Garantia e suporte pós-lançamento"
      ]
    },
    {
      name: "Squad Dedicado",
      price: "Sob consulta",
      period: "",
      description: "Time exclusivo para seu projeto",
      featured: true,
      features: [
        "Equipe completa alocada (dev, design, QA)",
        "Metodologia ágil com sprints semanais",
        "Desenvolvimento contínuo e evolutivo",
        "Acesso direto ao time técnico",
        "Infraestrutura e DevOps inclusos",
        "Flexibilidade para mudanças de escopo"
      ]
    },
    {
      name: "Consultoria Técnica",
      price: "Sob consulta",
      period: "",
      description: "Orientação especializada",
      features: [
        "Análise de arquitetura e código existente",
        "Recomendações de IA e tecnologias",
        "Revisão de performance e escalabilidade",
        "Treinamento técnico para equipes",
        "Definição de roadmap tecnológico",
        "Suporte para decisões estratégicas"
      ]
    }
  ];

  const testimonials = [
    {
      name: "Carlos Mendes",
      role: "CTO",
      company: "RetailTech Solutions",
      content: "A SensoriAI desenvolveu nossa plataforma de análise preditiva de vendas. O time é extremamente técnico e entregou uma solução robusta e escalável que processa milhões de transações.",
      avatar: "CM"
    },
    {
      name: "Ana Paula Silva",
      role: "Diretora de TI",
      company: "LogiMove",
      content: "Contratamos o squad dedicado para modernizar nossos sistemas de logística. Em 6 meses tínhamos uma plataforma completa com IA para otimização de rotas. Excelente comunicação e qualidade de código.",
      avatar: "AS"
    },
    {
      name: "Ricardo Santos",
      role: "Fundador",
      company: "AgriSmart",
      content: "Trabalhamos com a SensoriAI desde o MVP até a escala. A expertise em IA aplicada ao agronegócio foi fundamental para chegarmos onde estamos hoje. Parceria de longo prazo garantida.",
      avatar: "RS"
    }
  ];

  const stats = [
    { value: "50+", label: "Projetos Entregues" },
    { value: "20+", label: "Clientes Ativos" },
    { value: "5", label: "Setores Atendidos" },
    { value: "98%", label: "Satisfação dos Clientes" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/favicon.png" alt="SensoriAI" className="h-8 w-8" />
            <span className="text-xl font-bold text-foreground">SensoriAI</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#solutions" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Soluções
            </a>
            <a href="#cases" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Casos de Uso
            </a>
            <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Sobre
            </a>
            <Button onClick={() => navigate('/dashboard')} variant="outline" size="sm">
              Ver Demonstração
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-20 md:py-32 animate-fade-in">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <img src="/favicon.png" alt="SensoriAI Logo" className="h-16 w-16" />
            </div>
            <Badge variant="secondary" className="w-fit">
              <Brain className="h-3 w-3 mr-1" />
              Inteligência Artificial + Desenvolvimento de Software
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
              Transformamos Dados em Soluções Inteligentes
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              Especialistas em desenvolver plataformas escaláveis com Inteligência Artificial aplicada a diversos setores. Criamos sistemas que resolvem problemas reais e crescem com seu negócio.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-base" onClick={() => document.getElementById('cases')?.scrollIntoView({ behavior: 'smooth' })}>
                Ver Nossas Soluções
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-base" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                Falar com Especialista
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 p-8 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-4 w-full">
                <Card className="p-4 space-y-2 hover:scale-105 transition-transform">
                  <Brain className="h-8 w-8 text-primary" />
                  <p className="text-sm font-semibold">IA Avançada</p>
                </Card>
                <Card className="p-4 space-y-2 hover:scale-105 transition-transform">
                  <Cpu className="h-8 w-8 text-secondary" />
                  <p className="text-sm font-semibold">Plataformas</p>
                </Card>
                <Card className="p-4 space-y-2 hover:scale-105 transition-transform">
                  <Zap className="h-8 w-8 text-accent" />
                  <p className="text-sm font-semibold">Escalável</p>
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

      {/* Solutions Section */}
      <section id="solutions" className="container py-20 animate-fade-in">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Nossas Capacidades
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Desenvolvemos soluções completas de software com IA integrada para diversos setores
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

      {/* Use Case Section - Agricultural Platform */}
      <section id="cases" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <Badge variant="secondary" className="mb-4 text-sm px-4 py-1.5">
              <Sparkles className="w-4 h-4 mr-2 inline" />
              Caso de Uso: Agronegócio
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Plataforma de Análise Agrícola com IA
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Uma das nossas soluções: sistema completo de monitoramento e análise para propriedades rurais usando IA e dados de satélite
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
              <Card className="hover-scale border-2 p-6">
                <div className="space-y-3">
                  <MapPin className="w-12 h-12 text-primary" />
                  <h3 className="text-xl font-semibold">Mapas de Vigor</h3>
                  <p className="text-muted-foreground">
                    Análise de saúde das plantas com dados de satélite processados por IA
                  </p>
                </div>
              </Card>

              <Card className="hover-scale border-2 p-6">
                <div className="space-y-3">
                  <Leaf className="w-12 h-12 text-primary" />
                  <h3 className="text-xl font-semibold">Detecção de Daninhas</h3>
                  <p className="text-muted-foreground">
                    IA identifica infestações automaticamente e recomenda ações preventivas
                  </p>
                </div>
              </Card>

              <Card className="hover-scale border-2 p-6">
                <div className="space-y-3">
                  <BarChart3 className="w-12 h-12 text-primary" />
                  <h3 className="text-xl font-semibold">Relatórios Automáticos</h3>
                  <p className="text-muted-foreground">
                    Insights gerados por IA para tomada de decisão estratégica
                  </p>
                </div>
              </Card>

              <Card className="hover-scale border-2 p-6">
                <div className="space-y-3">
                  <TrendingUp className="w-12 h-12 text-primary" />
                  <h3 className="text-xl font-semibold">Redução de Custos</h3>
                  <p className="text-muted-foreground">
                    Até 30% de economia com aplicação inteligente de defensivos
                  </p>
                </div>
              </Card>
            </div>

            <Card className="bg-primary/5 border-primary/20 border-2 p-6 flex flex-col">
              <div className="space-y-4 flex-1">
                <h3 className="text-2xl font-semibold">Ver a Plataforma em Ação</h3>
                <p className="text-base text-muted-foreground">
                  Explore nossa plataforma de análise agrícola e veja como aplicamos IA para resolver problemas reais do agronegócio.
                </p>
              </div>
              <Button size="lg" onClick={() => navigate('/dashboard')} className="w-full text-base mt-6">
                <Sparkles className="mr-2 h-5 w-5" />
                Acessar Demonstração
              </Button>
            </Card>
          </div>

          <div className="bg-muted/50 rounded-lg p-8 border">
            <h3 className="text-xl font-semibold mb-6">Resultados da Solução</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <p className="text-muted-foreground">50.000+ hectares monitorados ativamente</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <p className="text-muted-foreground">Redução média de 28% em custos com defensivos</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <p className="text-muted-foreground">Decisões 3x mais rápidas com análise de IA</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <p className="text-muted-foreground">Plataforma escalável de startup a grandes fazendas</p>
              </div>
            </div>
          </div>
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
                <strong className="text-foreground">Nossa Missão:</strong> Desenvolver soluções tecnológicas de alta qualidade com Inteligência Artificial que resolvem problemas reais e agregam valor aos negócios de nossos clientes.
              </p>
              <p className="text-base">
                <strong className="text-foreground">Nossa Visão:</strong> Ser referência em desenvolvimento de plataformas inteligentes e escaláveis, reconhecida pela excelência técnica e impacto gerado em diversos setores.
              </p>
              <p className="text-base">
                <strong className="text-foreground">Nossos Valores:</strong> Inovação contínua, compromisso com resultados, transparência na comunicação, código de qualidade e foco na experiência do usuário.
              </p>
            </div>
          </div>
          <Card className="p-8 space-y-6">
            <h3 className="text-xl font-semibold text-foreground">Nossa Expertise</h3>
            <div className="space-y-4">
              {[
                "IA e Machine Learning aplicados a negócios",
                "Desenvolvimento de plataformas web escaláveis",
                "Integração de sistemas e APIs",
                "Análise de dados e visualização inteligente",
                "Arquitetura de software moderna e sustentável",
                "Soluções customizadas para diversos setores"
              ].map((expertise, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">{expertise}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-muted/50 py-20 animate-fade-in">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Como Trabalhamos
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Modelos de desenvolvimento adaptados às suas necessidades
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
                <Button className="w-full" variant={plan.featured ? "default" : "outline"} onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                  Solicitar Orçamento
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="container py-20 animate-fade-in">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Stack Tecnológica Moderna
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Utilizamos as melhores tecnologias do mercado para construir soluções robustas e escaláveis
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="p-6 space-y-4 text-center">
            <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mx-auto">
              <Brain className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">IA e Machine Learning</h3>
            <p className="text-sm text-muted-foreground">
              TensorFlow, PyTorch, OpenAI, modelos customizados e pipelines de treinamento
            </p>
          </Card>
          <Card className="p-6 space-y-4 text-center">
            <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mx-auto">
              <Cpu className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Backend e Cloud</h3>
            <p className="text-sm text-muted-foreground">
              Node.js, Python, PostgreSQL, MongoDB, AWS, GCP, arquitetura de microsserviços
            </p>
          </Card>
          <Card className="p-6 space-y-4 text-center">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Frontend Moderno</h3>
            <p className="text-sm text-muted-foreground">
              React, TypeScript, Next.js, Tailwind CSS, componentes reutilizáveis e responsivos
            </p>
          </Card>
        </div>
      </section>

      {/* Security Section */}
      <section className="bg-muted/30 py-16 animate-fade-in">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Lock className="h-12 w-12 text-primary mx-auto" />
            <h2 className="text-3xl font-bold text-foreground">Segurança e Qualidade</h2>
            <p className="text-muted-foreground">
              Seguimos as melhores práticas de segurança e desenvolvimento. Código limpo, testes automatizados, revisão de código, CI/CD, monitoramento contínuo e conformidade com LGPD. Construímos sistemas confiáveis que você pode escalar com tranquilidade.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Badge variant="secondary">Clean Code</Badge>
              <Badge variant="secondary">LGPD Compliant</Badge>
              <Badge variant="secondary">CI/CD</Badge>
              <Badge variant="secondary">Code Review</Badge>
              <Badge variant="secondary">Testes Automatizados</Badge>
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
            Feedback de empresas que confiaram em nossas soluções tecnológicas
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
      <section className="bg-muted/30 py-16 animate-fade-in">
        <div className="container">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-foreground">Setores Atendidos</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Desenvolvemos soluções para empresas de diversos segmentos
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-8">
              {[
                { icon: Leaf, name: "Agronegócio" },
                { icon: Building2, name: "Varejo" },
                { icon: Database, name: "Logística" },
                { icon: Users, name: "Saúde" },
                { icon: BarChart3, name: "Finanças" }
              ].map((sector, i) => (
                <div key={i} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <sector.icon className="h-6 w-6" />
                  <span className="text-sm font-medium">{sector.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="container py-20 animate-fade-in">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Vamos Conversar sobre seu Projeto
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Preencha o formulário e nossa equipe técnica entrará em contato para entender suas necessidades
          </p>
        </div>
        <ContactForm />
      </section>

      {/* Final CTA Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Pronto para Desenvolver sua Próxima Solução?
          </h2>
          <p className="text-primary-foreground/90 max-w-2xl mx-auto text-lg">
            Vamos transformar sua ideia em uma plataforma robusta e escalável com Inteligência Artificial
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" variant="secondary" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
              Falar com Especialista
              <ArrowRight className="ml-2 h-5 w-5" />
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
                <img src="/favicon.png" alt="SensoriAI" className="h-6 w-6" />
                <span className="text-lg font-bold text-foreground">SensoriAI</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Especialistas em IA e desenvolvimento de software escalável para diversos setores.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Soluções</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#solutions" className="hover:text-foreground transition-colors">Nossas Capacidades</a></li>
                <li><a href="#cases" className="hover:text-foreground transition-colors">Casos de Uso</a></li>
                <li><a href="/dashboard" className="hover:text-foreground transition-colors">Demonstração</a></li>
                <li><a href="#contact" className="hover:text-foreground transition-colors">Contato</a></li>
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
              © 2025 SensoriAI. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
