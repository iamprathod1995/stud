import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { query } from '../config/db.js';

export const loginUser = async (email, password) => {

  const secret = process.env.JWT_SECRET || 'sahara_academy_super_secret_jwt_key_2026';
  const expiresIn = process.env.JWT_EXPIRES_IN || '1d';

  if (!email || !password) {
    throw {
      statusCode: 400,
      message: 'Email and password are required.'
    };
  }

  let user;

  try {
    // Sahi column names (school_name, logo, etc.) ke sath JOIN query
    const rows = await query(
      `SELECT u.id, u.name, u.school_id, u.email, u.password, u.role, u.avatar, u.status,
              s.school_name, s.logo AS school_logo, s.phone AS school_phone, s.city AS school_city
       FROM users u
       LEFT JOIN schools s ON u.school_id = s.id
       WHERE u.email = ? LIMIT 1`,
      [email]
    );

    if (!rows || rows.length === 0) {
      throw {
        statusCode: 401,
        message: 'Invalid email or password.'
      };
    }

    user = rows[0];

  } catch (error) {

    if (error.statusCode) {
      throw error;
    }

    throw {
      statusCode: 500,
      message: 'Database error.'
    };

  }


  if (user.status === 0) {
    throw {
      statusCode: 403,
      message: 'Account is inactive.'
    };
  }


  // Check if role is 1 or 2 (Only role 1 and 2 are allowed to login)
  if (user.role !== 1 && user.role !== 2) {
    throw {
      statusCode: 403,
      message: 'You do not have permission to access this portal.'
    };
  }


  const passwordMatch = await bcrypt.compare(
    password,
    user.password
  );


  if (!passwordMatch) {
    throw {
      statusCode: 401,
      message: 'Invalid email or password.'
    };
  }


  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      school_id: user.school_id 
    },
    secret,
    {
      expiresIn
    }
  );


  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      school_id: user.school_id,
      school_name: user.school_name || 'SchoolSanchalan',
      school_logo: user.school_logo || '',
      school_city: user.school_city || ''
    }
  };

};


export const loginTeacher = async (email, password) => {

  const secret = process.env.JWT_SECRET || 'sahara_academy_super_secret_jwt_key_2026';
  const expiresIn = process.env.JWT_EXPIRES_IN || '1d';

  if (!email || !password) {
    throw {
      statusCode: 400,
      message: 'Email and password are required.'
    };
  }

  let user;

  try {
    const rows = await query(
      `SELECT u.id, u.name, u.school_id, u.email, u.password, u.role, u.avatar, u.status,
              s.school_name, s.logo AS school_logo, s.phone AS school_phone, s.city AS school_city
       FROM users u
       LEFT JOIN schools s ON u.school_id = s.id
       WHERE u.email = ? LIMIT 1`,
      [email]
    );

    if (!rows || rows.length === 0) {
      throw {
        statusCode: 401,
        message: 'Invalid email or password.'
      };
    }

    user = rows[0];

  } catch (error) {

    if (error.statusCode) {
      throw error;
    }

    throw {
      statusCode: 500,
      message: 'Database error.'
    };

  }

  if (user.status === 0) {
    throw {
      statusCode: 403,
      message: 'Account is inactive.'
    };
  }

  // Updated Check: Only role 4 is allowed to login
  if (user.role !== 4) {
    throw {
      statusCode: 403,
      message: 'You do not have permission to access this portal.'
    };
  }

  const passwordMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!passwordMatch) {
    throw {
      statusCode: 401,
      message: 'Invalid email or password.'
    };
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      school_id: user.school_id 
    },
    secret,
    {
      expiresIn
    }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      school_id: user.school_id,
      school_name: user.school_name || 'SchoolSanchalan',
      school_logo: user.school_logo || '',
      school_city: user.school_city || ''
    }
  };

};

export const changePassword = async (userId, oldPassword, newPassword) => {
  if (!userId || !oldPassword || !newPassword) {
    throw {
      statusCode: 400,
      message: 'All fields (userId, oldPassword, newPassword) are required.'
    };
  }

  if (newPassword.length < 6) {
    throw {
      statusCode: 400,
      message: 'New password must be at least 6 characters long.'
    };
  }

  try {
    // 1. Database se user ka current password hash fetch karein
    const rows = await query(
      `SELECT id, password FROM users WHERE id = ? LIMIT 1`,
      [userId]
    );

    if (!rows || rows.length === 0) {
      throw {
        statusCode: 404,
        message: 'User not found.'
      };
    }

    const user = rows[0];

    // 2. Old password match check karein
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);

    if (!passwordMatch) {
      throw {
        statusCode: 401,
        message: 'Incorrect old password.'
      };
    }

    // 3. New password ko hash karein
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // 4. Database me password update karein
    await query(
      `UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [hashedNewPassword, userId]
    );

    return {
      success: true,
      message: 'Password changed successfully.'
    };

  } catch (error) {
    if (error.statusCode) {
      throw error;
    }

    console.error('Change password error:', error);
    throw {
      statusCode: 500,
      message: 'Database error during password update.'
    };
  }
};