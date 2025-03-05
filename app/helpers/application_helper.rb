module ApplicationHelper
  def status_badge_class(status)
    case status
    when 'open'
      'bg-primary'
    when 'in_analysis'
      'bg-info'
    when 'in_progress'
      'bg-warning'
    when 'resolved'
      'bg-success'
    when 'rejected'
      'bg-danger'
    else
      'bg-secondary'
    end
  end
end