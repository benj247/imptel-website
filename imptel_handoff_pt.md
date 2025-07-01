# IMPTEL Website - Documento de Transferência de Projeto

## 🚀 Início Rápido - Executar o Site Localmente

Para visualizar o site com todas as funcionalidades funcionando corretamente (incluindo animações SVG), precisa executar um servidor web local:

### Usando Python (Recomendado):
```bash
# Navegar para o diretório do projeto
cd /mnt/d/Projects/imptel

# Python 3
python -m http.server 8000

# OU Python 2
python -m SimpleHTTPServer 8000
```

Depois abrir `http://localhost:8000` no navegador.

### Métodos Alternativos:
- **Node.js**: `npx http-server -p 8000`
- **VS Code**: Instalar e usar a extensão "Live Server"
- **PHP**: `php -S localhost:8000`

**Por que isto é necessário?** Os navegadores modernos bloqueiam o carregamento de arquivos locais (como SVGs) devido às políticas de segurança CORS. Um servidor local serve arquivos com os cabeçalhos HTTP adequados.

---

## 📋 Visão Geral do Projeto

**IMPTEL** (Instituto Médio Privado de Tecnologia) é um site de instituto de educação técnica com:

- **3 Secções Principais**: Informática, Eletrónica e Telecomunicações, e Informações Gerais (Visitante)
- **Suporte Bilingue**: Português (PT) e Inglês (EN) com alternância dinâmica de idioma
- **Design Moderno**: Estilo baseado em temas com efeitos visuais únicos para cada secção
- **Layout Responsivo**: Design mobile-first com breakpoint personalizado aos 916px

### Estrutura do Site:
```
index.html          - Página inicial com seleção de cursos
informatica.html    - Página do curso de Informática
eletronica.html     - Página de Eletrónica e Telecomunicações
visitante.html      - Informações gerais, sobre, instalações
```

---

## 🎨 Funcionalidades Principais Implementadas

### 1. **Sistema de Idioma Dinâmico**
- Alternância de idioma em tempo real sem recarregar a página
- Traduções armazenadas em `assets/js/translations.js`
- Lida com conteúdo de texto e HTML (para quebras de linha)
- Preferência de idioma guardada no localStorage

### 2. **Sistema de Temas**
- Cada secção tem esquema de cores único e animações:
  - **Informática**: Tema verde com efeito de chuva Matrix
  - **Eletrónica**: Tema azul com caminhos de circuito animados
  - **Visitante**: Tema gradiente roxo com partículas flutuantes

### 3. **Elementos Interativos**
- **Botão Voltar ao Topo**: Botão circular aparece após rolar para além da secção hero
- **Cartões Animados**: Efeitos hover e animações de entrada
- **Contadores de Números**: Estatísticas animadas (anos, alunos, taxa de emprego)
- **Navegação Mobile**: Menu hamburger personalizado com animações suaves

### 4. **Funcionalidades de Design Responsivo**
- Breakpoint personalizado aos 916px para tablet/mobile
- Layouts empilhados para cartões e grelhas no mobile
- Tipografia responsiva com escala
- Elementos de interface amigáveis ao toque

### 5. **Otimizações de Performance**
- Carregamento lazy para imagens
- Eventos de scroll com debounce
- RequestAnimationFrame para animações suaves
- Intersection Observer para animações acionadas por scroll

### 6. **Funcionalidades de Acessibilidade**
- Links de saltar para conteúdo principal
- Etiquetas ARIA em elementos interativos
- Suporte para navegação por teclado
- Controlos de intensidade de animação
- Respeita prefers-reduced-motion

---

## 📁 Estrutura do Projeto

```
imptel/
├── index.html                 # Página inicial
├── informatica.html          # Página de Informática
├── eletronica.html           # Página de Eletrónica
├── visitante.html            # Página de visitante/informações gerais
├── assets/
│   ├── css/
│   │   ├── reset.css        # Reset/normalização CSS
│   │   ├── styles.css       # Estilos principais
│   │   ├── themes.css       # Estilos específicos de tema
│   │   ├── animations.css   # Definições de animação
│   │   └── responsive.css   # Breakpoints responsivos
│   ├── js/
│   │   ├── main.js          # Funcionalidade principal
│   │   ├── utils.js         # Funções utilitárias
│   │   ├── translations.js  # Traduções de idioma
│   │   ├── language-switcher.js    # Lógica de alternância de idioma
│   │   ├── matrix-rain.js          # Efeito Matrix (página Informática)
│   │   ├── circuit-path-electrons-enhanced.js  # Animação de circuito
│   │   ├── visitor-hero-particles.js    # Efeitos de partículas
│   │   └── form-handler.js         # Submissões de formulário
│   └── images/
│       ├── imptellogo.jpg   # Logo do instituto
│       └── circuit-lines.svg # SVG de circuito para eletrónica
```

