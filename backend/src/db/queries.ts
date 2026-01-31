import { db } from "./index"
import { eq } from "drizzle-orm"
import { users, comment, products, type NewUser, type NewComment, type NewProduct } from "./schema"

export const createUser = async (data: NewUser) => {
    const [user] = await db.insert(users).values(data).returning()
    return user
}

export const getUserbyId = async (id: string | string[]) => {
    const resolvedId = Array.isArray(id) ? id[0] : id
    return db.query.users.findFirst({ where: eq(users.id, resolvedId)})
}

export const updateUser = async (id: string, data: Partial<NewUser>) => {
    const existing = await getUserbyId(id)
    if(!existing){
        throw new Error(`User with id ${id} not found`)
    }
    const [user] = await db.update(users).set(data).where(eq(users.id, id)).returning()
    return user
}

export const upsertUser = async (data: NewUser) => {
    const [user] = await db.insert(users).values(data).onConflictDoUpdate({target: users.id, set: data}).returning()
    return user
}

export const createProduct = async (data: NewProduct) => {
  const [product] = await db.insert(products).values(data).returning()
  return product
}

export const getAllproducts = async () => {
    return db.query.products.findMany({with: {user: true}, orderBy: (products, {desc}) => 
        [desc(products.createdAt)],})
} 

export const getProductsbyid = async (id:  string | string[]) => {
    const resolvedId = Array.isArray(id) ? id[0] : id
    return db.query.products.findFirst({where: eq(products.id, resolvedId), with: {
        user:true, comments:{with: {user: true}, orderBy: (comment, {desc}) => [desc(comment.createdAt)]}
    }})
}

export const getProductsbyuserid = async (userId: string) => {
    return db.query.products.findMany({where: eq(products.userId, userId), with: 
        {user: true}, orderBy: (products, {desc}) => [desc(products.createdAt)]
    })
}

export const updateProduct = async (id: string | string[], data: Partial<NewProduct>) => {
    const resolvedId = Array.isArray(id) ? id[0] : id
    const existingproduct = await getProductsbyid(resolvedId)
    if(!existingproduct){
        throw new Error(`Product with id ${id} not found`)
    }
    const [product] = await db.update(products).set(data).where(eq(products.id, resolvedId)).returning()
    return product
}

export const deleteProduct = async (id: string | string[]) => {
    const resolvedId = Array.isArray(id) ? id[0] : id
    const existingproduct = await getProductsbyid(resolvedId)
    if(!existingproduct){
        throw new Error(`Product with id ${id} not found`)
    }
    const [product] = await db.delete(products).where(eq(products.id, resolvedId)).returning()
    return product
}

export const createComment = async (data: NewComment) => {
    const [comments] = await db.insert(comment).values(data).returning()
    return comments
}

export const deleteComment = async (id: string) => {
    const existingComment = await getCommentsbyid(id)
    if(!existingComment){
        throw new Error(`Comment with id ${id} not fond`)
    }
    const [comments] = await db.delete(comment).where(eq(comment.id, id)).returning()
    return comments
}

export const getCommentsbyid = async (id: string) => {
    return db.query.comment.findFirst({where: eq(comment.id, id), with: {
        user: true
    }, })
}