'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AllergySchema extends Schema {
  up () {
    this.create('allergies', (table) => {
      table.increments()
      table.integer('patient_id').unsigned().references('id').inTable('patients').notNullable()
      table.string('allergy').notNullable()
      table.boolean('risk').notNullable()
      table.string('notes')
      table.timestamps()
    })
  }

  down () {
    this.drop('allergies')
  }
}

module.exports = AllergySchema
