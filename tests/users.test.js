const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;

chai.use(chaiHttp);

const server = require("../server/app");

let userId = "";
let accessToken = "";

describe("Users endpoint tests", () => {
  before(async () => {
    try {
      //   Create user
      const res = await chai
        .request(server)
        .post("/api/users/register")
        .send({
          firstName: "Admin",
          lastName: "Getting User",
          email: "admingetuser@gmail.com",
          address: "Jl Cemara Raya 2 Tanjung Seneng",
          password: "password",
          password_confirm: "password"
        });

      userId = res.body.data._id;
      accessToken = res.body.access_token;
    } catch (error) {
      console.log(error);
    }
  });

  it("Should get all users data", done => {
    chai
      .request(server)
      .get(`/api/users`)
      .set("Authorization", "Bearer " + accessToken)
      .end((err, res) => {
        expect(err).to.be.null;

        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.have.property("message");
        done();
      });
  });

  it("Should get users data by userid", done => {
    chai
      .request(server)
      .get(`/api/users/${userId}`)
      .set("Authorization", "Bearer " + accessToken)
      .end((err, res) => {
        expect(err).to.be.null;

        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.have.property("message");
        done();
      });
  });

  // it("Mengembalikan 404 user tidak ditemukan", done => {
  //   chai
  //     .request(server)
  //     .get(`/api/users/5db959188d64d014809a53f1`)
  //     .set("Authorization", "Bearer " + accessToken)
  //     .end((err, res) => {
  //       expect(err).to.be.null;

  //       expect(res).to.have.status(404);
  //       expect(res).to.be.json;
  //       expect(res.body).to.have.property("message");
  //       done();
  //     });
  // });

  it("Should update user data by userid", done => {
    chai
      .request(server)
      .put(`/api/users/${userId}`)
      .set("Authorization", "Bearer " + accessToken)
      .send({
        firstName: "Admin Ganteng",
        lastName: "Ganteng Admin",
        email: "admingetuser@gmail.com",
        address: "Jl Cemara Raya 2 Tanjung Seneng",
        password: "password",
        password_confirm: "password"
      })
      .end((err, res) => {
        expect(err).to.be.null;

        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.have.property("message");
        done();
      });
  });
});
