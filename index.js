const { Pool } = require("pg");
const Cursor = require("pg-cursor");
require("dotenv").config();


const args = process.argv.slice(2);
const typeFuncion = args[0];


const config = {
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
  max: process.env.PG_POOL_MAX,
  idleTimeoutMillis: process.env.PG_POOL_IDLE_TIMEOUT_MILLIS,
  connectionTimeoutMillis: process.env.PG_POOL_CONNECTION_TIMEOUT_MILLIS,
};

const pool = new Pool(config);

const newBill = async (id, saldo) => {
  try {
    const client = await pool.connect();
    const SQLQuery = {
      text: `INSERT INTO cuenta (id, saldo) VALUES ($1, $2) RETURNING *`,
      values: [`${id}`, `${saldo}`],
    };
    console.log("SQLQuery :>> ", SQLQuery);
    const res = await client.query(SQLQuery);
    client.release();
    console.log(res.rows);
    pool.end();

    return console.log(`New bill id: ${id} - balance: ${saldo} successfully added`);
    
  } catch (error) {
    await client.query("ROLLBACK");

    console.log("Error creating new account:");
    console.error("Error message:", error.message);
    console.log("Error código: " + error.code);
    console.log("Detalle del error: " + error.detail);
    console.log("Tabla originaria del error: " + error.table);
    console.log("Restricción violada en el campo: " + error.constraint);
  }
};




const newTrans = async (descripcion, fecha, monto, cuenta) => {
    try {
        const client = await pool.connect();

        try {
            await client.query("BEGIN");

            const acreditar = `INSERT INTO transaccion (descripcion, fecha, monto, cuenta) VALUES ($1, $2, $3, $4) RETURNING *`
            const txt = [`${descripcion}`, `${fecha}`, `${monto}`, `${cuenta}`]
            const acreditacion = await client.query(acreditar, txt);
            console.log("Acreditación realizada con éxito: ", acreditacion.rows);

            await client.query("COMMIT");
        } catch (error) {
            await client.query("ROLLBACK");
            console.log('error :>> ', error);
            console.error('error message:', error.message);
            console.error('code:', error.code);
            console.error('detail:', error.detail);
        }

        client.release();
        pool.end();
    } catch (error) {
        console.log('error :>> ', error);
        console.error("Error message:", error.message);
        console.log("Error código: " + error.code);
        console.log("Detalle del error: " + error.detail);
        console.log("Tabla originaria del error: " + error.table);
        console.log("Restricción violada en el campo: " + error.constraint);
        }
}


const getTrans = async () => {
  try {
      const client = await pool.connect();
      try {
          const text = "SELECT descripcion, fecha, monto, cuenta FROM transaccion";
          const consulta = new Cursor(text);
          const cursor = await client.query(consulta);
          try {
              let rows;
                  rows = await cursor.read(10);
                  console.log(rows);
                  console.log("length: ", rows.length);
              try {
                  await cursor.close();
              } catch (error) {
                  console.log('error :>> ', error);
              }
          } catch (error) {
              console.log('error :>> ', error);
          }
      } catch (error) {
          console.log('error :>> ', error);
          console.error(error.message);
          console.error(error.code);
      }
      client.release();
      pool.end();
  } catch (error) {
      console.log('error :>> ', error);
      console.error("Error message:", error.message);
      console.log("Error código: " + error.code);
      console.log("Detalle del error: " + error.detail);
      console.log("Tabla originaria del error: " + error.table);
      console.log("Restricción violada en el campo: " + error.constraint);
    }
}


const getSaldo = async (id) => {
  try {
      const client = await pool.connect();
      try {
          const text = `SELECT id, saldo FROM cuenta WHERE id = $1;`;
          const values = [`${id}`];
          const consulta = new Cursor(text, values);
          const cursor = await client.query(consulta);
          try {
              let rows;
                  rows = await cursor.read(1);
                  console.log(rows);
                  console.log("length: ", rows.length);
              try {
                  await cursor.close();
              } catch (error) {
                  console.log('error :>> ', error);
              }
          } catch (error) {
              console.log('error :>> ', error);
          }
      } catch (error) {
          console.log('error :>> ', error);
          console.error(error.message);
          console.error(error.code);
      }
      client.release();
      pool.end();
  } catch (error) {
      console.log('error :>> ', error);
      console.error("Error message:", error.message);
      console.log("Error código: " + error.code);
      console.log("Detalle del error: " + error.detail);
      console.log("Tabla originaria del error: " + error.table);
      console.log("Restricción violada en el campo: " + error.constraint);
    }
}

if (typeFuncion == "newBill") {
    newBill(args[1], args[2]);

  } else if (typeFuncion == "newTrans") {
    newTrans(args[1], args[2], args[3], args[4]);

  } else if (typeFuncion == "getTrans") {
    getTrans();

  } else if (typeFuncion == "getSaldo") {
    getSaldo(args[1])
  };
