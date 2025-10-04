import React, { useEffect, useState } from "react";
import "../styles/donationmanagement.css";

const DonationManagement = () => {
  const [donations, setDonations] = useState([]);

  // Fetch donations
  const fetchDonations = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/donations");
      const data = await res.json();
      setDonations(data);
    } catch (err) {
      console.error("Error fetching donations:", err);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  // Update donation status
  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/donations/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        fetchDonations(); // refresh list
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <div className="donation-container">
      <h2>Donation Management</h2>

      <table className="donation-table">
        <thead>
          <tr>
            <th>Donor</th>
            <th>Campaign</th>
            <th>Amount</th>
            <th>Payment</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {donations.length > 0 ? (
            donations.map((donation) => (
              <tr key={donation.id}>
                <td>{donation.user_name}</td>
                <td>{donation.campaign_name}</td>
                <td>${donation.donation_amount}</td>
                <td>{donation.payment_method}</td>
                <td>{new Date(donation.donation_date).toLocaleString()}</td>
                <td>
                  <select
                    value={donation.status || "completed"}
                    onChange={(e) =>
                      handleStatusChange(donation.id, e.target.value)
                    }
                  >
                    <option value="completed">Completed</option>
                    <option value="on-hold">On Hold</option>
                    <option value="donated">Donated</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No donations found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DonationManagement;
