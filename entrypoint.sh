#!/bin/bash
set -e

# Remove um server.pid para o Rails caso exista
rm -f /app/tmp/pids/server.pid

# Executar o comando passado para o container
exec "$@"
