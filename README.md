# Prisma ORM - Projeto Prático

Projeto de atividade prática implementando Prisma.js com PostgreSQL em container Docker, seguindo os padrões profissionais de desenvolvimento.

## 📋 Estrutura do Projeto

```
├── src/
│   └── index.ts                 # Exemplos de uso do Prisma
├── prisma/
│   ├── schema.prisma            # Schema com modelos Course e Module
│   └── seed.ts                  # Script para popular banco com dados
├── docker-compose.yml           # Configuração PostgreSQL
├── .env.example                 # Variáveis de ambiente exemplo
├── package.json                 # Dependências
├── tsconfig.json               # Configuração TypeScript
└── README.md                   # Este arquivo
```

## 🛠️ Pré-requisitos

- Node.js >= 18.x
- Docker e Docker Compose
- npm ou yarn

## 🚀 Como Iniciar

### 1. Clonar o repositório

```bash
git clone <seu-repositorio>
cd prisma-orm-project
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

### 4. Iniciar PostgreSQL com Docker

```bash
docker-compose up -d
```

Verificar se o container está rodando:
```bash
docker ps
```

### 5. Executar migrations do Prisma

```bash
npm run db:migrate
```

### 6. Popular banco de dados com seed

```bash
npm run db:seed
```

### 7. Executar exemplos

```bash
npm run dev
```

## 📝 Comandos Disponíveis

- `npm run dev` - Executar exemplos com ts-node
- `npm run build` - Compilar TypeScript para JavaScript
- `npm start` - Executar projeto compilado
- `npm run db:push` - Sincronizar schema com banco (sem migrations)
- `npm run db:migrate` - Criar e executar migration
- `npm run db:migrate:deploy` - Executar migrations em produção
- `npm run db:seed` - Popular banco com dados de exemplo
- `npm run db:studio` - Abrir Prisma Studio (GUI)

## 🗄️ Modelos de Dados

### Course (Curso)
- `id`: Identificador único (CUID)
- `title`: Título do curso
- `description`: Descrição (opcional)
- `code`: Código único do curso
- `credits`: Créditos (padrão: 4)
- `duration`: Duração em horas
- `professor`: Nome do professor
- `semester`: Semestre (ex: 2026.1)
- `status`: Ativo/Inativo (padrão: true)
- `modules`: Relação 1:N com módulos
- `createdAt`: Data de criação
- `updatedAt`: Data de atualização

### Module (Módulo)
- `id`: Identificador único (CUID)
- `title`: Título do módulo
- `description`: Descrição (opcional)
- `order`: Ordem do módulo no curso
- `duration`: Duração em minutos
- `content`: Conteúdo do módulo (opcional)
- `videoUrl`: URL do vídeo (opcional)
- `courseId`: FK para Course
- `course`: Relação 1:N inversa com Course
- `createdAt`: Data de criação
- `updatedAt`: Data de atualização

## 🔍 Exemplos de Uso

### Buscar todos os cursos com módulos

```typescript
const courses = await prisma.course.findMany({
  include: {
    modules: true,
  },
});
```

### Buscar curso por código

```typescript
const course = await prisma.course.findUnique({
  where: { code: 'DEV-WEB-001' },
  include: {
    modules: {
      orderBy: { order: 'asc' },
    },
  },
});
```

### Contar módulos de um curso

```typescript
const count = await prisma.module.count({
  where: { courseId: courseId },
});
```

### Agregar dados

```typescript
const stats = await prisma.course.aggregate({
  _sum: { duration: true, credits: true },
  _avg: { credits: true },
  _count: true,
});
```

## 🐳 Docker Compose

O arquivo `docker-compose.yml` configura:

- **Imagem**: PostgreSQL 16 Alpine (leve e rápido)
- **Container**: `prisma_postgres_db`
- **Porta**: 5432
- **Credenciais padrão**:
  - Usuário: `prisma`
  - Senha: `prisma123`
  - Database: `prisma_db`
- **Volume**: Persistência de dados em `postgres_data`
- **Health Check**: Verifica disponibilidade do banco

### Gerenciar container

```bash
# Iniciar
docker-compose up -d

# Parar
docker-compose down

# Ver logs
docker-compose logs -f postgres

# Remover volumes (CUIDADO - apaga dados!)
docker-compose down -v
```

## 📊 Prisma Studio

Visualizar e editar dados via interface gráfica:

```bash
npm run db:studio
```

Abre em `http://localhost:5555`

## ⚠️ Troubleshooting

### Erro de conexão com banco

1. Verificar se Docker está rodando: `docker ps`
2. Verificar variáveis de ambiente em `.env`
3. Aguardar health check do container passar
4. Ver logs: `docker-compose logs postgres`

### Migration falha

1. Deletar arquivo `.env` local e copiar de `.env.example`
2. Resetar banco: `npm run db:migrate -- --reset`
3. Re-executar seed: `npm run db:seed`

### Porta 5432 já em uso

Mudar porta em `docker-compose.yml` (ex: 5433:5432) e atualizar `DATABASE_URL` em `.env`

---

## 📝 Respostas do Fórum

### 1. Principais dificuldades encontradas

As principais dificuldades no processo foram:

1. **Configuração inicial**: Sincronizar versões do Prisma, PostgreSQL e drivers
2. **Variáveis de ambiente**: Garantir que DATABASE_URL fosse parseada corretamente
3. **Migrations**: Compreender quando usar `db push` vs `migrate` (push é para prototipagem, migrate para produção)
4. **Docker networking**: Conectar aplicação local com container PostgreSQL na porta correta
5. **Relacionamentos**: Definir corretamente relações 1:N e cascatas de deleção (onDelete: Cascade)
6. **Type Safety**: Configurar TypeScript strictamente sem sacrificar produtividade

**Como foram resolvidas**:
- Documentação oficial do Prisma é excelente
- `prisma studio` ajuda visualizar estrutura
- Seed file facilita testes repetiveis
- `.env.example` evita variações entre ambientes

### 2. Importância do Prisma no desenvolvimento de software

O Prisma é crucial por múltiplas razões:

#### **Type Safety**
- Geração automática de tipos TypeScript baseado no schema
- Autocomplete preciso no editor
- Erros em tempo de compilação vs runtime

#### **Abstração de SQL**
- Queries intuitivas e type-safe
- Sem strings SQL espalhadas no código
- Reduz SQL injection
- Mudanças de banco sem refatorar queries

#### **Developer Experience**
- Migrations automáticas com histórico
- Prisma Studio para visualizar dados
- Seed file para testes reproduziveis
- Documentação excepcional

#### **Produtividade**
- Menos código boilerplate vs SQL puro
- Rápida prototipagem e iteração
- Relacionamentos gerenciados automaticamente

#### **Manutenibilidade**
- Código mais limpo e legível
- Refatoração segura com type checking
- Menos bugs relacionados a tipos
- Facilita onboarding de novos devs

#### **Performance**
- Query optimization automática
- Lazy loading e eager loading explícitos
- Indexação gerenciada via schema

#### **Escalabilidade**
- Suporta múltiplos bancos: PostgreSQL, MySQL, SQLite, MongoDB
- Fácil migração entre bancos
- Prisma Data Proxy para edge functions

---

## 📄 Licença

MIT

## 👨‍💻 Autor

Desenvolvido como atividade prática de ORM com Prisma.js

---

**Última atualização**: 2026-09-25
