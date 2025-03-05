# Criar usuário administrador
User.create!(
  name: 'Administrador',
  email: 'admin@exemplo.com',
  password: 'password',
  admin: true
)

# Criar usuário comum
User.create!(
  name: 'Usuário de Teste',
  email: 'usuario@exemplo.com',
  password: 'password',
  admin: false
)
