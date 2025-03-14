import express from "express";

const app = express();
const port = 80;

app.use(express.static("public"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
