const fs = require("fs");

fs.readdir("./public/images", (err, files) => {
  if (err) throw err;

  for (const file of files) {
    console.log(file);
    fs.unlink("./public/images/" + file, err => {
      if (err) throw err;
    });
  }
});
