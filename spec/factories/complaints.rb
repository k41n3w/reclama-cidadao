FactoryBot.define do
  factory :complaint do
    title { "MyString" }
    description { "MyText" }
    category { "MyString" }
    status { "MyString" }
    address { "MyString" }
    latitude { 1.5 }
    longitude { 1.5 }
    user { nil }
  end
end
