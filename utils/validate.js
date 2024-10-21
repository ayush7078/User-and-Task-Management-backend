const validateUserRegistration = (data) => {
    const errors = [];
    if (!data.username) errors.push('Username is required');
    if (!data.password) errors.push('Password is required');
    return errors;
  };
  
  const validateUserLogin = (data) => {
    const errors = [];
    if (!data.username) errors.push('Username is required');
    if (!data.password) errors.push('Password is required');
    return errors;
  };
  
  const validateTaskCreation = (data) => {
    const errors = [];
    if (!data.title) errors.push('Task title is required');
    return errors;
  };
  
  module.exports = { validateUserRegistration, validateUserLogin, validateTaskCreation };
  