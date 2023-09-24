const express = require("express")
const { open } = require("sqlite")
const sqlite3 = require("sqlite3")
const cors = require("cors")
const path = require("path")

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

        app.listen(3001, () => 
            console.log("server running at http://localhost:3001/")
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
         username = '${username}';`;

         const getUser = await db.get(getUserQuery)

        if(getUser){
            if(getUser.password === password){
                response.send({message:"Login Successful"})
            }else{
                response.send({error:"Invalid Credentials"})
            }
        }else{
            response.send({error:"User not found"})
        }
    } catch (error){
        console.log(`authentication error: ${error}`)
        response.status(500).send({error:"An error occured while authentication"})
    }
})


app.post("/register", async (request, response) => {
    const {username, password} = request.body
    console.log(username, password)
    try{
        const insertUserQuery = `
            INSERT INTO users
                (username, password)
            VALUES
                ('${username}', '${password}');`;
        const insertUser = await db.run(insertUserQuery)
        response.send({message:"Registration Successful"})

    } catch(error){
        console.log(`registration error: ${error}`)
        response.status(500).send({error:"An error occured while registration"})
    }
})

app.get('/getUsers', async (request, response) => {

    const getUsersQuery = `
        SELECT
          *
        FROM 
          users;`;

    const getUsers = await db.get(getUsersQuery)
    response.send(getUsers)
})