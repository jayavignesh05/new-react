export const calculateProfileCompletion = (formData) => {
  if (!formData) {
    return 0;
  }

  // Intha intha fields mattum thaan kanakku'nu theliva solrom
  const fieldsToCheck = [
    'first_name', 'last_name', 'master_gender_id', 'date_of_birth',
    'email_id', 'contact_no', 'master_country', 'master_state',
    'address', 'door_no', 'street', 'area', 'city', 'pincode',
    'status', 'institute', 'degree',
  ];

  const totalFields = fieldsToCheck.length;
  let filledFields = 0;

  fieldsToCheck.forEach(field => {
    const value = formData[field];
    if (value !== null && value !== undefined && value !== "") {
      filledFields++;
    }
  });

  if (totalFields === 0) return 0;
  const percentage = Math.round((filledFields / totalFields) * 100);

  return Math.min(100, percentage);
};