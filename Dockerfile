FROM ruby:3.2.2

# Instalar dependências
RUN apt-get update -qq && apt-get install -y nodejs postgresql-client

# Configurar diretório de trabalho
WORKDIR /rails

# Instalar gems
COPY Gemfile Gemfile.lock ./
RUN bundle install

# Copiar o restante do código
COPY . .

# Adicionar um script para iniciar o servidor
COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]
EXPOSE 3000

# Iniciar o servidor Rails
CMD ["rails", "server", "-b", "0.0.0.0"]
