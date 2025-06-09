import React, { useState, useEffect } from 'react';
import './Form.css';

const debounce = (fn, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};

const Form = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState({ name: '', email: '', password: '' });

  const showError = (field, message) => {
    setErrors((prev) => ({ ...prev, [field]: message }));
  };

  const clearErrors = () => {
    setErrors({ name: '', email: '', password: '' });
  };

  const validate = () => {
    let valid = true;
    clearErrors();

    if (name.trim() === '') {
      showError('name', 'Name is required.');
      valid = false;
    } else if (!/^[A-Za-z\s]+$/.test(name)) {
      showError('name', 'Name can only contain alphabets.');
      valid = false;
    }

    if (email.trim() === '') {
      showError('email', 'Email is required.');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError('email', 'Enter a valid email.');
      valid = false;
    }

    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNumber = /\d/.test(password);
    const notSameAsName = password.toLowerCase() !== name.toLowerCase();

    if (password.length < 6) {
      showError('password', 'Password must be at least 6 characters.');
      valid = false;
    } else if (!hasSpecialChar) {
      showError('password', 'Password must contain a special character.');
      valid = false;
    } else if (!hasNumber) {
      showError('password', 'Password must include a number.');
      valid = false;
    } else if (!notSameAsName) {
      showError('password', 'Password should not be the same as the name.');
      valid = false;
    }

    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      alert('Form submitted successfully!');
      setName('');
      setEmail('');
      setPassword('');
      clearErrors();
    }
  };

  // Debounced validation
  useEffect(() => {
    debounce(() => {
      if (name !== '') validate();
    }, 300)();
  }, [name]);

  useEffect(() => {
    debounce(() => {
      if (email !== '') validate();
    }, 300)();
  }, [email]);

  useEffect(() => {
    debounce(() => {
      if (password !== '') validate();
    }, 300)();
  }, [password]);

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="name">Name</label>
        <input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        <div className="error">{errors.name}</div>

        <label htmlFor="email">Email</label>
        <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <div className="error">{errors.email}</div>

        <label htmlFor="password">Password</label>
        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <div className="error">{errors.password}</div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Form;
