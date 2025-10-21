
import './App.css'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Layout from "./Layout.tsx";
import Home from "@/pages/Home.tsx";
import Login from "@/pages/Login.tsx";
import Signup from "@/pages/Signup.tsx";
import Rule from "@/pages/Rule.tsx"
import {AuthProvider} from "@/components/AuthProvider.tsx";

function App() {

  return (
      <AuthProvider>
          <Router>
              <Layout>
                  <Routes>
                      <Route path={"/"} element={<Home/>}/>
                      <Route path={"/Login"} element={<Login/>}/>
                      <Route path={"/Signup"} element={<Signup/>}/>
                      <Route path={"/Rules"} element={<Rule/>}/>
                  </Routes>
              </Layout>
          </Router>
      </AuthProvider>
  )
}

export default App
