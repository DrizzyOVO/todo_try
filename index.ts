import express from "express"; 
import mongoose from "mongoose"; 
import authRoutes from "./routes/auth"; 
import todoRoutes from "./routes/todo"; 
import cors from "cors"; 
import path from "path";
import dotenv from 'dotenv'; 
dotenv.config();

const PORT = 3000; 
const app = express(); 
app.use(cors()); 
app.use(express.json());  
app.use("/auth", authRoutes); 
app.use("/todo", todoRoutes); 

app.use(express.static("public"));
app.use("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"))
})

mongoose.connect(`mongodb+srv://dizzywebbeb:wzyQ3OoK0TmH3ujX@cluster0.ygharhl.mongodb.net/`, { dbName: "TodoProjGhub" }); 

app.listen(PORT, () => {
    console.log(`Example app is listening at http://localhost:${PORT}`)
}); 

