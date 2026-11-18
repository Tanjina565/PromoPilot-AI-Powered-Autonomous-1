import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User } from '../User/user.model.js';
import { ApiError } from '../../utils/ApiError.js';
import { config } from '../../../config/env.js';

const memoryUsers = new Map();

const STATIC_USERS = [
  {
    _id: 'seed_owner_1',
    id: 'seed_owner_1',
    name: 'Rahim Ahmed (Owner)',
    email: 'owner@promopilot.com',
    password: 'password123',
    role: 'Business Owner',
  },
  {
    _id: 'seed_admin_1',
    id: 'seed_admin_1',
    name: 'Farhana Kabir (Admin)',
    email: 'admin@promopilot.com',
    password: 'admin123',
    role: 'Admin',
  },
];

export class AuthService {
  static generateToken(user) {
    return jwt.sign(
      {
        id: user._id || user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );
  }

  static async register({ name, email, password, role = 'Business Owner' }) {
    if (mongoose.connection.readyState === 1) {
      try {
        const existing = await User.findOne({ email });
        if (existing) {
          throw new ApiError(409, 'A user with this email already exists.');
        }

        const user = await User.create({ name, email, password, role });
        const userObj = user.toObject();
        delete userObj.password;

        const token = this.generateToken(userObj);
        return { user: userObj, token };
      } catch (err) {
        if (err instanceof ApiError) throw err;
      }
    }

    const id = 'mem_' + Date.now();
    const userObj = { _id: id, id, name, email, role };
    memoryUsers.set(email, { ...userObj, password });
    const token = this.generateToken(userObj);
    return { user: userObj, token };
  }

  static async login({ email, password }) {
    // 1. Check built-in assigned users first for instant access
    const staticUser = STATIC_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (staticUser) {
      const userObj = {
        _id: staticUser._id,
        id: staticUser.id,
        name: staticUser.name,
        email: staticUser.email,
        role: staticUser.role,
      };
      return { user: userObj, token: this.generateToken(userObj) };
    }

    // 2. Check MongoDB if connected
    if (mongoose.connection.readyState === 1) {
      try {
        const user = await User.findOne({ email }).select('+password');
        if (user) {
          const isMatch = await user.comparePassword(password);
          if (isMatch) {
            const userObj = user.toObject();
            delete userObj.password;
            return { user: userObj, token: this.generateToken(userObj) };
          }
        }
      } catch (e) {
        // Fallback
      }
    }

    // 3. Fallback store
    if (memoryUsers.has(email)) {
      const mem = memoryUsers.get(email);
      if (mem.password === password) {
        const userObj = { _id: mem._id, id: mem.id, name: mem.name, email: mem.email, role: mem.role };
        return { user: userObj, token: this.generateToken(userObj) };
      }
    }

    throw new ApiError(401, 'Invalid email or password');
  }

  static async getProfile(userId) {
    const staticUser = STATIC_USERS.find((u) => u._id === userId || u.id === userId);
    if (staticUser) {
      return {
        _id: staticUser._id,
        id: staticUser.id,
        name: staticUser.name,
        email: staticUser.email,
        role: staticUser.role,
      };
    }

    if (mongoose.connection.readyState === 1) {
      try {
        const user = await User.findById(userId).select('-password');
        if (user) return user;
      } catch (e) {}
    }

    for (const [_, u] of memoryUsers.entries()) {
      if (u._id === userId || u.id === userId) {
        return { _id: u._id, id: u.id, name: u.name, email: u.email, role: u.role };
      }
    }

    throw new ApiError(404, 'User profile not found');
  }
}
