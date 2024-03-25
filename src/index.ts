import initDataBase from "./database";

async function appInit() {
  try {
    await initDataBase();
  } catch (error) {
    console.error("Falha ao iniciar a aplicação:", error);
  }
}

appInit();
