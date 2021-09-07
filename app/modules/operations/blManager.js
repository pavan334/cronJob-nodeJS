
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
 
const cron = require("node-cron");
const shell = require("shelljs");

const dbPath = path.join(__dirname, "userData.db");
let db = null;


let task;

export default class BLManager {

    static DBconnect = async () =>{
        console.log('DB trying to connect,' + new Date() )
    
          try {
            db = await open({
              filename: dbPath,
              driver: sqlite3.Database,
            });
            console.log('DB connected')
            console.log("working on cron job");
            let i = 0
            task = cron.schedule("*/2 * * * * *", function () {
              console.log(i);
              i = i+1;
              
            });
            
        
          } catch (error) {
            console.log(`DB Error: ${error.message}`);
            process.exit(1);
          }
      }









      


    async createTable (res) {
      // Cron Job Business logic-
      const creatingTable = `
                    CREATE TABLE user(
                        username text,
                        name text,
                        password text,
                        gender text,
                        location text
                    )`;
      const result = await db.run(creatingTable);
      console.log("Table created",result);
    }

    async register (request,response){
        const { username, name, password, gender, location } = request.body;
        const hashedPassword = await bcrypt.hash(password, 15);
        const selectUserQuery = ` SELECT 
                                            * 
                                    FROM 
                                            user 
                                    WHERE 
                                            username = '${username}';`;
        const databaseUser = await db.get(selectUserQuery);
        
        if (databaseUser === undefined) {
            const createUserQuery = `
            INSERT INTO
            user (username, name, password, gender, location)
            VALUES
            (
            '${username}',
            '${name}',
            '${hashedPassword}',
            '${gender}',
            '${location}'  
            );`;
            
            let resultUser = await db.run(createUserQuery);
            console.log("User registered successfully",resultUser);
            
        } else {
            console.log("User already exists");
        }
    }

    async login (request,response){
        const { username, password } = request.body;
        const selectUserQuery = `
                                  SELECT
                                      *
                                  FROM
                                      user
                                  WHERE
                                      username = '${username}';`;
        const databaseUser = await db.get(selectUserQuery);
        if (databaseUser === undefined) {
          console.log("Invalid user");
        } else {
          const isPasswordMatched = await bcrypt.compare(
            password,
            databaseUser.password
          );
          if (isPasswordMatched === true) {
            const payload = {
              username: username,
            };
            const jwtToken = jwt.sign(payload, "MY_SECRET_TOKEN");
            console.log({ jwtToken });
          } else {
            console.log("Invalid password");
          }
        }
    }
    async getUsers (request,response){
        const usersListQuery = `
                            SELECT 
                                *
                            FROM 
                                user;`;
        const result = await db.all(usersListQuery);
        task.stop();
        console.log("cron-job stops working");
        console.log(result);
    }
    

  }
