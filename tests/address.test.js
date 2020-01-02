const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;

chai.use(chaiHttp);

const server = require("../server/app");

let userId = "";
let accessToken = "";

describe("Address Rest API Test", () => {
  before(async () => {
    //   Create User Object
    const res = await chai
      .request(server)
      .post("/api/users/register")
      .send({
        firstName: "Product",
        lastName: "Test User",
        email: "producttest@gmail.com",
        address: "User untuk product test",
        password: "password",
        password_confirm: "password"
      });
    userId = res.body.data._id;
    accessToken = res.body.access_token;
  });

  it("Should Get Address", done => {
    chai
      .request(server)
      .get(`/api/address/${userId}`)
      .set({
        Authorization: `Bearer ${accessToken}`
      })
      .end((err, res) => {
        expect(err).to.be.null;

        expect(res).to.have.status(200);
        expect(res).to.be.json;
        // expect(res).to.have.property("message");
        done();
      });
  });

  it("Should Update Address", done => {
    chai
      .request(server)
      .put(`/api/address/${userId}`)
      .set({
        Authorization: `Bearer ${accessToken}`
      })
      .send({
        phoneNumber: "532532423",
        province: 12,
        city: 153,
        address: "Example Address At Address Number Address"
      })
      .end((err, res) => {
        expect(err).to.be.null;

        expect(res).to.have.status(200);
        expect(res).to.be.json;
        // expect(res).to.have.property("message");
        done();
      });
  });
});
