class CreateAuthIdentities < ActiveRecord::Migration[8.0]
  def change
    create_table :auth_identities do |t|
      t.references :user, null: false, foreign_key: true
      t.string :provider, null: false, limit: 127
      t.string :issuer, null: false, limit: 127
      t.string :audience, null: false
      t.string :subject, null: false
      t.string :password_digest
      t.timestamp :connected_at
      t.timestamp :last_login_at
      t.text :meta, null: false

      t.timestamps
    end
    add_index :auth_identities, [:provider, :issuer, :audience, :subject], unique: true, name: 'idx_auth_ids_provider_iss_aud_sub'
  end
end
