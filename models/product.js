// import { randomUUID as uuidV4 } from "node:crypto";

// import { ForbiddenError, UnprocessableEntityError, ValidationError } from "errors";

import database from "infra/database.js";

async function findAll() {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const products = await dbClient.query("SELECT * FROM product;");
    return products.rows;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await dbClient.end();
  }
}

async function findById(id) {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const products = await dbClient.query(
      "SELECT * FROM product WHERE id = $1;",
      [id],
    );
    return products.rows;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await dbClient.end();
  }
}

export default Object.freeze({
  findAll,
  findById,
});
