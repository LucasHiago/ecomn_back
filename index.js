const app = require("./server/app");

const PORT = 5000 || process.env.PORT;

app.listen(PORT, () => console.log(`Listening to port ${PORT}`));
