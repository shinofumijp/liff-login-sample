class User < ApplicationRecord
  has_many :auth_identities, dependent: :destroy
end
