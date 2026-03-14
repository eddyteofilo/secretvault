# Relatório de Análise das Skills de IA

Esta documentação detalha as funções e o propósito de cada uma das Skills de IA (Agentes) encontradas no diretório `Skills`, separando-as em duas categorias: as Skills individuais focadas no DeliveryPro e as Skills que compõem o ecossistema avançado de construção de software (Master AI System Architect).

---

## 🚀 Categoria 1: Skills Focadas no DeliveryPro e Manutenção

Essas skills foram projetadas para auditar, otimizar, proteger e auxiliar diretamente no sistema de delivery (DeliveryPro).

### 1. Master AI System Architect ([master-ai-system-architect.skill](file:///c:/Users/Eddy%20Teofilo/Desktop/Projeto%20desenvolvimento/Delivery-pro--main/Gest-o-de-Delivery/Skills/master-ai-system-architect.skill))
**Função Principal:** Atuar como o arquiteto principal de alto nível do sistema de delivery. É o "cérebro" que coordena decisões arquiteturais.
**Funções Detalhadas:**
- Define a base arquitetural em React (Vite) no frontend e Node.js/Express ou Supabase no backend.
- Garante a adesão a princípios de código limpo (SOLID, DRY) e arquitetura hexagonal/limpa.
- Recomenda a adoção de CI/CD, testes automatizados e containerização (Docker).
- Foca em escalabilidade, permitindo que o sistema agende alto volume de pedidos de múltiplas lojas.
- **Público/Uso:** Chamado quando é necessário tomar decisões fundamentais sobre a estrutura do sistema ou quando se inicia um refatoramento massivo.

### 2. AI Bug Hunter ([ai-bug-hunter.skill](file:///c:/Users/Eddy%20Teofilo/Desktop/Projeto%20desenvolvimento/Delivery-pro--main/Gest-o-de-Delivery/Skills/ai-bug-hunter.skill))
**Função Principal:** Detectar, diagnosticar e propor resoluções para anomalias, erros e falhas em toda a stack (frontend, backend e banco de dados).
**Funções Detalhadas:**
- Examina logs do servidor, console do navegador e dados de APM (Application Performance Monitoring).
- Detecta *memory leaks*, *race conditions*, chamadas de API duplicadas e renders desnecessários no React.
- Isola o problema criando testes de regressão automatizados para evitar reincidência.
- Formula scripts de correção e fornece patchs de código (diffs) detalhados.
- **Público/Uso:** Chamado quando o sistema apresenta travamentos, erros 500 imprevisíveis, lentidão ou comportamento inconsistente na tela.

### 3. AI Delivery Assistant ([ai-delivery-assistant.skill](file:///c:/Users/Eddy%20Teofilo/Desktop/Projeto%20desenvolvimento/Delivery-pro--main/Gest-o-de-Delivery/Skills/ai-delivery-assistant.skill) / Gemini Chatbot)
**Função Principal:** Atuar como um chatbot de IA conversacional especializado no domínio de restaurantes e delivery (Provavelmente a base para o Gemini Bot mencionado no plano).
**Funções Detalhadas:**
- Interage com clientes finais usando PNL (Processamento de Linguagem Natural) para anotar pedidos e responder a dúvidas sobre o cardápio.
- Compreende restrições alimentares, modificações de pratos e intenções de compra.
- Faz up-sell e cross-sell inteligentes (ex: sugerir bebida para acompanhar a pizza).
- Calcula o tempo de entrega baseado no tráfego, volume de pedidos da cozinha e disponibilidade de entregadores.
- **Público/Uso:** Integrado na interface do cliente final (WhatsApp, App ou Site) para automatizar o atendimento.

