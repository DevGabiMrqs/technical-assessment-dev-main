import mongoose from "mongoose";

const env = {
  MONGO_URI:
    "mongodb://root:example@127.0.0.1:27017/oz-tech-test?authSource=admin",
};

const init = async function () {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log("Conexão com o MongoDB estabelecida com sucesso");
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
    throw error;
  }
};

export default init;
