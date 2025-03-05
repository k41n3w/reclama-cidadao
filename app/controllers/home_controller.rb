class HomeController < ApplicationController
  def index
    # Buscar todas as reclamações com coordenadas válidas
    @complaints = Complaint.where.not(latitude: nil, longitude: nil)
                         .order(created_at: :desc)
                         
    respond_to do |format|
      format.html # Renderiza a view padrão
      format.json { render json: { complaints: @complaints.as_json(only: [:id, :title, :description, :category, :status, :latitude, :longitude, :address]) } }
    end
  end
end