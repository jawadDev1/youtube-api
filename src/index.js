import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({ path: "./.env" });

const PORT = process.env.PORT || 3000


connectDB()
.then( res => {
    app.on('error', error => {
        console.log("Error Server is not running ", error)
    })

    app.listen(PORT, () => {
        console.log("Server is running on port:", PORT)
    })
})
.catch( error => {
    console.log("Error in connectDB :: ", error)
})
