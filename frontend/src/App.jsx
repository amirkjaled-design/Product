import { SignedIn, SignedOut, SignInButton, SignOutButton } from "@clerk/clerk-react"
import Navbar from "./components/navbar"
import { Navigate, Route, Routes } from "react-router"
import HomePage from "./pages/homepage"
import ProductPage from "./pages/productpage"
import ProfilePage from "./pages/profilepage"
import CreatePage from "./pages/createpage"
import EditProductPage from "./pages/editproductpage"
import useAuthReq from "./hooks/useauthreq"
import useUserSync from "./hooks/useusersync"

function App() {

  const { isClerkLoaded, isSignedIn } = useAuthReq()
  useUserSync()

  if (!isClerkLoaded) return null
  

  return (
    <>
      <div className="min-h-screen bg-base-100">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/profile" element={isSignedIn ? <ProfilePage /> : <Navigate to={"/"} />} />
          <Route path="/create" element={isSignedIn ? <CreatePage /> : <Navigate to={"/"} />} />
          <Route path="/edit/:id" element={isSignedIn ? <EditProductPage /> : <Navigate to={"/"} />}
          />
        </Routes>
      </main>
    </div>
    </>
  )
}

export default App
