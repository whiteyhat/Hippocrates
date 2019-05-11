'use strict'
const fs = require("fs")
const Logger = use('Logger')
const PdfDocument = require('pdfkit')
const PdfTable = require('voilab-pdf-table')

class PdfService {

  generatePDF(data) {
    try {
      // create a PDF from PDFKit, and a table from PDFTable
      var pdf = new PdfDocument({
          autoFirstPage: false
        }),
        table = new PdfTable(pdf, {
          bottomMargin: 30
        });

      pdf.pipe(fs.createWriteStream('passport.pdf'))

      table
        // add some plugins (here, a 'fit-to-width' for a column)
        .addPlugin(new(require('voilab-pdf-table/plugins/fitcolumn'))({
          column: 'title'
        }))
        // set defaults to your columns
        .setColumnsDefaults({
          headerBorder: 'B',
          align: 'right'
        })
        // add table columns
        .addColumns([{
            id: 'title',
            header: 'PATIENT',
            align: 'left'
          },
          {
            id: 'value',
            header: 'VALUE',
            width: 100
          }
        ])
        // add events (here, we draw headers on each new page)
        .onPageAdded(function (tb) {
          tb.addHeader()
        });

      // if no page already exists in your PDF, do not forget to add one
      pdf.addPage()


      // Embed a font, set the font size, and render some text
      pdf.font('public/fonts/palatino.ttf')

      // pdf.text("HIPPOCRATES", {align: 'center'})

      // draw content, by passing data to the addBody method
      table.addBody([{
          title: 'Name',
          value: data.patient.name,
        },
        {
          title: 'DOB',
          value: data.patient.dob,
        },
        {
          title: 'Gender',
          value: data.patient.gender,
        },
        {
          title: '',
          value: '',
        },
        {
          title: 'Condition Name',
          value: data.report.condition,
        },
        {
          title: 'Year',
          value: data.patient.year,
        },
        {
          title: 'Notes',
          value: data.patient.notes,
        },
        {
          title: '',
          value: "",
        },
        {
          title: 'Allergy',
          value: data.allergy.name,
        },
        {
          title: 'Risk',
          value: data.allergy.risk,
        },
        {
          title: 'Notes',
          value: data.allergy.notes,
        },
        {
          title: '',
          value: '',
        },
        {
          title: 'Immunisation',
          value: data.immunisation.name,
        },
        {
          title: 'Year',
          value: data.immunisation.year,
        },
        {
          title: '',
          value: '',
        },
        {
          title: 'Mobility',
          value: data.social.mobility,
        },
        {
          title: 'Eating & Drinking',
          value: data.social.eating,
        },
        {
          title: 'Dressing',
          value: data.social.dressing,
        },
        {
          title: 'Toileting',
          value: data.social.toileting,
        },
        {
          title: 'Washing',
          value: data.social.washing,
        },
        {
          title: 'Notes on functions and activies',
          value: data.social.functions,
        },
        {
          title: 'Notes on behaviour',
          value: data.social.behaviour,
        },
        {
          title: '',
          value: '',
        },
        {
          title: 'Medication',
          value: data.medication.name,
        },
        {
          title: 'Dose',
          value: data.medication.dose,
        },
        {
          title: 'Monday',
          value: data.medication.monday,
        },
        {
          title: 'Tueday',
          value: data.medication.tuesday,
        },
        {
          title: 'Wednesday',
          value: data.medication.wednesday,
        },
        {
          title: 'Thursday',
          value: data.medication.thursday,
        },
        {
          title: 'Friday',
          value: data.medication.friday,
        },
        {
          title: 'Saturday',
          value: data.medication.saturday,
        },
        {
          title: 'Sunday',
          value: data.medication.sunday,
        },
        {
          title: 'Plan Care',
          value: data.medication.plan,
        }
      ]);

      pdf.end()
    } catch (error) {
      Logger.error(error)
    }
  }

  // async getSize() {
  //     try {
  //         const total = await Database.raw('select count(is_pro) as size from satodb.users where is_pro = 1')
  //         return total[0][0].size
  //     }
  //     catch (error) {
  //         Logger.error(error);
  //     }
  // }


}

module.exports = new PdfService()
