'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SocialSchema extends Schema {
  up () {
    this.create('socials', (table) => {
      table.increments()
      table.integer('patient_id').unsigned().references('id').inTable('patients').notNullable()
      table.string('mobility').notNullable()
      table.string('eating').notNullable()
      table.string('dressing').notNullable()
      table.string('washing').notNullable()
      table.string('toileting').notNullable()
      table.string('functions')
      table.string('behaviour')
      table.timestamps()
    })
  }

  down () {
    this.drop('socials')
  }
}

module.exports = SocialSchema
