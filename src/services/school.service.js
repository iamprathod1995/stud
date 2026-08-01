import { query } from '../config/db.js';

let defaultSchools = [
  {
    id: 1,
    school_code: 'SCH-001',
    school_name: 'VidyaSetu Main Campus',
    city: 'Sahara Springs',
    state: 'California',
    pincode: '92262',
    address: '104 Oasis Avenue, Block B',
    phone: '+1 (555) 234-8900',
    email: 'main@saharaacademy.edu',
    logo: '',
    status: 'Active',
  },
  {
    id: 2,
    school_code: 'SCH-002',
    school_name: 'Sahara International North Campus',
    city: 'Springdale',
    state: 'California',
    pincode: '92263',
    address: '405 Pine Street, North Wing',
    phone: '+1 (555) 789-1122',
    email: 'north@saharainternational.edu',
    logo: '',
    status: 'Active',
  },
  {
    id: 3,
    school_code: 'SCH-003',
    school_name: 'Sahara Public School East',
    city: 'Eastwood',
    state: 'California',
    pincode: '92264',
    address: '88 Lake View Road',
    phone: '+1 (555) 444-9988',
    email: 'east@saharapublic.edu',
    logo: '',
    status: 'Active',
  },
];

export const getSchoolsList = async () => {
  try {
    const rows = await query('SELECT * FROM schools ORDER BY id ASC');
    if (rows && rows.length > 0) return rows;
  } catch (err) {
    // Fallback to in-memory store
  }
  return defaultSchools;
};

export const getSchoolById = async (id) => {
  try {
    const rows = await query('SELECT * FROM schools WHERE id = ? OR school_code = ? LIMIT 1', [id, id]);
    if (rows && rows.length > 0) return rows[0];
  } catch (err) {
    const found = defaultSchools.find(s => s.id === Number(id) || s.school_code === id);
    if (found) return found;
  }
  return null;
};

export const createOrUpdateSchool = async (data) => {
  const { 
    id, 
    schoolCode, 
    school_code: reqSchoolCode, 
    school_name, 
    name, 
    city, 
    state, 
    pincode, 
    address, 
    phone, 
    email, 
    logo, 
    status = 'Active' 
  } = data;

  const finalSchoolCode = schoolCode || reqSchoolCode || `SCH-00${defaultSchools.length + 1}`;
  const finalSchoolName = school_name || name || 'VidyaSetu';
  const finalCity = city || '';
  const finalState = state || '';
  const finalPincode = pincode || '';
  const finalAddress = address || '';
  const finalPhone = phone || '';
  const finalEmail = email || '';
  const finalLogo = logo || '';

  if (id) {
    // Update Query (Added logo, state, pincode)
    try {
      await query(
        `UPDATE schools SET school_code=?, school_name=?, city=?, state=?, pincode=?, address=?, phone=?, email=?, logo=?, status=? WHERE id=?`,
        [finalSchoolCode, finalSchoolName, finalCity, finalState, finalPincode, finalAddress, finalPhone, finalEmail, finalLogo, status, id]
      );
    } catch (err) {
      const idx = defaultSchools.findIndex(s => s.id === Number(id));
      if (idx !== -1) {
        defaultSchools[idx] = { 
          ...defaultSchools[idx], 
          school_code: finalSchoolCode, 
          school_name: finalSchoolName, 
          city: finalCity, 
          state: finalState, 
          pincode: finalPincode, 
          address: finalAddress, 
          phone: finalPhone, 
          email: finalEmail, 
          logo: finalLogo, 
          status 
        };
      }
    }
    return { id, school_code: finalSchoolCode, school_name: finalSchoolName, city: finalCity, state: finalState, pincode: finalPincode, address: finalAddress, phone: finalPhone, email: finalEmail, logo: finalLogo, status };
  } else {
    // Create new school Query (Added logo, state, pincode)
    const newSchool = {
      id: Date.now(),
      school_code: finalSchoolCode,
      school_name: finalSchoolName,
      city: finalCity,
      state: finalState,
      pincode: finalPincode,
      address: finalAddress,
      phone: finalPhone,
      email: finalEmail,
      logo: finalLogo,
      status,
    };

    try {
      const res = await query(
        `INSERT INTO schools (school_code, school_name, city, state, pincode, address, phone, email, logo, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [newSchool.school_code, newSchool.school_name, newSchool.city, newSchool.state, newSchool.pincode, newSchool.address, newSchool.phone, newSchool.email, newSchool.logo, newSchool.status]
      );
      if (res && res.insertId) newSchool.id = res.insertId;
    } catch (err) {
      defaultSchools.push(newSchool);
    }

    return newSchool;
  }
};

export const deleteSchool = async (id) => {
  try {
    await query('DELETE FROM schools WHERE id = ?', [id]);
  } catch (err) {
    defaultSchools = defaultSchools.filter(s => s.id !== Number(id));
  }
  return true;
};