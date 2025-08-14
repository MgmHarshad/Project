import React from "react";

function DonorFoodRequests() {
  let Requests = [
    {
        "id": 1,
      Date: "12-08-2025",
      Quantity: "25Kg",
      Food_Type: "Cooked Rice & Dal",
      Receiver_Organization: "Helping Hands NGO",
      Location: "Ujire",
      Status: "Pending",
    },
    {
        "id": 2,
      Date: "10-08-2025",
      Quantity: "15 Packs",
      Food_Type: "Vegetable Pulao",
      Receiver_Organization: "Hope Street Shelter",
      Location: "Mangalore",
      Status: "Pending",
    },
    {
        "id": 3,
      Date: "08-08-2025",
      Quantity: "30Kg",
      Food_Type: "Chapati & Curry",
      Receiver_Organization: "Feed The Needy Foundation",
      Location: "Dharmasthala",
      Status: "Accepted",
    },
    {
        "id": 4,
      Date: "05-08-2025",
      Quantity: "20Kg",
      Food_Type: "Upma",
      Receiver_Organization: "Joyful Hearts Orphanage",
      Location: "Belthangady",
      Status: "Declined",
    },
    {
        "id": 5,
      Date: "03-08-2025",
      Quantity: "12Kg",
      Food_Type: "Fried Rice",
      Receiver_Organization: "Hunger Free Mission",
      Location: "Karkala",
      Status: "Completed",
    },
  ];

  return (
    <div className="font-serif text-green-800 bg-green-200 w-full h-screen p-10">
      <div className="bg-green-50 rounded-lg shadow-lg py-2">
        <h1 className="text-center font-bold text-2xl">Food Requests</h1>
        <table className="bg-white w-full text-center mt-2">
          <thead>
            <tr className="border-b-2">
              <th className="p-4">Date</th>
              <th>Quantity</th>
              <th>Food Type</th>
              <th>Receiver Organization</th>
              <th>Location</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>{Requests.map((Request)=>(
            <tr key={Request.id}>
                <td className="p-4">{Request.Date}</td>
                <td>{Request.Quantity}</td>
                <td>{Request.Food_Type}</td>
                <td>{Request.Receiver_Organization}</td>
                <td>{Request.Location}</td>
                <td>{Request.Status}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

export default DonorFoodRequests;
