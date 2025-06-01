import React from "react";

function Login() {
  return (
    <form className="text-center w-200 m-auto mt-20 font-serif shadow-md p-5 border-2 hover:shadow-lg transition-shadow duration-300 text-green-800 rounded-lg">
      <h1 className="text-6xl font-bold">Login</h1>
      <div>
        <label className="block text-3xl font-bold mt-10">Email:</label>
        <input
          type="text"
          name="email"
          placeholder="Enter Your Email"
          className="border-2 p-2 w-full rounded-lg mt-2"
        />
      </div>
      <div>
        <label className="block text-3xl font-bold mt-10">Password:</label>
        <input
          type="password"
          name="password"
          placeholder="Enter Your Password"
          className="border-2 p-2 w-full rounded-lg mt-2"
        />
      </div>
      <button
        className="bg-green-800 text-white w-60 h-12 rounded-lg cursor-pointer ml-auto mt-10"
        onMouseEnter={(e) => {
          e.target.style.scale = "1.05";
        }}
        onMouseLeave={(e) => {
          e.target.style.scale = "1";
        }}
      >
        Login
      </button>
    </form>
  );
}

export default Login;
