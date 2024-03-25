import initDataBase from "./database";

async function appInit() {
  try {
    await initDataBase();
  } catch (error) {
    console.error("Failed to init the application:", error);
  }
}

appInit();
