class Auth::LinesController < ApplicationController
  protect_from_forgery with: :null_session

  def verify
    id_token  = params.require(:idToken)
    channel_id = ENV.fetch("LINE_CHANNEL_ID")

    # Verify ID token API を叩く簡易な検証
    resp = Faraday.post(
      "https://api.line.me/oauth2/v2.1/verify",
      { id_token: id_token, client_id: channel_id },
      { 'Content-Type': 'application/x-www-form-urlencoded' },
    )
    return render json: { err: "verify_failed", detail: "Failed to verify id_token" }, status: :unauthorized unless resp.status == 200

    payload = resp.body
    sub  = payload["sub"]
    name = payload["name"]

    attrs = { provider: "line", issuer: "https://access.line.me", audience: channel_id, subject: sub }
    user = AuthIdentity.find_by(**attrs)&.user

    if user.nil?
      ActiveRecord::Base.transaction do
        user = User.create!(display_name: name)
        user.auth_identities.create!(**attrs, connected_at: Time.current, meta: payload.to_json)
      end
    end

    render json: { user_id: user.id, display_name: user.display_name }
  end
end
