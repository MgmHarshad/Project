import React from 'react'

function Footer() {
  return (
    <div className="bg-gray-200 min-h-32 p-4 sm:p-6 mt-5 text-center text-green-900 rounded-lg shadow-lg">
        <h3 className='lining-nums text-lg sm:text-xl lg:text-2xl font-bold mt-2 sm:mt-4 lg:mt-5 p-2 sm:p-4 lg:p-5'>@2025 Feed Connect | All Rights Reserved</h3>
        <p className='lining-nums mt-2 sm:mt-4 lg:mt-5 text-sm sm:text-base'>
          Ph.no:-+91-9481131520 <br /> 
          email:-<a href="mailto:feedconnect@gmail.com" className="text-green-700 hover:text-green-800 underline">feedconnect@gmail.com</a>
        </p>
    </div>
  )
}

export default Footer