import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class AuthenticatorUserValidator {
  public schema = schema.create({
    email: schema.string({}, [rules.email()]),
    password: schema.string(),
  })
}
