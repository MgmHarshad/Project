import React from 'react'

function ReceiverNotification() {
    const notifications = [
        {id:1, Highlight:"New Request Received", message: "An NGO near you (Hope Foundation) has requested a food donation. Click to view details and respond."},
        {id:2, Highlight:"Donation Picked Up", message: "Your recent donation (5 kg cooked rice, 20 servings) has been picked up by Helping Hands NGO. Thank you!"},
        {id:3, Highlight:"Milestone Achieved", message: "You’ve donated 100 meals this month! Your kindness is feeding many. Keep it up!"},
        {id:4, Highlight:"Scheduled Pickup Reminder", message: "Your scheduled pickup is today at 4:00 PM. Please ensure the food is ready and properly packed."},
        {id:5, Highlight:"Delivery in Progress", message: " Your donated food is currently on its way to Grace Shelter Home. You can track its delivery status here."},
        {id:6, Highlight:"Event Registration Open", message: "Join us for the upcoming Zero Hunger Drive event this weekend. Limited slots available — register now!"}
    ]
  return (
    <div className="font-serif text-green-800">
        {notifications.map((notification) => (
            <div key={notification.id} className="flex flex-col mt-10 mb-10 p-4 bg-gray-100 rounded-lg shadow-md text-center items-center cursor-pointer ml-10 mr-10">
                <p className='text-2xl font-bold mt-1' onMouseEnter={(e)=>e.target.style.color='blue'} onMouseLeave={(e)=>e.target.style.color='darkgreen'}>{notification.Highlight}</p>
                <p className='mt-1'>{notification.message}</p>
            </div>
        ))}
    </div>
  )
}

export default ReceiverNotification