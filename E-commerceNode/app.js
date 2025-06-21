const express = require("express");
require("dotenv").config();
const logger = require("./middlewares/logger");
const error = require("./middlewares/error");
const connectToDb = require("./config/db");
const cors = require("cors");

connectToDb();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors({
  origin: 'http://localhost:4200', 
  credentials: true,
}));

app.use(logger);

// API routes
app.use("/api/auth", require("./routes/Authentication"));
app.use("/api/admin", require("./routes/admin/categoryCrud"));
app.use("/api/admin",require("./routes/admin/product"));
app.use("/api/admin",require("./routes/admin/user"));
app.use("/api/admin",require("./routes/admin/adminCrud"));
app.use("/api/user",require("./routes/user/ProductCrud"));
app.use("/api/user",require("./routes/user/wishlist"));

app.use(error.notFound);
app.use(error.errorHandler);

const port = process.env.PORT || 5003;
app.listen(port, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`)
);