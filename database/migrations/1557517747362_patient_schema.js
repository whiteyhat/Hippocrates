'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PatientSchema extends Schema {
  up () {
    this.create('patients', (table) => {
      table.increments()
      table.integer('doctor_id').unsigned().references('id').inTable('users').notNullable()
      table.string('name').notNullable()
      table.string('gender').notNullable()
      table.string('dob').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('patients')
  }
}

module.exports = PatientSchema
