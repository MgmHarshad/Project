import React from "react";

function ReceiverHistory() {
  let Donations = [
    {
      id: 1,
      Date: "01-06-2025",
      Quantity: "20Kg",
      Food_Type: "Pulao",
      Receiver_Organization: "Hunger Free Mission",
      Status: "Delivered",
    },
    {
      id: 2,
      Date: "10-07-2025",
      Quantity: "15Kg",
      Food_Type: "Cooked Rice & Curry",
      Receiver_Organization: "Helping Hands NGO",
      Status: "Delivered",
    },
    {
      id: 3,
      Date: "05-07-2025",
      Quantity: "100 Units",
      Food_Type: "Packaged Sandwiches",
      Receiver_Organization: "Hope Street Shelter",
      Status: "Delivered",
    },
    {
      id: 4,
      Date: "28-06-2025",
      Quantity: "10Kg",
      Food_Type: "Vegetable Pulao",
      Receiver_Organization: "Feed The Needy Foundation",
      Status: "Out for Delivery",
    },
    {
      id: 5,
      Date: "20-06-2025",
      Quantity: "30 Packs",
      Food_Type: "Fruits & Juice Packs",
      Receiver_Organization: "Joyful Hearts Orphanage",
      Status: "Delivered",
    },
    {
      id: 6,
      Date: "12-06-2025",
      Quantity: "12Kg",
      Food_Type: "Idli & Sambar",
      Receiver_Organization: "St. Mary's Charitable Org",
      Status: "Cancelled",
    },
    {
      id: 7,
      Date: "01-06-2025",
      Quantity: "20Kg",
      Food_Type: "Roti & Sabzi",
      Receiver_Organization: "Hunger Free Mission",
      Status: "Delivered",
    },
  ];
  return (
    <div className="font-serif text-green-800 bg-green-200 w-full h-screen p-10">
      <h1 className="text-center font-bold text-2xl mb-4">Donation History</h1>
      <div className="bg-white">
        <table className="w-full text-center">
          <thead className="w-full text-center">
            <tr className="bg-gray-300 border-b-2">
              <th className="p-4">Date</th>
              <th>Quantity</th>
              <th>Food Type</th>
              <th>Receiver Organization</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {Donations.map((Donation) => (
              <tr key={Donation.id} className="border-b-2">
                <td className="p-4">{Donation.Date}</td>
                <td>{Donation.Quantity}</td>
                <td>{Donation.Food_Type}</td>
                <td>{Donation.Receiver_Organization}</td>
                <td>{Donation.Status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReceiverHistory;
