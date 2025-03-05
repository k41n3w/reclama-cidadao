require "rails_helper"

RSpec.describe NotificationMailer, type: :mailer do
  describe "status_update" do
    let(:mail) { NotificationMailer.status_update }

    it "renders the headers" do
      expect(mail.subject).to eq("Status update")
      expect(mail.to).to eq(["to@example.org"])
      expect(mail.from).to eq(["from@example.com"])
    end

    it "renders the body" do
      expect(mail.body.encoded).to match("Hi")
    end
  end

  describe "comment_notification" do
    let(:mail) { NotificationMailer.comment_notification }

    it "renders the headers" do
      expect(mail.subject).to eq("Comment notification")
      expect(mail.to).to eq(["to@example.org"])
      expect(mail.from).to eq(["from@example.com"])
    end

    it "renders the body" do
      expect(mail.body.encoded).to match("Hi")
    end
  end

end
