const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;

chai.use(chaiHttp);

const server = require("../server/app");

let userId = "";
let accessToken = "";

describe("Courier Endpoint", () => {
  before(async () => {
    //   Create user
    const res = await chai
      .request(server)
      .post("/api/users/register")
      .send({
        firstName: "Courier",
        lastName: "Test",
        email: "testCourier@gmail.com",
        address: "Jl Cemara Raya 2 Tanjung Seneng",
        password: "password",
        password_confirm: "password"
      });
    userId = res.body.data._id;
    accessToken = res.body.access_token;
  });

  it("Should get province data", done => {
    chai
      .request(server)
      .get("/api/courier/province")
      .set("Authorization", `Bearer ${accessToken}`)
      .end((err, res) => {
        expect(err).to.be.null;

        expect(res).to.have.status(200);
        expect(res).to.be.json;
        done();
      });
  });

  it("Should get city data", done => {
    chai
      .request(server)
      .get("/api/courier/city")
      .set("Authorization", `Bearer ${accessToken}`)
      .end((err, res) => {
        expect(err).to.be.null;

        expect(res).to.have.status(200);
        expect(res).to.be.json;
        done();
      });
  });

  it("Should get courier cost", done => {
    chai
      .request(server)
      .post("/api/courier/cost")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        origin: "21",
        destination: "153",
        weight: 1000,
        courier: "jne"
      })
      .end((err, res) => {
        expect(err).to.be.null;

        expect(res).to.have.status(200);
        expect(res).to.be.json;
        done();
      });
  });
});
