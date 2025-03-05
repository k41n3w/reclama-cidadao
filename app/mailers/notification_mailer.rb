class NotificationMailer < ApplicationMailer
  default from: 'notificacoes@reclamacidadao.com.br'

  def status_update(complaint)
    @complaint = complaint
    @user = complaint.user
    @url = complaint_url(@complaint)
    
    mail(to: @user.email, subject: 'Atualização de Status da sua Reclamação')
  end

  def comment_notification(comment)
    @comment = comment
    @complaint = comment.complaint
    @user = @complaint.user
    @url = complaint_url(@complaint)
    
    mail(to: @user.email, subject: 'Novo Comentário na sua Reclamação')
  end
end
