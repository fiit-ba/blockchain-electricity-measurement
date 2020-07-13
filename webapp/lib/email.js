var fs = require('fs');
var nodemailer = require('nodemailer')
var Promise = require('bluebird')

let ejs = require("ejs");
let path = require("path");


var emailList = [];

async function sendEmail(obj, email, password) {
    
    await ejs.renderFile(path.join('./views', "report.ejs"), { meter: obj }).then(async function (data) {


        let options = {
            format: 'A3',
            "format": "Letter",        // allowed units: A3, A4, A5, Legal, Letter, Tabloid
            "orientation": "portrait", // portrait or landscape
            "header": {
                "height": "20mm"
            },
            "footer": {
                "height": "20mm",
            },
            "zoomFactor": "0.65",
            base: "http://localhost:5700",
            filename: `./reports/${obj.Date}/${obj.Owner.firstName}-report.pdf`
        };

        var pdf = Promise.promisifyAll(require('html-pdf'))
        await pdf.createAsync(data, options).then(async (pdf) => {



            let HelperOptions = {
                from: email,
                to: obj.Owner.email,
                subject: obj.houseNumber + ' Daily electricity report',
                text: `Dear ${obj.Owner.firstName} ${obj.Owner.lastName} please find attached your daily report for the date ${obj.Date}, Your daily electricity usage is ${obj.usage} KwH
                    
Thank you
Sincerly,
Electrichain Smart electricity Measurement
                    `,

                attachments: [
                    {

                        path: pdf.filename, // <= Here
                        contentType: 'application/pdf'
                    }
                ]

            };
            

            let transporter = nodemailer.createTransport({
                service: 'gmail',
                secure: false,
                port: 25,
                auth: {
                    user: email,
                    pass: password
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            await transporter.sendMail(HelperOptions).then(info => {

                emailList.push(info.envelope.to)
                console.log("The message was sent!");
                //onsole.log(info.response);
                console.log(info.envelope);
            }).catch(error => {


                throw error;
            });

        })


    }).catch(error => {

        throw error
    });


}

async function sendEmails(Meters, start) {



    const reader = require("readline-sync"); //npm install readline-sync
    console.log("Enter password for electroblockchain2020@gmail.com")
    const password = reader.question("Password: ",{ hideEchoBack: true });

    var id  = "electroblockchain2020@gmail.com"
    try {
        var obj = {}
        for (var i = 0; i < Meters.length; i++) {
            obj = Meters[i];
            await sendEmail(obj,id,password);
        }

        return emailList
    } catch (error) {


        throw error
    }

}

module.exports = sendEmails;