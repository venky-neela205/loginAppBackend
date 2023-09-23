const express = require("express")
const { open } = require("sqlite")
const sqlite3 = require("sqlite3")
const cors = require("cors")
const path = require("path")
const { get } = require("express/lib/response")
const { captureRejectionSymbol } = require("events")

const dbPath = path.join(__dirname, "loginApplication.db")

const app = express()

app.use(cors())
app.use(express.json())

let db = null

const InitializeDbAndServer = async () => {
    try{
        db = await open({
            filename : dbPath,
            driver : sqlite3.Database,
        });

        app.listen(3000, () => 
            console.log("server running at http://localhost:3000/")
        )
    }catch(error){
        console.log(`DB error : ${error.message}`);
        process.exit(1);
    }
};

InitializeDbAndServer()

app.post("/login", async (request, response) => {
    const {username, password} = request.body

    try{
        const getUserQuery = `
        SELECT
          *
        FROM 
          users
        WHERE
         username = ${username};`;

         const getUser = await db.get(getUserQuery)
        //  response.send(getUser)
        if(getUser){
            if(getUser.password === password){
                response.send("Login Successful")
            }else{
                response.send("Invalid Credentials")
            }
        }else{
            response.send("User not found")
        }
    } catch (error){
        console.log(`authentication error: ${error}`)
        response.status(500).send("An error occured")
    }
})


app.post("/register", async (request, response) => {
    const {username, password} = request.body

    try{
        const insertUserQuery = `
            INSERT INTO users
                (username, password)
            VALUES
                (${username}, ${password});`;
        const insertUser = db.run(insertUserQuery)

    } catch(error){
        console.log(`registration error: ${error}`)
        response.status(500).send("An error occured while registration")
    }
})
