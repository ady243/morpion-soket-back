import { Model } from "objection"


class User extends Model {
  static tableName = "users"

  static get jsonSchema() {
    return {
      type: "object",
      required: [
        "fullName",
        "email",
        "passwordHash",
        "passwordSalt",
      ],

      properties: {
        id: { type: "integer" },
        fullName: { type: "string", minLength: 1, maxLength: 255 },
        email: { type: "string", minLength: 1, maxLength: 255 },
        validateToken: { type: "string" },
        passwordHash: { type: "string" },
        passwordSalt: { type: "string" },
      },
    }
  }

  get isActive() {
    return this.validateToken === null
  }

  $formatJson(json) {
    json = super.$formatJson(json)
    delete json.passwordHash
    delete json.passwordSalt
    return json
  }
}

export default User