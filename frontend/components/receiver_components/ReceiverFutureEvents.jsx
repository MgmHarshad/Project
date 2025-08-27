import React from "react";

function ReceiverFutureEvents() {
  let Events = [
    {
      id: 1,
      Event_Name: "Ganesh Chaturthi Maha Prasad Distribution",
      Date: "08-09-2025",
      Location: "Shivaji Nagar Community Hall",
      Organizer: "Shree Ganesh Seva Mandal",
    },

    {
      id: 2,
      Event_Name: "Corporate Annual Day Dinner",
      Date: "15-09-2025",
      Location: "Radisson Blu Hotel, Bengaluru",
      Organizer: "TechVision Pvt Ltd",
    },

    {
      id: 3,
      Event_Name: "Celebrity Wedding Reception",
      Date: "22-09-2025",
      Location: "Royal Orchid Palace",
      Organizer: "SR Event Planners",
    },

    {
      id: 4,
      Event_Name: "Durga Puja Community Feast",
      Date: "05-10-2025",
      Location: "Bengal Association Ground",
      Organizer: "Bengal Cultural Society",
    },

    {
      id: 5,
      Event_Name: "College Fest Food Stalls",
      Date: "12-10-2025",
      Location: "BMS College Campus",
      Organizer: "BMS Cultural Committee",
    },

    {
      id: 6,
      Event_Name: "Diwali Corporate Lunch",
      Date: "22-10-2025",
      Location: "IT Park Food Court",
      Organizer: "GlobalSoft Solutions",
    },
  ];
  return (
    <div className="font-serif text-green-800 bg-green-200 w-full h-screen p-10">
      <div className="bg-green-50 rounded-lg shadow-lg py-2">
        <h1 className="text-center font-bold text-2xl">Future Events</h1>
        <table className="bg-white w-full text-center mt-2">
          <thead>
            <tr className="border-b-2">
              <th className="p-4">Event Name</th>
              <th>Date</th>
              <th>Location</th>
              <th>Organizer</th>
            </tr>
          </thead>
          <tbody>
            {Events.map((Event) => (
              <tr key={Event.id}>
                <td className="p-4">{Event.Event_Name}</td>
                <td>{Event.Date}</td>
                <td>{Event.Location}</td>
                <td>{Event.Organizer}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReceiverFutureEvents;
