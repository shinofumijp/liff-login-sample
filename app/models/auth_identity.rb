class AuthIdentity < ApplicationRecord
  belongs_to :user
  has_secure_password validations: false

  module PROVIDER
    LINE = "line".freeze
    PASSWORD = "password".freeze
  end
end
