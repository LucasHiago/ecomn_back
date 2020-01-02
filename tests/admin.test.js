const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;

chai.use(chaiHttp);

const server = require("../server/app");

const admin = {
  username: "admin123",
  password: "admin123",
  password_confirm: "admin123"
};

describe("Admin Endpoint Test", () => {
  before(async () => {
    await chai
      .request(server)
      .post("/api/admin/register")
      .send(admin);
  });

  it("Should login admin", async () => {
    try {
      const res = await chai
        .request(server)
        .put("/api/admin/login")
        .send({
          username: admin.username,
          password: admin.password
        });

      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.have.property("access_token");
    } catch (err) {
      console.log(err.message);
    }
  });
});
