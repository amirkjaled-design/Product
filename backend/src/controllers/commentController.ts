import type { Request, Response } from "express"
import * as queries from "../db/queries"
import { getAuth } from "@clerk/express"


export const createComment = async (req: Request, res: Response) => {
    try {
        const { userId } = getAuth(req)
        if(!userId) return res.status(401).json({ error: "Unauthorized"})

        const {productId} = req.params
        const {content} = req.body

        if(!content) return res.status(400).json({ error: "Unauthorized"})
        const id = Array.isArray(productId) ? productId[0] : productId

        
        const product = await queries.getProductsbyid(id)
        if(!product) return res.status(404).json({"Product not found": true})

        const comment = await queries.createComment({content, userId, productId: id })
        res.status(200).json(comment)
        } catch (error) {
        console.error("Error creating comment:", error)
        res.status(500).json({ error: "Failed to create comment" })
    }
}

export const deleteComment = async (req: Request, res: Response) => {
    try {
        const {userId} = getAuth(req)
        if(!userId) return res.status(401).json({ error: "Unauthorized"})

        const {commentId} = req.params
        const cid = Array.isArray(commentId) ? commentId[0] : commentId
        if(!cid) return res.status(400).json({ error: "Invalid commentId" })

        const existingComment = await queries.getCommentsbyid(cid)
        if(!existingComment) return res.status(404).json({ error: "Comment not found"})

        if(existingComment.userId !== userId){
            return res.status(403).json({error: "You can only delete your own comment"})
        }

        await queries.deleteComment(cid)
        res.status(200).json({message: "Comment deleted successfully"})
    } catch (error) {
        console.error("Error deleting comment:", error)
        res.status(500).json({ error: "Failed to delete comment" })
    }
}