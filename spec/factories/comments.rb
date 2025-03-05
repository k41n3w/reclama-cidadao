FactoryBot.define do
  factory :comment do
    content { "MyText" }
    user { nil }
    complaint { nil }
  end
end
