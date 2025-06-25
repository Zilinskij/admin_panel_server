import { Request } from "express";

export const getUserValues = (req:Request) =>{
    return {
        user_id:req.cookies.user_id as number,
        name:req.body.name
    }
}