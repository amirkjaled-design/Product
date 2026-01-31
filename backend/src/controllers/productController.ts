import type { Request, Response } from "express"

import * as queries from "../db/queries"
import { getAuth } from "@clerk/express"



export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await queries.getAllproducts()
        res.status(200).json(products)
    } catch (error) {
        console.error("Error getting products:", error)
        res.status(500).json({ error: "Failed to get products" })
    }
}

export const getMyProducts = async (req: Request, res: Response) => {
    try {
        const { userId }  = getAuth(req)
        if(!userId) return res.status(401).json({ error: "Unauthorizd"})

        const products = await queries.getProductsbyuserid(userId)
        res.status(200).json(products)
    } catch (error) {
        console.error("Error getting user products:", error)
        res.status(500).json({ error: "Failed to get user products" })
    }
}

export const getProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const product = await queries.getProductsbyid(id)
        if(!product) return res.status(404).json({ error: "Product not found"})

        res.status(200).json(product)
    } catch (error) {
        console.error("Error getting products:", error)
        res.status(500).json({ error: "Failed to get products" })
    }
}

export const createProduct = async (req: Request, res: Response) => {
    try {
        const { userId } = getAuth(req)
        if(!userId) return res.status(401).json({ error: "Unauthoried"})
        
        const {title, description, imageUrl} = req.body
        if (!title || !description || !imageUrl) {
            res.status(400).json({ error: "Title, description, and imageUrl are required" })
            return
    }
    const product = await queries.createProduct({
        title, description, imageUrl, userId
    })
    res.status(201).json(product)
    } catch (error) {
        console.error("Error creating products:", error)
        res.status(500).json({ error: "Failed to create products" })
    }
}

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const {userId} = getAuth(req)
        if(!userId) return res.status(401).json({ error: "Unauthorized"})

        const {id} = req.params
        const {title, description, imageUrl} = req.body

        const existingproduct = await queries.getProductsbyid(id)
        if(!existingproduct) {
            res.status(404).json({error: "Product not found"})
            return
        }
        if(existingproduct.userId !== userId){
            res.status(403).json({error: "You can only update your own products"})
            return
        }
        const product = await queries.updateProduct(id, {
            title, description, imageUrl
        })
        res.status(200).json(product)
    } catch (error) {
        console.error("Error updating product:", error)
        res.status(500).json({ error: "Failed to update product" })
    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const {userId} = getAuth(req)
        if(!userId) return res.status(401).json({error: "Unauthorized"})

        const {id} = req.params

        const existingproduct = await queries.getProductsbyid(id)
        if(!existingproduct){
            res.status(400).json({error: "Product not found"})
            return
        }
        if(existingproduct.userId !== userId){
            res.status(403).json({error: "You can only delete your own products"})
            return
        }
        await queries.deleteProduct(id)
        res.status(200).json({message: "Product deleted your own products"})
    } catch (error) {
        console.error("Error deleting product:", error)
        res.status(500).json({ error: "Failed to delete product" })
    }
}