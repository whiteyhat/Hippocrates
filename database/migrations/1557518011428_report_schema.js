'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ReportSchema extends Schema {
  up () {
    this.create('reports', (table) => {
      table.increments()
      table.integer('patient_id').unsigned().references('id').inTable('patients').notNullable()
      table.string('condition')
      table.string('year')
      table.text('notes')
      table.timestamps()
    })
  }

  down () {
    this.drop('reports')
  }
}

module.exports = ReportSchema
