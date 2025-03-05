ActiveAdmin.register User do
  permit_params :email, :name, :admin, :password, :password_confirmation

  index do
    selectable_column
    id_column
    column :email
    column :name
    column :admin
    column :created_at
    actions
  end

  filter :email
  filter :name
  filter :admin
  filter :created_at

  form do |f|
    f.inputs 'Detalhes do Usuário' do
      f.input :email
      f.input :name
      f.input :admin
      f.input :password
      f.input :password_confirmation
    end
    f.actions
  end

  show do
    attributes_table do
      row :id
      row :email
      row :name
      row :admin
      row :created_at
      row :updated_at
    end

    panel 'Reclamações' do
      table_for user.complaints do
        column :id
        column :title
        column :category
        column :status
        column :created_at
      end
    end
  end
end
