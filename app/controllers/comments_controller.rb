class CommentsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_complaint

  def create
    @comment = @complaint.comments.new(comment_params)
    @comment.user = current_user

    if @comment.save
      # Enviar notificação por email se o comentário for de um administrador
      if current_user.admin? && current_user != @complaint.user
        NotificationMailer.comment_notification(@comment).deliver_later
      end
      
      redirect_to @complaint, notice: 'Comentário adicionado com sucesso.'
    else
      redirect_to @complaint, alert: 'Erro ao adicionar comentário.'
    end
  end

  def destroy
    @comment = @complaint.comments.find(params[:id])
    
    if current_user.admin? || current_user == @comment.user
      @comment.destroy
      redirect_to @complaint, notice: 'Comentário excluído com sucesso.'
    else
      redirect_to @complaint, alert: 'Você não tem permissão para excluir este comentário.'
    end
  end

  private

  def set_complaint
    @complaint = Complaint.find(params[:complaint_id])
  end

  def comment_params
    params.require(:comment).permit(:content)
  end
end
