import { query } from '../config/db.js';

let defaultSettings = {
  school_name: 'VidyaSetu',
  tagline: 'Education Excellence',
  logo_url: '',
  address: '104 Oasis Avenue, Block B',
  city: 'Sahara Springs',
  state: 'California',
  pincode: '92262',
  phone: '+1 (555) 234-8900',
  email: 'admin@saharaacademy.edu',
  principal_name: 'Dr. Evelyn Vance',
  affiliation_number: 'CBSE-987412-AC',
  established_year: '1998',
  website: 'https://saharaacademy.edu',
};

export const getSchoolSettings = async () => {
  try {
    const rows = await query('SELECT * FROM school_settings WHERE id = 1 LIMIT 1');
    if (rows && rows.length > 0) return rows[0];
  } catch (err) {
    // Fallback
  }
  return defaultSettings;
};

export const updateSchoolSettings = async (data, logoUrl = null) => {
  const updated = {
    ...defaultSettings,
    ...data,
    logo_url: logoUrl || data.logo_url || data.logoUrl || defaultSettings.logo_url,
    school_name: data.school_name || data.schoolName || defaultSettings.school_name,
    principal_name: data.principal_name || data.principalName || defaultSettings.principal_name,
    affiliation_number: data.affiliation_number || data.affiliationNumber || defaultSettings.affiliation_number,
    established_year: data.established_year || data.establishedYear || defaultSettings.established_year,
  };

  try {
    await query(
      `INSERT INTO school_settings (id, school_name, tagline, logo_url, address, city, state, pincode, phone, email, principal_name, affiliation_number, established_year, website)
       VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       school_name=VALUES(school_name), tagline=VALUES(tagline), logo_url=VALUES(logo_url), address=VALUES(address), city=VALUES(city), state=VALUES(state), pincode=VALUES(pincode), phone=VALUES(phone), email=VALUES(email), principal_name=VALUES(principal_name), affiliation_number=VALUES(affiliation_number), established_year=VALUES(established_year), website=VALUES(website)`,
      [
        updated.school_name,
        updated.tagline,
        updated.logo_url,
        updated.address,
        updated.city,
        updated.state,
        updated.pincode,
        updated.phone,
        updated.email,
        updated.principal_name,
        updated.affiliation_number,
        updated.established_year,
        updated.website,
      ]
    );
  } catch (err) {
    defaultSettings = { ...updated };
  }

  return updated;
};
