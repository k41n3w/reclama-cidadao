class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :lockable

  validates :name, presence: true
  validates :email, presence: true
  
  has_many :complaints, dependent: :destroy
  has_many :comments, dependent: :destroy
  
  def admin?
    admin
  end
end
