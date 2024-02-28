import { app } from "./app.js";
import connecttodb from "./data/database.js";
const port = 5000;
app.listen(port,()=>{
    console.log(`App running at port ${port} port`)
})
connecttodb();