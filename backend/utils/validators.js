// Validate email format
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
const validatePassword = (password) => {
  return password && password.length >= 6;
};

// Validate phone number
const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};

// Validate price
const validatePrice = (price) => {
  return price && !isNaN(price) && price > 0;
};

// Validate rating
const validateRating = (rating) => {
  const num = parseInt(rating);
  return num >= 1 && num <= 5;
};

module.exports = {
  validateEmail,
  validatePassword,
  validatePhone,
  validatePrice,
  validateRating
};
