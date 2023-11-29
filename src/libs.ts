/*
    dotenv example with initializing MySql connection pool
    Yes, just import it and process.env.VARIABLE can be access now.
*/

import 'dotenv/config';
/*
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
    ^ You can use something like this if you are getting errors related to file/variables.
    This might occur if you are calling your script from somewhere not it's directory, 
    so you might also need to edit this part: '../.env' to match your pathing
*/
import mysql from 'mysql2/promise';

const createMySqlPool = () => {
  const pool = mysql.createPool({
    host: process.env.DB_IP!,
    port: Number(process.env.DB_PORT)!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
  });
  return pool;
};

const pool = createMySqlPool(); // Call it once! Outside of your functions, on the top like this is okay

/*
    MySql SELECT query example
*/
const MySqlSelectExample = async () => {
  const selectQuery = 'SELECT * FROM your_table WHERE condition LIMIT ? OFFSET ?';
  const [rows, fields] = await pool.execute(selectQuery, [100, 400]);

  if (rows instanceof Array) return rows; //
  /*
    If you have types, you can cast them here like so
    const typedRows: Entry[] = rows as Entry[];
    Consider using ORM !
  */ else throw new Error('Error from mysql, expected array, got: ' + rows);
};

/*
    MySQL INSERT INTO query example
*/

const MySqlInsertIntoExample = async () => {
  const insertQuery = `
    INSERT INTO your_table
        (field1, field2, field3date, field4)
    VALUES
        (?, "some constant idk", UTC_TIMESTAMP(), ?)
    `;
  await pool.execute(insertQuery, ['foo', 'bar']); // field1: foo, field2: some constant idk, field3: insertion timestamp, field4: bar
};

/* 
    node-cron and ps-list example
*/
import { exec } from 'child_process';
import psList from 'ps-list';
var cron = require('node-cron');

const startProcess = async () => {
  const child = exec(`npm start`); // start your process here as you want
  child.stdout?.on('data', async (data) => {
    console.log(data);
  });
};

const isProcessUp = async (processName: string) => {
  const runningProcesses = await psList();
  const process = runningProcesses.find((p) => p.name === processName);

  return process != undefined;
};

// checks every minute! read online about cron syntax
const task = cron.schedule('* * * * *', async () => {
  /*
        IMPORTANT PART HERE!
        You will need to give a name to your process (OS gives them long ugly names)

        In the very start of your parser script, just write this:
        process.title = 'PROCESS_NAME';

        For names to be strictly matching here and in your parser script, you should put this PROCESS_NAME into your .env
    */
  if (!(await isProcessUp('PROCESS_NAME'))) {
    startProcess();
  }
});

// This is a Immediately Invoked Function Expression
// As you might now, you can't use await functions outside of other functions.
// You should call them like so, it's a pattern

// See index.ts for additional example
(async () => {
  await task.start();
})();

/*
    p-limit example
*/
import pLimit from 'p-limit';

const limit = pLimit(5); // only 5 concurrent operations allowed

const pLimitExample = async () => {
  // ...
  const parseUrl = async (url: string) => {
    // Get all data from this url
  };
  const urls = ['google.com', 'github.com', 'stackoverflow.com'];
  /*
    Please note using Promise.allSettled instead of Promise.all
    This ensures that all promises will be executed even if some of them get rejected,
    while Promise.all will stop executing immediately if one of the promises rejects, so your other promises won't execute.

    Please also note that Promise.allSettled returns Promise<PromiseSettledResult<void>[], not void, and you can use this for logging.
  */
  await Promise.allSettled(urls.map((url: string) => limit(() => parseUrl(url))));
  // ...
};
