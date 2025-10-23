
import './App.css'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Layout from "./Layout.tsx";
import Home from "@/pages/Home.tsx";
import Login from "@/pages/Login.tsx";
import Signup from "@/pages/Signup.tsx";
import Rule from "@/pages/Rule.tsx"
import {AuthProvider} from "@/components/providers/AuthProvider.tsx";
import Error from "@/pages/Error.tsx";
import Joingame from "@/pages/Joingame.tsx";
import Standings from "@/pages/Standings.tsx"
import Test from "@/pages/Test.tsx";
import Profile from "@/pages/Profile.tsx";
import {UserProvider} from "@/components/providers/UserProvider.tsx";

function App() {

  return (
      <AuthProvider>
          <UserProvider>
          <Router>
              <Layout>
                  <Routes>
                      <Route path={"/"} element={<Home/>}/>
                      <Route path={"/Login"} element={<Login/>}/>
                      <Route path={"/Signup"} element={<Signup/>}/>
                      <Route path={"/Rules"} element={<Rule/>}/>
                      <Route path={"/Standings"} element={<Standings/>}/>
                      {/*<Route path={"/Game"} element={<Game />}/>*/}
                      <Route path={"/JoinGame"} element={<Joingame/>}/>
                      <Route path={"/Test"} element={<Test/>}/>
                      <Route path={"/Profile"} element={<Profile/>}/>

                      <Route path={"*"} element={<Error/>}/>
                      sada
                  </Routes>
              </Layout>
          </Router>
          </UserProvider>
      </AuthProvider>
  )
}

export default App
