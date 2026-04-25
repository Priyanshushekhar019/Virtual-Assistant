import express from "express";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import cors from "cors";

const app = express();
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

console.log("App Router Stack:");
app._router.stack.forEach(layer => {
    if (layer.name === "router") {
        console.log("Mounted router at regex:", layer.regexp);
        layer.handle.stack.forEach(r => {
            if (r.route) {
                console.log("  ->", r.route.path, Object.keys(r.route.methods));
            }
        });
    }
});
