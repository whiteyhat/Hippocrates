'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MedicationSchema extends Schema {
  up () {
    this.create('medications', (table) => {
      table.increments()
      table.integer('patient_id').unsigned().references('id').inTable('patients').notNullable()
      table.string('medication').notNullable()
      table.string('dose').notNullable()
      table.boolean('monday').notNullable().defaultTo(false)
      table.boolean('tuesday').notNullable().defaultTo(false)
      table.boolean('wednesday').notNullable().defaultTo(false)
      table.boolean('thursday').notNullable().defaultTo(false)
      table.boolean('friday').notNullable().defaultTo(false)
      table.boolean('saturday').notNullable().defaultTo(false)
      table.boolean('sunday').notNullable().defaultTo(false)
      table.text('description').notNullable()

      table.timestamps()
    })
  }

  down () {
    this.drop('medications')
  }
}

module.exports = MedicationSchema