---

## 🔧 Atualizações e Correções Recentes

### Alterações da Última Sessão:
1. **Breakpoint do Menu Hamburger**: Alterado de 768px para 916px em todos os arquivos
2. **Melhorias Responsivas**:
   - Dimensionamento do conteúdo hero para ecrãs < 415px
   - Cartões do Laboratório de Inovação empilham no mobile
   - Layout responsivo da secção de laboratórios
   - Formulário de newsletter empilha verticalmente no mobile
3. **Correções de Botões**: Corrigido problema de overflow do pseudo-elemento btn-theme
4. **Alinhamento de Cartões**: Alinhados botões de cartão horizontalmente usando flexbox
5. **Cartões Clicáveis**: Tornados cartões seletores inteiramente clicáveis, não apenas botões
6. **Botão Voltar ao Topo**: Adicionado botão circular semi-transparente com seta para cima
7. **Atualizações de Navegação**:
   - Links Home → index.html
   - Sobre/Instalações/Programas/Admissões → secções visitante.html

### Atualizações Anteriores:
- Corrigido sistema de tradução para lidar com conteúdo HTML (para tags <br>)
- Adicionada geração dinâmica de placeholder SVG para imagens em falta
- Implementados controlos de intensidade de animação
- Corrigido comportamento do menu mobile e bloqueio de scroll do body
- Adicionada funcionalidade adequada do alternador de idioma

---

## 🗺️ Instruções de Configuração do Google Maps

A página de visitante (visitante.html) inclui uma integração do Google Maps para mostrar a localização do IMPTEL. Atualmente, está a usar uma chave API placeholder que precisa ser substituída.

### Como Corrigir Erros do Google Maps:

