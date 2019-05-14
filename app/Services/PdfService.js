'use strict'
const fs = require("fs")
const Logger = use('Logger')
const PdfDocument = require('pdfkit')
const PdfTable = require('voilab-pdf-table')
const sudo = require('sudo-js');

const Env = use('Env')
class PdfService {

  autoDeletePdf(path){
    setTimeout(function(){
        
      sudo.setPassword(Env.get('SUDO_PASSWORD'))
      const command = ['rm', '-rf', "public/temp/"+path];
      sudo.exec(command, function(err, pid, result) {
      });
    }, 100000);
  }

  generatePDF(data, name) {

    let filename = "public/temp/" + name + ".pdf"
    try {
      let pass = ""
      if (data.password != undefined) {
        pass = data.password
      }
      // create a PDF from PDFKit, and a table from PDFTable
      var pdf = new PdfDocument({
          autoFirstPage: false,
          userPassword: pass,
          ownerPassword: pass,
          permissions: {
            annotating: true,
            copying: false,
            modifying: false,
            printing: "highResolution"
          }
         
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

      if (data.blockchain) {
        const validation = 6
        const link = "https://rinkeby.etherscan.io/tx/" + data.blockchain.txid
        const walletLink = "https://rinkeby.etherscan.io/tx/" + data.blockchain.address
        const ipfsLink = "https://ipfs.io/ipfs/" + data.blockchain.filehash


        pdf
        .image('public/img/logo.png', 250, 60, {
          align: 'center',
          scale: 0.25
        })
        .moveDown()
        .font('public/fonts/bold.ttf', 25)
        .text('Hippocrates Passport Certification',{
          align: 'center',
        }, 170, 50)
        .font('public/fonts/roboto.ttf', 13)
        .moveDown()
        .text("Hippocrates certifies that the atached file identified with hash: ", {
          width: 470,
          align: 'justify',
          indent: 30,
          height: 300,
          ellipsis: true
        })
        .fillColor('blue')
        .font('public/fonts/roboto.ttf', 13)
        .text(data.blockchain.filehash,{
          link: ipfsLink,
          underline: true
        })
        .fillColor('black')
        .font('public/fonts/roboto.ttf', 13)
        .text("saved in block number " + data.blockchain.blockNumber + " of the Ethereum Public Ledger with the following transaction hash: ", {
          width: 470,
          align: 'justify',
          indent: 30,
          height: 300,
          ellipsis: true
        })
        .fillColor('blue')
        .font('public/fonts/roboto.ttf', 13)
        .text(data.blockchain.txid,{
          link,
          underline: true
        })
        .moveDown()
        .fillColor('black')
        .font('public/fonts/roboto.ttf', 13)
        .text( "At this moment the transaction was validated as success by " + validation + " blocks. And for the record, Hippocrates issues this certificate with date " + this.formatDate(new Date) + ".",{
          width: 470,
          align: 'justify',
          indent: 30,
          height: 300,
          ellipsis: true
        })
        .moveDown()
        .font('public/fonts/bold.ttf', 19)
        .text( "Passport Emitter",{
          width: 470,
          align: 'center',
          indent: 30,
          height: 300,
          ellipsis: true
        })
        .moveDown()
        .font('public/fonts/roboto.ttf', 13)
        .text( "This medical passport has been emitted by " + data.doctor.name + ", " + data.doctor.role + " at the " + data.doctor.clinic + ". This institution is located at " + data.doctor.clinicAddress + " and can be reachable via email ("+data.doctor.email+") or phone ("+data.doctor.phone+"). Hippocrates certifies that the Declaration Terms represented in the next parargraph have been signed digitally using the following Ethereum wallet: ",{
          width: 470,
          align: 'justify',
          indent: 30,
          height: 300,
          ellipsis: true
        })
        .fillColor('blue')
        .font('public/fonts/roboto.ttf', 13)
        .text(data.blockchain.address,{
          link: walletLink,
          underline: true
        })
        .fillColor('black')
        .font('public/fonts/roboto.ttf', 13)
        .text( " and with the signature hash: ",{
          width: 470,
          align: 'justify',
          indent: 30,
          height: 300,
          ellipsis: true
        })
        .fillColor('blue')
        .font('public/fonts/roboto.ttf', 13)
        .text(data.blockchain.signature,{
          link: "https://etherscan.io/verifySig",
          underline: true
        })
        .moveDown()
        .fillColor('black')
        .font('public/fonts/bold.ttf', 19)
        .text( "Passport Emitter Declaration",{
          width: 470,
          align: 'center',
          indent: 30,
          height: 300,
          ellipsis: true
        })
        .moveDown()
        .font('public/fonts/italic.ttf', 11)
        .text( data.blockchain.message,{
          width: 470,
          align: 'justify',
          indent: 30,
          height: 300,
          ellipsis: true
        })
        .font('public/fonts/italic.ttf', 13)
        .moveDown()

      }

      pdf.fontSize(11).font('public/fonts/roboto.ttf', 13).moveDown()


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

      if (data.blockchain) {
        return  name+".pdf"
      }
      
      return  filename
    } catch (error) {
      Logger.error(error)
    }
  }

   formatDate(date) {
    var monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];

    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return day + ' of ' + monthNames[monthIndex] + ' of ' + year + ' at ' + hours + ':' + minutes + ':' + seconds;
  }



}

module.exports = new PdfService()
