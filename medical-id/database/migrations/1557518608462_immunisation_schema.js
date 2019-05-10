'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ImmunisationSchema extends Schema {
  up () {
    this.create('immunisations', (table) => {
      table.increments()
      table.integer('patient_id').unsigned().references('id').inTable('patients').notNullable()
      table.string('name').notNullable()
      table.string('date').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('immunisations')
  }
}

module.exports = ImmunisationSchema
