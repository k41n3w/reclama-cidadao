# frozen_string_literal: true

# Use this setup block to configure all options available in SimpleForm.
SimpleForm.setup do |config|
  # Custom wrappers for input types
  config.wrappers :custom_boolean, tag: 'div', class: 'form-check', error_class: 'form-group-invalid', valid_class: 'form-group-valid' do |b|
    b.use :html5
    b.optional :readonly
    b.use :input, class: 'form-check-input', error_class: 'is-invalid', valid_class: 'is-valid'
    b.use :label, class: 'form-check-label'
    b.use :hint, wrap_with: { tag: 'small', class: 'form-text text-muted' }
    b.use :error, wrap_with: { tag: 'div', class: 'invalid-feedback' }
  end
end
