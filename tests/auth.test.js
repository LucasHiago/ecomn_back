const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;

chai.use(chaiHttp);

const server = require("../server/app");
const email = "karya.tiosaputra@gmail.com";

describe("Authentication Endpoint", () => {
  it("Should return 422 (invalid input)", done => {
    chai
      .request(server)
      .post("/api/users/register")
      .send({
        lastName: "Saputra",
        email: email,
        password: "password",
        password_confirm: "password"
      })
      .end((err, res) => {
        expect(err).to.be.null;

        expect(res).to.have.status(422);
        expect(res).to.be.json;
        done();
      });
  });

  it("Should register user : valid", done => {
    chai
      .request(server)
      .post("/api/users/register")
      .send({
        firstName: "Tio",
        lastName: "Saputra",
        email: email,
        address: "Jl Cemara Raya 2 Tanjung Seneng",
        password: "password",
        password_confirm: "password"
      })
      .end((err, res) => {
        expect(err).to.be.null;

        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.have.property("message");
        expect(res.body).to.have.property("access_token");
        done();
      });
  });

  it("Should return 409 (duplicate email) ", done => {
    chai
      .request(server)
      .post("/api/users/register")
      .send({
        firstName: "Tio",
        lastName: "Saputra",
        email: email,
        address: "Jl Cemara Raya 2 Tanjung Seneng",
        password: "password",
        password_confirm: "password"
      })
      .end((err, res) => {
        expect(err).to.be.null;

        expect(res).to.have.status(409);
        expect(res).to.be.json;
        done();
      });
  });

  it("Should return 403 (wrong password)", done => {
    chai
      .request(server)
      .put("/api/users/login")
      .send({
        email: email,
        password: "salah"
      })
      .end((err, res) => {
        expect(err).to.be.null;

        expect(res).to.have.status(403);
        expect(res).to.be.json;
        done();
      });
  });

  it("Should return 200 (valid)", done => {
    chai
      .request(server)
      .put("/api/users/login")
      .send({
        email: email,
        password: "password"
      })
      .end((err, res) => {
        expect(err).to.be.null;

        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.have.property("access_token");
        done();
      });
  });
});
