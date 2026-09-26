# ⚡ Quick Start

Execute estes comandos em ordem:

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar PostgreSQL
docker-compose up -d

# 3. Executar migrations
npm run db:migrate

# 4. Popular banco com dados
npm run db:seed

# 5. Executar exemplos
npm run dev
```

## Próximos Passos

- Visualizar dados: `npm run db:studio`
- Compilar para produção: `npm run build`
- Parar Docker: `docker-compose down`

Pronto! 🚀
