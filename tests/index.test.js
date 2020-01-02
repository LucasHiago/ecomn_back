const mongoose = require("mongoose");

after(done => {
  mongoose.connection.dropDatabase(() => {
    console.log(`\n Test database droped`);
  });
  mongoose.connection.close(() => {
    done();
  });
});
