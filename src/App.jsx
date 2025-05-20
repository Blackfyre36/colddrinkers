import Layout from "./components/Layout"
import Hero from "./components/Hero"
import Stats from "./components/Stats"
import History from "./components/History"
import { useAuth } from "./context/AuthContext"
import ColdDrinkForm from "./components/ColdDrinkForm"



function App() {
  const {globalUser, isLoading, globalData} = useAuth()
  const isAuthenticated = globalUser
  const isData = globalData && !!Object.keys(globalData || {}).length
  const authenticatedContent = (
    <>
    <Stats />
    <History />
    </>
  )
  

  return (
    
      <Layout>
       <Hero />
       <ColdDrinkForm isAuthenticated={isAuthenticated} />
       {(isAuthenticated && isLoading) && (
        <p>Loading Data....</p>
       )}
       {(isAuthenticated && isData) && (authenticatedContent)}
      </Layout>

  )
}

export default App
