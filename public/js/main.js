var Web3 = require('web3');
  var patient, report, allergy, immunisation, social, medication = null
  let provider = null;

  const address = '0xb84b12e953f5bcf01b05f926728e855f2d4a67a9'
//use the ABI from your contract
const abi = [{
    "constant": true,
    "inputs": [],
    "name": "getHash",
    "outputs": [{
      "name": "x",
      "type": "string"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [{
      "name": "x",
      "type": "string"
    }],
    "name": "sendHash",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
]
  $(document).ready(  function () {

    //Initialize tooltips
    $('.nav-tabs > li a[title]').tooltip();

    //Wizard
    $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {

      var $target = $(e.target);

      if ($target.parent().hasClass('disabled')) {
        return false;
      }
    });

    $(".next-step").click(function (e) {

      var $active = $('.wizard .nav-tabs li.active');
      $active.next().removeClass('disabled');
      nextTab($active);

    });
    $(".prev-step").click(function (e) {

      var $active = $('.wizard .nav-tabs li.active');
      prevTab($active);

    });
  });

  function nextTab(elem) {
    $(elem).next().find('a[data-toggle="tab"]').click();
  }

  function prevTab(elem) {
    $(elem).prev().find('a[data-toggle="tab"]').click();
  }


  $("#save1").on('click', async function () {
// Checking if Web3 has been injected by the browser (Mist/MetaMask)

if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
  var contract = new web3.eth.Contract(abi, address);
    const accounts = await provider.web3.getAccounts();

   contract.methods.sendHash("asx").send({
    from: accounts[0]
  }, (error, transactionHash) => {
    Logger.info(transactionHash)
  });

 } else {
  // set the provider you want from Web3.providers
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
 }

    

    let gender = null;
    if ($('#male').is(':checked')) {
      gender = "male";
    } else {
      gender = "female"
    }
    patient = {
      name: $("#name").val(),
      dob: $("#dob").val(),
      gender: gender
    }
    console.log(patient);
    toast('success', 'Patient personal details saved')

  })

  $("#save2").on('click', function () {
    report = {
      condition: $("#condition").val(),
      year: $("#year").val(),
      notes: $("#condition-notes").val()
    }
    console.log(report);

    let risk = 0;
    if ($('#risk').is(':checked')) {
      risk = 1;
    }

    allergy = {
      name: $("#allergy-name").val(),
      risk: risk,
      notes: $("#allergy-notes").val()
    }
    console.log(allergy);

    immunisation = {
      name: $("#immunisation-name").val(),
      year: $("#immunisation-date").val()
    }
    console.log(immunisation);

    let mobility = null;
    if ($('#mobility-independent').is(':checked')) {
      mobility = "independent";
    } else if ($('#mobility-help').is(':checked')) {
      mobility = "some help"
    } else {
      mobility = "dependent"
    }

    let eating = null;
    if ($('#eating-independent').is(':checked')) {
      eating = "independent";
    } else if ($('#eating-help').is(':checked')) {
      eating = "some help"
    } else {
      eating = "dependent"
    }

    let dressing = null;
    if ($('#dressing-independent').is(':checked')) {
      dressing = "independent";
    } else if ($('#dressing-help').is(':checked')) {
      dressing = "some help"
    } else {
      dressing = "dependent"
    }

    let toileting = null;
    if ($('#toileting-independent').is(':checked')) {
      toileting = "independent";
    } else if ($('#toileting-help').is(':checked')) {
      toileting = "some help"
    } else {
      toileting = "dependent"
    }

    let washing = null;
    if ($('#washing-independent').is(':checked')) {
      washing = "independent";
    } else if ($('#washing-help').is(':checked')) {
      washing = "some help"
    } else {
      washing = "dependent"
    }

    social = {
      mobility,
      eating,
      dressing,
      toileting,
      washing,
      activity: $("#social-activity").val(),
      behaviour: $("#social-behaviour").val()
    }

    console.log(social);
    toast('success', 'Patient medical report saved')

  })

  $("#save3").on('click', function () {
    let monday = 0;
    let tuesday = 0;
    let wednesday = 0;
    let thursday = 0;
    let friday = 0;
    let saturday = 0;
    let sunday = 0;

    if ($('#monday').is(':checked')) {
      monday = 1;
    }
    if ($('#tuesday').is(':checked')) {
      tuesday = 1;
    }
    if ($('#wednesday').is(':checked')) {
      wednesday = 1;
    }
    if ($('#thursday').is(':checked')) {
      thursday = 1;
    }
    if ($('#friday').is(':checked')) {
      friday = 1;
    }
    if ($('#saturday').is(':checked')) {
      saturday = 1;
    }
    if ($('#sunday').is(':checked')) {
      sunday = 1;
    }


    medication = {
      name: $("#medication-name").val(),
      dose: $("#medication-dose").val(),
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
      sunday,
      plan: $("#medication-plan").val(),
    }
    console.log(medication);
    toast('success', 'Patient medication saved')

  })

  $("#save4").on('click', async function () {
      var request = $.ajax({
        url: "/new",
        data: {
          patient,
          report,
          allergy,
          immunisation,
          social,
          medication
        },
        type: 'post',
        headers: {
          'x-csrf-token': $('[name=_csrf]').val()
        },
        dataType: 'json'
      })

      request.done(function (data) {
        toast('success', data);
      });
      request.fail(function (jqXHR, textStatus) {
        toast('error', textStatus + jqXHR);
      });

  })