### 4. Performance Optimizer ([performance-optimizer.skill](file:///c:/Users/Eddy%20Teofilo/Desktop/Projeto%20desenvolvimento/Delivery-pro--main/Gest-o-de-Delivery/Skills/performance-optimizer.skill))
**Função Principal:** Melhorar a velocidade de carregamento, responsividade e eficiência no uso de recursos do sistema.
**Funções Detalhadas:**
- Analisa métricas de Core Web Vitals (LCP, FID, CLS).
- Otimiza consultas (queries) lentas no banco de dados através da criação de índices e normalização/desnormalização estratégica.
- Implementa estratégias avançadas de caching (Redis) para respostas de APIs públicas e listas de produtos.
- Aplica Code Splitting, Lazy Loading e otimização de imagens (WebP) no frontend.
- Identifica "Gargalos" e cria um plano chamado "Quick Wins" (vitórias rápidas).
- **Público/Uso:** Chamado quando o sistema (Dashboard ou App) fica lento para carregar ou quando o banco de dados sofre sob carga alta.

### 5. Security AI Auditor ([security-ai-auditor.skill](file:///c:/Users/Eddy%20Teofilo/Desktop/Projeto%20desenvolvimento/Delivery-pro--main/Gest-o-de-Delivery/Skills/security-ai-auditor.skill))
**Função Principal:** Encontrar e relatar vulnerabilidades de segurança de forma proativa. Um "Pentester" (Hacker Ético) automatizado.
**Funções Detalhadas:**
- Identifica falhas clássicas do OWASP Top 10 (Injeção SQL, XSS, CSRF, DDoS).
- Revisa configurações de CORS (Cross-Origin Resource Sharing) e JWT (JSON Web Tokens) para evitar acesso não autorizado.
- Analisa e protege as configurações do Supabase (RLS - Row Level Security).
- Verifica dependências vulneráveis (via npm audit) e senhas expostas (hardcoded).
- **Público/Uso:** Antes de um grande deploy para produção ou rotineiramente para garantir que os dados dos clientes e restaurantes estão seguros e em conformidade (LGPD/GDPR).

---

## 🛠️ Categoria 2: Ecossistema Modular Avançado de Construção (A Fábrica de Software)

Essas Skills, encontradas diretório `Skills/extracted`, operam em conjunto formando uma "Fábrica de Software" altamente sofisticada e coordenada. Quando você pede para o Orquestrador criar algo, ele gerencia as outras skills como uma equipe de desenvolvimento real.

### 6. System Orchestrator ([system-orchestrator/SKILL.md](file:///c:/Users/Eddy%20Teofilo/Desktop/Projeto%20desenvolvimento/Delivery-pro--main/Gest-o-de-Delivery/Skills/temp_orchestrator_old/system-orchestrator/SKILL.md))
**Função Principal:** Orquestrador Central. É o chefe do projeto. Analisa a ideia, escolhe a arquitetura adequada e coordena as outras IAs.
**Funções Detalhadas:**
- Recebe o pedido do usuário (ex: "quero um sistema de delivery").
- Desenha o Plano da Arquitetura (Macro-visão, Stacks, Autenticação).
- Delega a construção do código para o **System Builder**.
- Pega o código feito e passa para o **System Auditor** revisar.
- Só aprova e finaliza se o Auditor der nota >= 70% de qualidade.
- **Público/Uso:** Deve ser o *ponto de partida* quando o usuário quer gerar qualquer Módulo, API ou Sistema Novo do absoluto zero.

### 7. System Builder ([system-builder/SKILL.md](file:///c:/Users/Eddy%20Teofilo/Desktop/Projeto%20desenvolvimento/Delivery-pro--main/Gest-o-de-Delivery/Skills/extracted/system-builder/system-builder/SKILL.md))
**Função Principal:** O "Pedreiro/Engenheiro de Software". Escreve todo o código funcional seguindo as ordens do Orchestrator.
**Funções Detalhadas:**
- Constroi arquivos físicos na ordem certa: Configuração -> Banco -> Autenticação -> API -> Frontend.
- Cria a estrutura completa de pastas do projeto (Modelos, Controladores, Middlewares, Rotas).
- Segue padrões estritos (ex: validação de dados sempre antes de salvar, envio de token no frontend).
- Devolve código funcional finalizado — **NUNCA DEVE ESCREVER PSEUDOCÓDIGO**.
- **Público/Uso:** É acionado pelo Orchestrator ou pelo Usuário quando se precisa criar as telas, as rotas da API e a lógica base.

