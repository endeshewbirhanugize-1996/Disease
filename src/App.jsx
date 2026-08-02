import { useState } from "react";
import axios from "axios";
function App() {
  const [count, setCount] = useState({
    name: "",
    email: "",
  });
  const up=(event) => {
    const {name, value}=event.target;
    setCount((prev)=>({
      ...prev,
      [name]:value,
    }));
  };
  const onsub=async (event) => {
    event.preventDefault();
    try {
        const res =await axios.post(
        "http://localhost:3000/signup",
        count
      );
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form onSubmit={onsub}>
      <div className="bg-blue-400 flex flex-col items-center gap-4 mt-10 p-20">
        <input type="text" name="name" placeholder="Enter your name"  value={count.name}
          onChange={up}
          className="border p-2 rounded"/>
        <input  type="email"  name="email"  placeholder="Enter your email"  value={count.email}
          onChange={up}
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-white px-5 py-2 rounded">
          Submit
        </button>
        <h2>Name:{count.name}</h2>
        <h2>Email:{count.email}</h2>
        <h3>State Object:</h3>
        <pre>{JSON.stringify(count, null, 2)}</pre>
      </div>
    </form>
  );
}
export default App;