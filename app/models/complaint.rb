class Complaint < ApplicationRecord
  belongs_to :user
  has_many :comments, dependent: :destroy
  
  validates :title, :description, :category, :status, :address, presence: true
  validates :latitude, :longitude, presence: true, numericality: true
  
  # Validação para evitar reclamações duplicadas no mesmo local
  validates :title, uniqueness: { scope: [:latitude, :longitude, :user_id], 
                                 message: 'Já existe uma reclamação similar neste local' }
  
  # Status possíveis
  enum status: {
    open: 'Aberta',
    analyzing: 'Em Análise',
    in_progress: 'Em Atendimento',
    resolved: 'Resolvida',
    rejected: 'Rejeitada'
  }
  
  # Categorias possíveis
  enum category: {
    infrastructure: 'Infraestrutura',
    lighting: 'Iluminação',
    sanitation: 'Saneamento',
    security: 'Segurança',
    other: 'Outros'
  }
  
  # Escopo para filtrar reclamações por status
  scope :by_status, ->(status) { where(status: status) if status.present? }
  
  # Escopo para filtrar reclamações por categoria
  scope :by_category, ->(category) { where(category: category) if category.present? }
  
  # Escopo para filtrar reclamações por período
  scope :by_period, ->(start_date, end_date) {
    where('created_at >= ? AND created_at <= ?', start_date, end_date) if start_date.present? && end_date.present?
  }
  
  # Escopo para filtrar reclamações por status anônimo
  scope :by_anonymous, ->(anonymous) { where(anonymous: anonymous) if anonymous.present? }
  
  # Método para exibir o nome do usuário respeitando o anonimato
  def user_display_name
    anonymous? ? "Anônimo" : user.name
  end
end