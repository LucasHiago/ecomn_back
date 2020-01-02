const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const fs = require("fs");

chai.use(chaiHttp);

const server = require("../server/app");

let userId = "";
let productId = "";
let productPrice = 0;
let accessToken = "";
let transId = "";
let adminId = "";
let adminAccessToken = "";

describe("Transactions Endpoint", () => {
  before(async () => {
    //   Create user

    const res = await chai
      .request(server)
      .post("/api/users/register")
      .send({
        firstName: "Transaction",
        lastName: "Test",
        email: "testTransaction@gmail.com",
        address: "Jl Cemara Raya 2 Tanjung Seneng",
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

    //   Create Product
    const product = await chai
      .request(server)
      .post("/api/products")
      .set({
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${adminAccessToken}`
      })
      .field("code", "123Test")
      .field("name", "Kain Untuk Test")
      .field("price", 50000)
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

    productId = product.body.data._id;
    productPrice = product.body.data.price;

    // Add product to cart
    await chai
      .request(server)
      .put(`/api/carts/${userId}`)
      .set("Authorization", "Bearer " + accessToken)
      .send({
        productId: productId,
        quantity: 5
      });
  });

  it("Should create transaction", async () => {
    try {
      const res = await chai
        .request(server)
        .post("/api/transactions")
        .set("Authorization", "Bearer " + accessToken)
        .send({
          shippingAddress: {
            phoneNumber: "8583734894823",
            address: "ABC",
            province: "12",
            city: "123"
          },
          paymentMethod: "Transfer Rekening",
          courService: {
            courier: "jne",
            service: "OK",
            cost: "13000",
            etd: "5",
            note: ""
          }
        });

      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.have.property("message");
      transId = res.body.data._id;
    } catch (err) {
      console.log(err.message);
    }
  });

  it("Mengambil transaksi berdasarkan id", done => {
    chai
      .request(server)
      .get(`/api/transactions/${transId}`)
      .set("Authorization", "Bearer " + accessToken)
      .end((err, res) => {
        expect(err).to.be.null;

        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.have.property("message");
        expect(res.body).to.have.property("data");
        done();
      });
  });

  it("Should get all transactions", done => {
    chai
      .request(server)
      .get(`/api/transactions`)
      .set("Authorization", "Bearer " + adminAccessToken)
      .end((err, res) => {
        expect(err).to.be.null;

        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.have.property("message");
        done();
      });
  });

  it("Mengubah status transaksi", done => {
    const status = ["Diterima", "Ditolak", "Dikirim"];
    chai
      .request(server)
      .put(`/api/transactions/${transId}/status`)
      .set("Authorization", "Bearer " + adminAccessToken)
      .send({
        status: status[0]
      })
      .end((err, res) => {
        expect(err).to.be.null;

        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.have.property("message");
        expect(res.body).to.have.property("status");
        done();
      });
  });

  it("Mengupload bukti transaksi", async () => {
    try {
      const res = await chai
        .request(server)
        .put(`/api/transactions/${transId}/proof`)
        .set({
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${accessToken}`
        })
        .attach(
          "image",
          fs.readFileSync(__dirname + "/tiosaputra.jpg"),
          "tiosaputra.jpg"
        );

      expect(res).to.have.status(200);
      expect(res.body).to.have.property("message");
    } catch (err) {
      console.log(err);
    }
  });

  it("Merubah status verifikasi pembayaran", done => {
    const verify = ["Terferivikasi", "Belum Terferivikasi"];
    chai
      .request(server)
      .put(`/api/transactions/${transId}/verify`)
      .set("Authorization", "Bearer " + adminAccessToken)
      .send({
        status: verify[0]
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
