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
import Game from "@/pages/Game.tsx";
import Profile from "@/pages/Profile.tsx";
import {UserProvider} from "@/components/providers/UserProvider.tsx";
import {WebSocketProvider} from "@/components/providers/WebSocketProvider.tsx";
import GameProvider from "@/components/providers/GameProvider.tsx";

function App() {

    return (
        <AuthProvider>
            <UserProvider>
                <WebSocketProvider>
                    <GameProvider>
                    <Router>
                        <Layout>
                            <Routes>
                                <Route path={"/"} element={<Home/>}/>
                                <Route path={"/Login"} element={<Login/>}/>
                                <Route path={"/Signup"} element={<Signup/>}/>
                                <Route path={"/Rules"} element={<Rule/>}/>
                                <Route path={"/Standings"} element={<Standings/>}/>
                                <Route path={"/JoinGame"} element={<Joingame/>}/>
                                <Route path={"/Game"} element={<Game/>}/>
                                <Route path={"/Profile"} element={<Profile/>}/>

                                <Route path={"*"} element={<Error/>}/>
                            </Routes>
                        </Layout>
                    </Router>
                    </GameProvider>
                </WebSocketProvider>
            </UserProvider>
        </AuthProvider>
    )
}

export default App
