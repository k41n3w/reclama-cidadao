# Sistema de Reclamações Urbanas - Reclama Cidadão

Este é um sistema para registro e acompanhamento de reclamações urbanas, permitindo que moradores reportem problemas na cidade e que órgãos públicos gerenciem essas reclamações.

## Tecnologias Utilizadas

- Ruby 3.2.2
- Rails 7.1.3
- PostgreSQL
- Docker e Docker Compose
- Devise (autenticação)
- Active Admin (interface administrativa)
- Bootstrap (interface de usuário)
- Leaflet.js (mapas interativos)

## Requisitos Funcionais

### 1. Cadastro e Autenticação de Usuários
- Cadastro de moradores com nome, e-mail e senha
- Autenticação via Devise
- Recuperação de senha via e-mail
- Diferenciação entre usuários comuns (moradores) e administradores (órgãos públicos)

### 2. Registro de Reclamações
- Registro de reclamações com título, descrição, categoria, localização e imagens
- Validação de campos obrigatórios
- Prevenção de reclamações duplicadas
- Integração com mapas para seleção de localização

### 3. Acompanhamento e Gerenciamento de Reclamações
- Visualização de reclamações próprias
- Atualização de status (Aberta, Em Análise, Em Atendimento, Resolvida, Rejeitada)
- Registro de mudanças de status com data e hora
- Notificação de usuários sobre mudanças

### 4. Interface Administrativa
- Visualização de todas as reclamações
- Filtros por status, categoria, localização e data
- Atualização de status e feedback aos usuários
- Gerenciamento de usuários

### 5. Listagem e Filtro de Reclamações
- Lista pública de reclamações
- Busca e filtragem por categoria, status, localização e período
- Paginação para melhor performance

### 6. Interação e Feedback
- Comentários em reclamações
- Mensagens da administração
- Moderação de comentários

### 7. Notificações e Atualizações
- Notificações por e-mail sobre atualizações de status e comentários

### 8. Segurança e Autenticação
- Autenticação segura com JWT
- Armazenamento seguro de informações sensíveis
- Proteção contra CSRF e SQL Injection
- Limitação de tentativas de login

## Configuração do Ambiente de Desenvolvimento

### Pré-requisitos
- Docker
- Docker Compose

### Configuração Inicial

1. Clone o repositório:
```bash
git clone https://github.com/caio-ramos-smartfit/reclama-cidadao.git
cd reclama-cidadao
```

2. Inicie os containers Docker:
```bash
docker-compose up -d
```

3. Em outro terminal, crie o banco de dados e execute as migrações:
```bash
docker-compose exec web rails db:create db:migrate
```

4. Para criar dados iniciais (opcional):
```bash
docker-compose exec web rails db:seed
```

5. Acesse a aplicação em seu navegador:
```
http://localhost:3000
```

### Comandos Úteis

- Para acessar o console Rails:
```bash
docker-compose exec web rails console
```

- Para executar testes:
```bash
docker-compose exec web rspec
```

- Para adicionar novas gems:
  1. Adicione a gem ao Gemfile
  2. Execute:
  ```bash
  docker-compose exec web bundle install
  ```

- Para reiniciar a aplicação após alterações:
```bash
docker-compose restart web
```

### Usuários de Teste

Após executar o seed, os seguintes usuários estarão disponíveis:

- Administrador:
  - Email: admin@exemplo.com
  - Senha: password

- Usuário comum:
  - Email: usuario@exemplo.com
  - Senha: password

## Estrutura do Projeto

- `app/models`: Modelos da aplicação (User, Complaint, Comment)
- `app/controllers`: Controladores para gerenciar as requisições
- `app/views`: Views para renderização das páginas
- `app/admin`: Configurações do Active Admin
- `app/mailers`: Configurações de envio de e-mails
- `config`: Arquivos de configuração da aplicação
- `db`: Migrações e seeds para o banco de dados
- `public`: Arquivos estáticos acessíveis publicamente
- `spec`: Testes automatizados

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -am 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Crie um novo Pull Request