1. **Obter uma Chave API do Google Maps**:
   - Ir para [Google Cloud Console](https://console.cloud.google.com/)
   - Criar um novo projeto (ou selecionar um existente)
   - Navegar para "APIs & Services" → "Library"
   - Procurar e ativar "Maps JavaScript API"
   - Ir para "APIs & Services" → "Credentials"
   - Clicar "Create Credentials" → "API Key"
   - Copiar a nova chave API

2. **Substituir o Placeholder**:
   - Abrir `visitante.html`
   - Encontrar linha ~1090 (perto do final):
   ```html
   <script async defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap&loading=async&libraries=marker"></script>
   ```
   - Substituir `YOUR_API_KEY` pela chave API real

3. **Corrigir o Conflito Style/MapId**:
   - Na função `initMap` (por volta da linha 1041), remover esta linha:
   ```javascript
   mapId: 'IMPTEL_MAP_ID', // Remover esta linha
   ```
   - O mapa usa estilos personalizados que conflituam com mapId

4. **Proteger a Chave API** (Importante!):
   - No Google Cloud Console, ir para as configurações da chave API
   - Em "Application restrictions", selecionar "HTTP referrers"
   - Adicionar o domínio (ex: `https://imptel.ao/*`)
   - Em "API restrictions", selecionar "Restrict key" e escolher apenas "Maps JavaScript API"

### Alternativa: Remover Google Maps
Se não quiser usar Google Maps:
- Comentar a tag script do Google Maps
- Considerar usar alternativas gratuitas como Leaflet.js com OpenStreetMap

---

## ⚠️ Problemas Conhecidos e Melhorias Necessárias

### Alta Prioridade:
1. **Arquitetura de Navegação**: Todos os links de navegação levam para visitante.html - considerar páginas dedicadas
2. **Performance**: Múltiplos arquivos CSS causam bloqueio de renderização - precisa de bundling
3. **SEO**: Faltam meta tags, dados estruturados, sitemap
4. **Formulários**: Sem validação do lado cliente ou tratamento de erros
5. **Acessibilidade**: Alguns contrastes de cor podem falhar nos padrões WCAG

### Prioridade Média:
1. **Modo Escuro**: Sem suporte para tema escuro
2. **Estados de Carregamento**: Sem skeleton loaders ou indicadores de carregamento adequados
3. **Tratamento de Erros**: Sem fallbacks offline ou estados de erro
4. **Otimização de Imagens**: Sem formato WebP ou lazy loading adequado
5. **Estilos de Impressão**: Sem folhas de estilo otimizadas para impressão

### Seria Bom Ter:
1. **Funcionalidades PWA**: Adicionar service worker para suporte offline
2. **Funcionalidade de Pesquisa**: Sem forma de pesquisar cursos ou conteúdo
3. **Elementos Interativos**: Tour virtual, calculadora de cursos, chatbot
4. **Prova Social**: Integração com avaliações, testemunhos
5. **Analytics**: Sem implementação de rastreamento

---

## 🚀 Próximos Passos Recomendados

### Ações Imediatas:
1. **Agrupar Assets**: Combinar e minificar arquivos CSS/JS
2. **Adicionar Meta Tags**: Implementar Open Graph e Twitter Cards
3. **Validação de Formulários**: Adicionar validação do lado cliente com mensagens de erro
4. **Corrigir Navegação**: Criar estrutura de página adequada em vez de secções de página única
5. **Otimizar Imagens**: Converter para WebP, implementar lazy loading adequado

### Melhorias de Arquitetura:
1. **Sistema de Componentes**: Considerar migração para React/Vue/Web Components
2. **Processo de Build**: Configurar Webpack/Vite para otimização de assets
3. **Arquitetura CSS**: Implementar CSS-in-JS ou CSS Modules
4. **Gestão de Estado**: Adicionar gestão de estado adequada para interações complexas
5. **Integração API**: Preparar para integração backend

### Testes e Implementação:
1. **Testes Cross-browser**: Testar em todos os navegadores principais
2. **Auditoria de Performance**: Executar testes Lighthouse
3. **Auditoria de Acessibilidade**: Usar axe DevTools
4. **Configurar CI/CD**: Automatizar testes e implementação
5. **Monitorizar Analytics**: Implementar analytics que respeitam privacidade

---

## 📝 Diretrizes de Desenvolvimento

### Convenções CSS:
- Usar propriedades personalizadas CSS para temas
- Seguir convenção de nomenclatura BEM
- Evitar estilos inline (atualmente precisa de grande refatoração)
- Abordagem mobile-first para media queries

### Diretrizes JavaScript:
- Usar funcionalidades ES6+
- Implementar tratamento de erros adequado
- Adicionar comentários JSDoc para funções
- Manter animações performantes (60fps)

### Fluxo de Trabalho Git:
- Usar branches de funcionalidade
- Escrever mensagens de commit descritivas
- Testar antes de fazer push
- Documentar alterações que quebram compatibilidade

---

## 📞 Contacto e Recursos

### Recursos Úteis:
- [MDN Web Docs](https://developer.mozilla.org/)
- [Can I Use](https://caniuse.com/) - Compatibilidade de navegadores
- [Diretrizes WCAG](https://www.w3.org/WAI/WCAG21/quickref/)
- [Google Lighthouse](https://developers.google.com/web/tools/lighthouse)

### Paleta de Cores:
- **Informática (Verde)**: #00FF41, #008F11, #32CD32
- **Eletrónica (Azul)**: #1E3A8A, #1E40AF, #3B82F6
- **Visitante (Roxo)**: #6366F1, #64748B, #8B5CF6

---

## 🎯 Notas Finais

Este projeto é uma base sólida para um site moderno de instituição educativa. O suporte bilingue, sistema de temas e design responsivo estão bem implementados. No entanto, há dívida técnica significativa com estilos inline e decisões arquiteturais que devem ser abordadas para manutenibilidade a longo prazo.

A prioridade imediata deve ser melhorar a performance (bundling de assets, lazy loading) e corrigir a arquitetura de navegação. Depois disso, focar em adicionar funcionalidades modernas como suporte PWA, SEO adequado e elementos interativos que melhorem a experiência do utilizador.

Boa sorte com o projeto! 🚀