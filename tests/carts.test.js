const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const fs = require("fs");

chai.use(chaiHttp);

const server = require("../server/app");

let userId = "";
let productId = "";
let accessToken = "";
let transId = "";
let cartId = "";

describe("Carts test endpoint", () => {
  before(async () => {
    //   Create user
    const res = await chai
      .request(server)
      .post("/api/users/register")
      .send({
        firstName: "Cart",
        lastName: "Test",
        email: "testCart@gmail.com",
        address: "Jl Cemara Raya 2 Tanjung Seneng",
        password: "password",
        password_confirm: "password"
      });
    userId = res.body.data._id;
    accessToken = res.body.access_token;

    //   Create Product
    const product = await chai
      .request(server)
      .post("/api/products")
      .set("Content-Type", "serverlication/x-www-form-urlencoded")
      .field("code", "Test Cart")
      .field("name", "Product for cart")
      .field("price", 4234234)
      .field("material", "blah blah")
      .field("width", 5)
      .field("stock", 6)
      .field("description", "dfasfasf")
      .attach(
        "image",
        fs.readFileSync(__dirname + "/tiosaputra.jpg"),
        "testCart.jpg"
      );

    productId = product.body._id;
  });

  it("Should Get Cart By User Id ", done => {
    chai
      .request(server)
      .get(`/api/carts/${userId}`)
      .set("Authorization", "Bearer " + accessToken)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.have.property("message");
        done();
      });
  });

  it("Should add product to cart", done => {
    chai
      .request(server)
      .put(`/api/carts/${userId}`)
      .set("Authorization", "Bearer " + accessToken)
      .send({
        productId: productId,
        quantity: 5
      })
      .end((err, res) => {
        expect(err).to.be.null;

        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.have.property("message");
        done();
      });
  });

  it("Change Product Quantity", done => {
    chai
      .request(server)
      .put(`/api/carts/${userId}/items/${productId}/quantity`)
      .set("Authorization", "Bearer " + accessToken)
      .send({ quantity: 4 })
      .end((err, res) => {
        expect(err).to.be.null;

        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.have.property("message");
        done();
      });
  });

  it("Menghapus produk di dalam cart", done => {
    chai
      .request(server)
      .delete(`/api/carts/${userId}/items/${productId}`)
      .set("Authorization", "Bearer " + accessToken)
      .end((err, res) => {
        expect(err).to.be.null;

        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.have.property("message");
        done();
      });
  });
});
