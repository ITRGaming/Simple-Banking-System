import React, { useState, useEffect } from 'react';
import { Building2, Wallet, ArrowUpDown, PlusCircle, MinusCircle, X } from 'lucide-react';
import moment from 'moment';
import api from '../Api/apis';
import '../style.css';

function Customer() {
  const [balance, setBalance] = useState(0.00);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [transactions, setTransactions] = useState(['']);
  
  useEffect(() => {
      (async () => {
            await fetchTransactionData();
        })();
    }, []);

    const onLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('id');
      window.location.href = '/';
      };

    async function fetchTransactionData (){
        try {
              const user_id = localStorage.getItem('id');
              const token = localStorage.getItem('token');
              if (token) {
                  const transaction = await api.fetchTransaction(user_id, token);
                  setBalance(transaction[0].final_amount);
                  setTransactions(transaction);
                  
              } else {
                  alert("No token present");
              }
          } catch (error) {
              const message = error.response.data.error;
              if (message === 'jwt expired') {
                  localStorage.removeItem('token');
                  window.location.href = '/';
              }
          }
      }

  const handleTransaction = async() => {
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (modalType === 'withdraw' && numAmount > balance) {
      setError('Insufficient Funds');
      return;
    }
    const user_id = localStorage.getItem('id');
    const token = localStorage.getItem('token');
    const transaction_type = modalType === 'deposit' ? 'deposit' : 'withdrawal';
    const newAmount= modalType === 'deposit' ? numAmount : numAmount;

    await api.handleTransaction(user_id, transaction_type, newAmount, token);
    await fetchTransactionData();
    closeModal();
  };

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
    setAmount('');
    setError('');
  };

  const closeModal = () => {
    setShowModal(false);
    setAmount('');
    setError('');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <Building2 className="dashboard-logo" />
          <h1>Customer Dashboard</h1>
        </div>
        <div className="balance-display">
          <Wallet className="balance-icon" />
          <span>Available Balance: <strong>₹{balance}</strong></span>
        </div>
        <button className="logout-button" onClick={onLogout}>
          Logout
        </button>
      </div>

      <div className="customer-dashboard-content">
        <div className="transaction-controls">
          <button className="action-button deposit" onClick={() => openModal('deposit')}>
            <PlusCircle className="button-icon" />
            Deposit
          </button>
          <button className="action-button withdraw" onClick={() => openModal('withdraw')}>
            <MinusCircle className="button-icon" />
            Withdraw
          </button>
        </div>

        <div className="transaction-history">
          <h2>Transaction History</h2>
          <div className="transaction-list">
            {transactions.map(transaction => (
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
                  {transaction.transaction_type === 'deposit' ? '+' : '-'} ₹{Math.abs(transaction.amount)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{modalType === 'deposit' ? 'Make a Deposit' : 'Make a Withdrawal'}</h2>
              <button className="close-button" onClick={closeModal}>
                <X />
              </button>
            </div>
            <div className="modal-content">
              <div className="balance-info">
                Available Balance: ₹{balance}
              </div>
              <div className="input-group">
                <label htmlFor="amount">Amount</label>
                <div className="amount-input">
                  <span className="currency-symbol">₹</span>
                  <input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              {error && <div className="error-message">{error}</div>}
              <button className="modal-submit" onClick={handleTransaction}>
                {modalType === 'deposit' ? 'Deposit' : 'Withdraw'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Customer;