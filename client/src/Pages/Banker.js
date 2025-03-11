import React, { useState,useEffect } from 'react';
import { Building2, CreditCard, ArrowUpDown, Eye } from 'lucide-react';
import moment from 'moment';
import api from '../Api/apis';
import '../style.css';

function Banker() {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const data = await api.fetchAccounts(token);
          console.log('Fetched accounts:', data);
          setCustomers(data); 
        } else{
          console.log("No token present");
        }
      } catch (error) {
        const message = error.response.data.error;
        if (message === 'jwt expired') {
          console.log('Token expired');
          localStorage.removeItem('token');
          window.location.href = '/';

        }
      }
    })(); 
  }, [setCustomers]);

    const onLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
        };

    async function selectCustomer(customer) {
        const token = localStorage.getItem('token');
        const transaction = await api.fetchTransaction(customer.user_id, token);
        transaction.username = customer.username;
        console.log('Fetched transaction:', transaction);
        setSelectedCustomer(transaction);
    }



  const filteredCustomers = customers.filter(customer =>
    customer.username.toLowerCase() ||
    customer.user_id
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <Building2 className="dashboard-logo" />
          <h1>Banker Dashboard</h1>
        </div>
        <button className="logout-button" onClick={onLogout}>
          Logout
        </button>
      </div>

      <div className="dashboard-content">
        <div className="accounts-list">
          <h2>Customer Accounts</h2>
          {filteredCustomers.map(customer => (
            <div
              key={customer.user_id}
              className={`account-card ${selectedCustomer?.user_id === customer.user_id ? 'selected' : ''}`}
              onClick={() => selectCustomer(customer)}
            >
              <div className="account-info">
                <CreditCard className="account-icon" />
                <div>
                  <h3>{customer.username}</h3>
                  <p className="account-number">Account Id: {customer.user_id}</p>
                </div>
              </div>
              <div className="account-balance">
                ₹{customer.final_amount}
                <Eye className="view-icon" />
              </div>
            </div>
          ))}
        </div>

        {selectedCustomer && (
  <div className="transaction-history">
    <h2>Transaction History - {selectedCustomer.username}</h2>
    <div className="transaction-list">
      {selectedCustomer.map(transaction => ( 
        <div key={transaction.id} className="transaction-item"> 
          <div className="transaction-info">
          <ArrowUpDown className={`transaction-icon ${transaction.transaction_type === 'deposit' ? 'credit' : 'debit'}`} />
            <div>
              <h3>Transaction ID : {transaction.id}</h3>
              <p className="transaction-date">
              {transaction.transaction_type}<br/>
              {moment(transaction.transaction_date).format('YYYY-MM-DD')}</p> 
            </div>
          </div>
          <p className={`transaction-amount ${transaction.transaction_type}`}>
            {transaction.transaction_type === 'deposit' ? '+' : '-'} ₹{Math.abs(transaction.amount).toFixed(2)} 
          </p>
        </div>
      ))}
    </div>
  </div>
)}
      </div>
    </div>
  );
}

export default Banker;