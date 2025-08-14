import React from 'react'

function Register() {
  return (
    <div className="font-serif  text-green-800 mb-10">
      <div className="text-center mt-10 p-5 bg-green-800/80 text-white w-300 m-auto rounded-t-lg">
        <h1 className="text-6xl font-bold">Register</h1>
      </div>
      <form className="text-center w-300 m-auto font-serif shadow-md p-5 border-2 hover:shadow-lg transition-shadow duration-300 text-green-800 rounded-b-lg">
        <div className='p-10'>
          <label className="block text-3xl font-bold mt-10 text-left ml-2">Full Name:</label>
          <input
            type="text"
            name="name"
            placeholder="Enter Your Full Name"
            required
            className="border-b-2 p-2 w-full mt-2 focus:outline-none focus:border-b-2"
          />
        </div>
        <div className='p-10'>
          <label className="block text-3xl font-bold mt-10 text-left ml-2">UserName:</label>
          <input
            type="text"
            name="username"
            placeholder="Enter Your Username"
            required
            className="border-b-2 p-2 w-full mt-2 focus:outline-none focus:border-b-2"
          />
        </div>
        <div className='p-10'>
          <label className="block text-3xl font-bold mt-10 text-left ml-2">Email:</label>
          <input
            type="text"
            name="email"
            placeholder="Enter Your Email"
            required
            className="border-b-2 p-2 w-full mt-2 focus:outline-none focus:border-b-2"
          />
        </div>
        <div className='p-10'>
          <label className="block text-3xl font-bold mt-10 text-left ml-2">Password:</label>
          <input
            type="password"
            name="password"
            placeholder="Enter Your Password"
            required
            className="border-b-2 p-2 w-full mt-2 focus:outline-none focus:border-b-2"
          />
        </div>
        <div className='p-10'>
          <label className="block text-3xl font-bold mt-10 text-left ml-2">Profile Pic:</label>
          <input
            type="file"
            accept="image/*"
            name="profilepic"
            className="border-b-2 p-2 w-full mt-2 focus:outline-none focus:border-b-2"
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
          Submit
        </button>
      </form>
    </div>
  )
}

export default Register