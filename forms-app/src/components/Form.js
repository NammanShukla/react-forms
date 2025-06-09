import React, { useState } from 'react';
import './Form.css';

const Form = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const debounce = (fn, delay = 300) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), delay);
    };
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));

    debouncedValidateField(field, value);
  };

  const validateField = (field, value) => {
    let message = '';

    if (field === 'name') {
      if (!value.trim()) message = 'Name is required.';
      else if (!/^[A-Za-z\s]+$/.test(value)) message = 'Name can only contain alphabets.';
    }

    if (field === 'email') {
      if (!value.trim()) message = 'Email is required.';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) message = 'Enter a valid email.';
    }

    if (field === 'password') {
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
      const hasNumber = /\d/.test(value);
      const notSameAsName = value.toLowerCase() !== formData.name.toLowerCase();

      if (value.length < 6) message = 'Password must be at least 6 characters.';
      else if (!hasSpecialChar) message = 'Password must contain a special character.';
      else if (!hasNumber) message = 'Password must include a number.';
      else if (!notSameAsName) message = 'Password should not be the same as the name.';
    }

    setErrors((prev) => ({ ...prev, [field]: message }));
  };

  const debouncedValidateField = debounce(validateField);

  const handleSubmit = (e) => {
    e.preventDefault();

    const allErrors = {};
    validateField('name', formData.name);
    validateField('email', formData.email);
    validateField('password', formData.password);

    if (!formData.name.trim()) allErrors.name = 'Name is required.';
    if (!formData.email.trim()) allErrors.email = 'Email is required.';
    if (!formData.password.trim()) allErrors.password = 'Password is required.';

    setTouched({ name: true, email: true, password: true });

    const isFormValid = Object.values(allErrors).every((msg) => msg === '');

    if (isFormValid) {
      alert('Form submitted successfully!');
      setFormData({ name: '', email: '', password: '' });
      setErrors({});
      setTouched({});
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
        />
        {touched.name && errors.name && <div className="error">{errors.name}</div>}

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
        />
        {touched.email && errors.email && <div className="error">{errors.email}</div>}

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => handleChange('password', e.target.value)}
        />
        {touched.password && errors.password && <div className="error">{errors.password}</div>}

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Form;
