import { useEffect, useState } from "react";
import Chat from "./components/Chat";
import Login from "./components/Login";

import { auth } from "./utils/firebase"


function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (!authUser) return setUser(null);
      setUser({
        ...authUser?.providerData[0]
      });
    })
    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <div className="max-w-md mx-auto bg-gray-100 p-3 h-screen flex flex-col">
      <div className="flex items-center justify-between mb-5 border-b py-2">
        <h1 className="text-xl font-semibold ">Hello Mango Chat</h1>
        {user && (
          <button
            type="button"
            className="flex items-center justify-center text-indigo-700 font-semibold p-3 border border-transparent text-sm  rounded-md  bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 bg-opacity-10 hover:bg-opacity-20"
            onClick={() => auth.signOut()}
          >
            Logout
          </button>
        )}
      </div>
      {user ? <Chat user={user} /> : <Login />}
    </div>
  );
}

export default App;