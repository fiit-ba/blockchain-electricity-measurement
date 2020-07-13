
const namespace = 'test';

let chai = require('chai');


let chaiHttp = require('chai-http');
var should = chai.should();
chai.use(chaiHttp);
let server = require('../index');


var identity;


//Our parent block
describe("#Unit tests for Nodejs server", () => {


    var ficture;
    describe("/ ", () => {
        
        it("1-it should return home page text", (done) => {
            chai.request(server)
                .get("/")
                .end((err, res) => {
                    (res).should.have.status(200);
                    (res.text).should.equal("Welcome to Home page");
                    console.log("Returned " + res.text)
                    done();
                });
        });

        it("2- it should issue identity", (done) => {
            chai.request(server)
                .post("/api/issueIdentity")
                .send({
                    'userid': "1234",})
                .end((err, res) => {
                    //(res).should.have.status(200);                  
                    (res).should.have.status(200);
                    console.log("Returned " + res.text)
                    done();
                });
        });


        it("3-it should import card", (done) => {
            chai.request(server)
                .post("/api/importcard")
                .send({
                    'userId': "1234",
                    outputfile: "cards/Customer1234.card"})
                .end((err, res) => {                 
                    (res).should.have.status(200);
                    console.log("Returned " + res.body.message)
                    done();
                });
        });



        it("4-it should update Meters", (done) => {
            chai.request(server)
                .get("/api/updateMeters")
                .end((err, res) => {
                    (res).should.have.status(200);
                    console.log(res.text)
                    done();
                });
        });



        it("5-it should get history of the Meters", (done) => {
            chai.request(server)
                .get("/api/history")

                .end((err, res) => {
                    (res).should.have.status(200);
                    console.log(res.body)
                    done();
                });
        });


        it("6-it should get send daily invocies", (done) => {
            chai.request(server)
                .get("/api/sendEmails?start=2020-05-01")

                .end((err, res) => {
                    (res).should.have.status(200);
                    console.log(res.text)
                    done();
                });
        });

    });

});