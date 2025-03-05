class ComplaintsController < ApplicationController
  before_action :authenticate_user!, except: [:index, :show]
  before_action :set_complaint, only: [:show, :edit, :update, :destroy]
  before_action :authorize_complaint, only: [:edit, :update, :destroy]

  def index
    @complaints = Complaint.all
    @complaints = @complaints.by_status(params[:status]) if params[:status].present?
    @complaints = @complaints.by_category(params[:category]) if params[:category].present?
    @complaints = @complaints.by_anonymous(params[:anonymous]) if params[:anonymous].present?
    @complaints = @complaints.where(user_id: params[:user_id]) if params[:user_id].present?
    @complaints = @complaints.page(params[:page]).per(10)
  end

  def show
    @comment = Comment.new
    @comments = @complaint.comments.includes(:user).page(params[:page]).per(5)
  end

  def new
    @complaint = Complaint.new
  end

  def create
    @complaint = current_user.complaints.new(complaint_params)
    @complaint.status = 'open' # Status inicial: Aberta

    if @complaint.save
      redirect_to @complaint, notice: 'Reclamação registrada com sucesso.'
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
  end

  def update
    old_status = @complaint.status
    
    if @complaint.update(complaint_params)
      # Enviar email de notificação se o status foi alterado
      if old_status != @complaint.status
        NotificationMailer.status_update(@complaint).deliver_later
      end
      
      redirect_to @complaint, notice: 'Reclamação atualizada com sucesso.'
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @complaint.destroy
    redirect_to complaints_path, notice: 'Reclamação excluída com sucesso.'
  end

  private

  def set_complaint
    @complaint = Complaint.find(params[:id])
  end

  def authorize_complaint
    unless current_user.admin? || current_user == @complaint.user
      redirect_to complaints_path, alert: 'Você não tem permissão para realizar esta ação.'
    end
  end

  def complaint_params
    if current_user.admin?
      params.require(:complaint).permit(:title, :description, :category, :status, :address, :latitude, :longitude, :anonymous)
    else
      params.require(:complaint).permit(:title, :description, :category, :address, :latitude, :longitude, :anonymous)
    end
  end
end