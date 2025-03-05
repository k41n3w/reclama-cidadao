class Comment < ApplicationRecord
  belongs_to :user
  belongs_to :complaint
  
  validates :content, presence: true
  
  # Ordenar comentários por data de criação (mais recentes primeiro)
  default_scope { order(created_at: :desc) }
end
