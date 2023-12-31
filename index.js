const express = require("express")
const app = express();
const mongoose = require("mongoose");
const session = require("express-session")
const redis = require("redis")
const cors = require("cors")
let RedisStore = require("connect-redis").default;

const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, REDIS_URL, REDIS_PORT, SESSION_SECRET } = require("./config/config");



/*let redisClient = redis.createClient({
    host: REDIS_URL,
    port: REDIS_PORT,
    
})*/

//redisClient.connect().catch(console.error)

const postRouter = require("./routes/postRoutes")
const authRouter = require("./routes/userRoutes") 


const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}?authSource=admin`

const connectWithRetry=()=>{
    mongoose.connect(mongoURL,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
       
    }
    ).then(()=>{
        console.log("successfuly connected to mongo DB")
    }).catch(
        (e)=>{
        console.log(e)
        setTimeout(connectWithRetry, 5000)
        }
    )

}

connectWithRetry();


app.enable("trust proxy")
app.use(cors({}))
/*app.use(session({
    store: new RedisStore({
        client: redisClient
    }),
    secret: SESSION_SECRET,
    cookie:{
        secure:false,
        resave:false,
        saveUninitialized: false,
        httpOnly: true,
        maxAge:30000
    }
}))*/

app.use(express.json())

app.get("/api/v1", (req, res)=>{
    res.send("<h2> Hi There!!</h2>")
    console.log("yeah it ran")
});

app.use("/api/v1/posts", postRouter)
app.use("/api/v1/users", authRouter);

const port = process.env.PORT|| 3000;

app.listen(port, ()=> console.log(`Listening on port ${port}`));