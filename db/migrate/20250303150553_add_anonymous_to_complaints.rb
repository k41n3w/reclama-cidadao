class AddAnonymousToComplaints < ActiveRecord::Migration[7.1]
  def change
    add_column :complaints, :anonymous, :boolean, default: false
  end
end
