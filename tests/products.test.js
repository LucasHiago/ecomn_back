const chai = require("chai");
const expect = chai.expect;
const chaiHttp = require("chai-http");
const fs = require("fs");

chai.use(chaiHttp);

const server = require("../server/app");
let productId = "";
let userId = "";
let accessToken = "";

let adminId = "";
let adminAccessToken = "";

describe("Products Endpoint", () => {
  before(async () => {
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

    const admin = await chai
      .request(server)
      .post("/api/admin/register")
      .send({
        username: "admin123",
        password: "admin123",
        password_confirm: "admin123"
      });
    adminId = admin.body._id;
    adminAccessToken = admin.body.access_token;
  });

  it("Mengambil seluruh produk", async () => {
    const res = await chai
      .request(server)
      .get("/api/products")
      .set("Authorization", "Bearer " + accessToken);

    expect(res).to.have.status(200);
    expect(res).to.be.json;
    expect(res.body).to.have.property("message");
  });

  it("Mencoba menyimpan dengan data tidak lengkap", async () => {
    try {
      const res = await chai
        .request(server)
        .post("/api/products")
        .set({
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${adminAccessToken}`
        })
        .field("code", "12345")
        .field("name", "Kain ABCD")
        .field("price", 232424)

        .field("width", 5)
        .field("stock", 6)
        .field("color", "merah")
        .field("description", "1235")
        .attach(
          "image",
          fs.readFileSync(__dirname + "/tiosaputra.jpg"),
          "tiosaputra.jpg"
        );

      expect(res).to.have.status(400);
      expect(res.body).to.have.property("message");
    } catch (err) {
      expect(err).to.be.an("object");
    }
  });

  it("Membuat produk baru", async () => {
    try {
      const res = await chai
        .request(server)
        .post("/api/products")
        .set({
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${adminAccessToken}`
        })
        .field("code", "12345")
        .field("name", "Kain ABCD")
        .field("price", 232424)
        .field("material", "blah blah")
        .field("width", 5)
        .field("stock", 6)
        .field("color", "merah")
        .field("description", "1235")
        .attach(
          "image",
          fs.readFileSync(__dirname + "/tiosaputra.jpg"),
          "tiosaputra.jpg"
        );

      productId = res.body.data._id;

      expect(res).to.have.status(201);
      expect(res).to.be.json;
      expect(res.body).to.have.property("message");
    } catch (err) {
      console.log(err);
    }
  });

  it("Mangambil produk berdasarkan id", async () => {
    try {
      const res = await chai
        .request(server)
        .get(`/api/products/${productId}`)
        .set("Authorization", "Bearer " + accessToken);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property("message");
    } catch (err) {
      console.log(err);
    }
  });

  it("Mengubah produk berdsarkan id", done => {
    const updateProduct = {
      code: "12345",
      name: "Kain Mulus bersih berkilau",
      price: 4353454,
      material: "Softly Gently",
      width: 5,
      stock: 5,
      description: "This is my not my recomendation"
    };

    chai
      .request(server)
      .put(`/api/products/${productId}`)
      .send(updateProduct)
      .set("Authorization", "Bearer " + adminAccessToken)
      .end((err, res) => {
        expect(err).to.be.null;

        expect(res).to.have.status(200);
        // expect(res.body.data.code).to.equal(updateProduct.code);
        // expect(res.body.data.name).to.equal(updateProduct.name);
        // expect(res.body.data.price).to.equal(updateProduct.price);
        // expect(res.body.data.material).to.equal(updateProduct.material);
        // expect(res.body.data.width).to.equal(updateProduct.width);
        // expect(res.body.data.stock).to.equal(updateProduct.stock);
        // expect(res.body.data.description).to.equal(updateProduct.description);
        done();
      });
  });

  it("Menghapus produk berdasarkan id", done => {
    chai
      .request(server)
      .del(`/api/products/${productId}`)
      .set("Authorization", "Bearer " + adminAccessToken)
      .end((err, res) => {
        expect(err).to.be.null;

        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.have.property("data");
        expect(res.body).to.have.property("message");
        done();
      });
  });
});
