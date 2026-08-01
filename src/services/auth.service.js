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

    const rows = await query(
      `SELECT id,name,school_id ,email,password,role,avatar,status FROM users WHERE email=? LIMIT 1`,
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
      school_id: user.school_id 
    }
  };

};