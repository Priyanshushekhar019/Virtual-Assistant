import express from "express";
import userRouter from "./routes/user.routes.js";

console.log("User Router Stack:");
userRouter.stack.forEach((r) => {
    if (r.route && r.route.path) {
        console.log("Path:", r.route.path, "Methods:", Object.keys(r.route.methods));
    }
});
