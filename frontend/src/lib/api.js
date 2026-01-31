import api from './axios.js'

export const syncUser = async (userData) => {
    const {data} = await api.post("/users/sync", userData)
    return data
}
 
export const getAllProducts = async () => {
    const {data} = await api.get("/products")
    return data
}

export const getProductsbyid = async (id) => {
    const {data} = await api.get(`/products/${id}`)
    return data
}

export const getMyProducts = async () => {
    const {data} = await api.get("/products/my")
    return data
}

export const createProduct = async (productdata) => {
    const {data} = await api.post("products", productdata)
    return data
}

export const updateProduct = async ({id, ...productdata}) => {
    const {data} = await api.put(`/product/${id}`, productdata)
    return data
}

export const deleteProduct = async (id) => {
  const { data } = await api.delete(`/products/${id}`)
  return data;
}


export const createComment = async ({ productId, content }) => {
  const { data } = await api.post(`/comments/${productId}`, { content })
  return data;
}

export const deleteComment = async ({ commentId }) => {
  const { data } = await api.delete(`/comments/${commentId}`)
  return data;
}