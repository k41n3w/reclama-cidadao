# Preview all emails at http://localhost:3000/rails/mailers/notification_mailer_mailer
class NotificationMailerPreview < ActionMailer::Preview

  # Preview this email at http://localhost:3000/rails/mailers/notification_mailer_mailer/status_update
  def status_update
    NotificationMailer.status_update
  end

  # Preview this email at http://localhost:3000/rails/mailers/notification_mailer_mailer/comment_notification
  def comment_notification
    NotificationMailer.comment_notification
  end

end
