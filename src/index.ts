import initDataBase from "./database";

async function appInit() {
  try {
    await initDataBase();
    console.log("Application initialized successfully");
  } catch (error) {
    console.error("Failed to init the application:", error);
  }
}
appInit();
