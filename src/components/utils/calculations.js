export const calculateProfileCompletion = (formData) => {
  // formData illainaa, 0 thiruppi anuppidalam
  if (!formData || Object.keys(formData).length === 0) {
    return 0;
  }

  // Profile completion-ku entha fields laam thevai'nu inga solrom
  // We are defining all the fields required for profile completion here
  const fieldsToCheck = [
    // Personal Details
    'first_name', 
    'last_name', 
    'master_gender_id', 
    'date_of_birth',
    'linkedin_url',

    // Communication Details
    'email_id', 
    'contact_no', 
    'master_country', 
    'master_state',
    'address', 
    'door_no', 
    'street', 
    'area', 
    'city', 
    'pincode',

    // Career Details
    'status', 
    // Education
    'institute', 
    'degree',
    'graduation_date',
    // Professional
    'company_name',
    'designation',
    'joining_date',
    'total_experience',
  ];

  const totalFields = fieldsToCheck.length;
  let filledFields = 0;

  // Ovvoru field'um fill aagirukka'nu check panrom
  fieldsToCheck.forEach(field => {
    const value = formData[field];
    // value irunthaa (null, undefined, empty string illaama), count ah yethurom
    if (value !== null && value !== undefined && String(value).trim() !== "") {
      filledFields++;
    }
  });

  // Percentage kanakkidrom
  if (totalFields === 0) return 0;
  const percentage = Math.round((filledFields / totalFields) * 100);

  // Percentage 100-ku mela pogaama paathukurom
  return Math.min(100, percentage);
};