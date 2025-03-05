Rails.application.routes.draw do
  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)
  
  devise_for :users
  
  resources :complaints do
    resources :comments, only: [:create, :destroy]
  end
  
  get 'home/index'
  
  # Definir a rota raiz
  root to: 'home#index'
end
