'use strict'
const fs = require("fs")
const Logger = use('Logger')
const PdfDocument = require('pdfkit')
const PdfTable = require('voilab-pdf-table')

class PdfService {

  generatePDF(data, name) {

    let filename = name+".pdf"
    try {
      // create a PDF from PDFKit, and a table from PDFTable
      var pdf = new PdfDocument({
          autoFirstPage: false
        }),
        table = new PdfTable(pdf, {
          topMargin: 100
        });

      pdf.pipe(fs.createWriteStream(filename))

      table
        // add some plugins (here, a 'fit-to-width' for a column)
        .addPlugin(new(require('voilab-pdf-table/plugins/fitcolumn'))({
          column: 'value'
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
            align: 'left',
            width: 100
          },
          {
            id: 'value',
            header: 'VALUE',
          }
        ])
        // add events (here, we draw headers on each new page)
        .onPageAdded(function (tb) {
          tb.addHeader()
        });

      // if no page already exists in your PDF, do not forget to add one
      pdf.addPage()

      const blocknumber = "30513" 
      const date = "2019-5-11 18:18"
      const tx = "0x7914e2ac58a0adc911fe4ecdfbd8a92b3c27bc6c407544e4dee8092b6e0a008e"
      const filehash = "234567876543234567"
      const validation = "12"
      const link = "https://rinkeby.etherscan.io/tx/" + tx
      
      pdf.font('public/fonts/palatino.ttf', 25)
        .text('Hippocrates Passport Certification',{
          align: 'center',
        }, 100, 50)
        .font('public/fonts/palatino.ttf', 13)
        .moveDown()
        .text("Hippocrates certifies that the atached file identified with hash: " + filehash  + " saved in block number " + blocknumber + " of the Ethereum public ledger with the transaction hash: ", {
          width: 412,
          align: 'justify',
          indent: 30,
          height: 300,
          ellipsis: true
        })
        .fillColor('blue')
        .font('public/fonts/palatino.ttf', 13)
        .text(tx,{
          link,
          underline: true
        })
        .moveDown()
        .fillColor('black')
        .font('public/fonts/palatino.ttf', 13)
        .text( "At this moment the transaction was validated as success by " + validation + " blocks. And for the record, Hippocrates issues this Certificate with date " + date + ".",{
          width: 412,
          align: 'justify',
          indent: 30,
          height: 300,
          ellipsis: true
        });

      //}

      pdf.fontSize(11).font('public/fonts/palatino.ttf', 13).moveDown()


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
      Logger.info('PDF GENERATED')
      return  filename
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