### 8. System Auditor ([system-auditor/SKILL.md](file:///c:/Users/Eddy%20Teofilo/Desktop/Projeto%20desenvolvimento/Delivery-pro--main/Gest-o-de-Delivery/Skills/extracted/system-auditor/system-auditor/SKILL.md))
**Função Principal:** O "Controle de Qualidade / Testador QA Automatizado". Verifica minuciosamente cada componente construído.
**Funções Detalhadas:**
- Analisa o Frontend (botões, roteamento, validação de campos).
- Analisa o Backend/API (Respostas HTTP semânticas, try/catch, bloquei contra chamadas sem permissão).
- Inspeciona o Banco de Dados (verificando se o schema tem falhas, tabelas sem chaves primárias ou expondo dados sensíveis acidentalmente).
- Teste de fluxo completo: (Cadastro → Login → Ação Principal).
- Emite um veredito detalhado ("Operacional", "Aprovado com ressalvas" ou "Reprovado").
- **Público/Uso:** Acionado logo depois que um código é escrito para validar sua segurança e corretidão.

### 9. System Fixer ([system-fixer/SKILL.md](file:///c:/Users/Eddy%20Teofilo/Desktop/Projeto%20desenvolvimento/Delivery-pro--main/Gest-o-de-Delivery/Skills/temp_fixer/system-fixer/SKILL.md))
**Função Principal:** O "Mecânico / Debugador Chefe". Resolve definitivamente problemas listados pelo Auditor ou usuário.
**Funções Detalhadas:**
- Lê relatórios que apontam erros (do Auditor) ou logs colados pelo usuário.
- Prioriza falhas que quebram o sistema na inicialização ou login.
- Busca o Arquivo, elabora e aplica o Código de Correção (solução completa ao invés de remendos).
- Cria componentes/middleware que foram "esquecidos" pela equipe.
- **Público/Uso:** Sempre que o System Auditor "Reprovar" o código, o System Fixer é chamado para aplicar correções imediatamente.

### 10. System Knowledge Builder ([system-knowledge-builder/SKILL.md](file:///c:/Users/Eddy%20Teofilo/Desktop/Projeto%20desenvolvimento/Delivery-pro--main/Gest-o-de-Delivery/Skills/extracted/system-knowledge-builder/system-knowledge-builder/SKILL.md))
**Função Principal:** O "Bibliotecário / Memória do Sistema". Ele guarda todos os erros encontrados e e todas as soluções propostas no histórico.
**Funções Detalhadas:**
- Anota todos os problemas resolvidos (*Sintoma -> Causa Raiz -> Solução Aplicada*).
- Fornece respostas em segundos se um erro repetido voltar a aparecer (evitando ter que debuggar do zero novamente).
- Encontra padrões ("Toda vez que mexemos em CORS, a auth quebra").
- Monta Checklists de prevenção para os desenvolvedores.
- **Público/Uso:** Roda constantemente em segundo plano aprendendo com o System Auditor e o System Fixer para não cometer os mesmos erros no futuro.

---

## 💡 Como essas skills trabalham unidas no DeliveryPro?

Se você quiser criar o recurso **"Agendamento de Motoboys"**:
1. Você aciona o **System Orchestrator** pedindo a funcionalidade.
2. O Orchestrator desenha a arquitetura e aciona o **System Builder**.
3. O **System Builder** escreve a API no Node e a tela no React e passa o código.
4. O Orchestrator chama o **System Auditor** para testar. O Auditor descobre que a rota de motoboys está permitindo acessos sem autenticação (bug Crítico!).
5. O Orchestrator recusa o módulo e manda o erro para o **System Fixer**.
6. O **System Fixer** vai lá e injeta o Middleware JWT (correção).
7. Simultaneamente, o **System Knowledge Builder** registra: *"Esquecimento de Auth na rota Motoboy corrigido com pacote JWT"*.
8. O código passa em nova auditoria e é entregue pronto e seguro a você, o usuário.

As outras skills isoladas (Performance, Security, Bug-Hunter) rodam depois que o módulo já foi para a produção para garantir otimizações contínuas e segurança em larga escala.
