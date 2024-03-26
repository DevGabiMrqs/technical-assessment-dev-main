import express from "express";
import userRoutes from "./src/routes/userRoutes";
import regionRoutes from "./src/routes/regionRoutes";

const app = express();
const port = process.env.port || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/users", userRoutes);
app.use("/regions", regionRoutes);

app.use((req, res) => {
  res.status(404).send("Route not found");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

export default app;
