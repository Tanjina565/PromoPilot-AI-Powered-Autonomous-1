import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { config } from '../config/env.js';

// In-memory user store fallback if MongoDB is not connected in demo mode
const memoryUsers = new Map();

// Built-in assigned accounts for roles
const STATIC_USERS = [
  {
    _id: 'seed_owner_1',
    id: 'seed_owner_1',
    name: 'Rahim Ahmed (Owner)',
    email: 'owner@promopilot.com',
    password: 'password123',
    role: 'Business Owner',
    createdAt: '2026-01-10T10:00:00Z',
  },
  {
    _id: 'seed_admin_1',
    id: 'seed_admin_1',
    name: 'Farhana Kabir (Admin)',
    email: 'admin@promopilot.com',
    password: 'admin123',
    role: 'Admin',
    createdAt: '2026-01-05T08:00:00Z',
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

  // When a user signs up, their role is ALWAYS assigned to 'Business Owner' by default.
  // Only an Admin can elevate or assign roles from the Admin Dashboard.
  static async register({ name, email, password }) {
    const normalizedEmail = email.toLowerCase().trim();
    const assignedRole = 'Business Owner';

    if (STATIC_USERS.some((u) => u.email.toLowerCase() === normalizedEmail)) {
      throw new ApiError(409, 'A user with this email already exists.');
    }

    if (mongoose.connection.readyState === 1) {
      try {
        const existing = await User.findOne({ email: normalizedEmail });
        if (existing) {
          throw new ApiError(409, 'A user with this email already exists.');
        }

        const user = await User.create({ name, email: normalizedEmail, password, role: assignedRole });
        const userObj = user.toObject();
        delete userObj.password;

        const token = this.generateToken(userObj);
        return { user: userObj, token };
      } catch (err) {
        if (err instanceof ApiError) throw err;
      }
    }

    // Fallback store
    if (memoryUsers.has(normalizedEmail)) {
      throw new ApiError(409, 'A user with this email already exists.');
    }

    const id = 'mem_' + Date.now();
    const userObj = { _id: id, id, name, email: normalizedEmail, role: assignedRole, createdAt: new Date() };
    memoryUsers.set(normalizedEmail, { ...userObj, password });
    const token = this.generateToken(userObj);
    return { user: userObj, token };
  }

  static async login({ email, password }) {
    const normalizedEmail = email.toLowerCase().trim();

    // 1. Check built-in assigned users first for instant access
    const staticUser = STATIC_USERS.find(
      (u) => u.email.toLowerCase() === normalizedEmail && u.password === password
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
        const user = await User.findOne({ email: normalizedEmail }).select('+password');
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

    // 3. Check memory store fallback
    if (memoryUsers.has(normalizedEmail)) {
      const mem = memoryUsers.get(normalizedEmail);
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
      } catch (e) {
        // Fallback
      }
    }

    for (const [_, u] of memoryUsers.entries()) {
      if (u._id === userId || u.id === userId) {
        return { _id: u._id, id: u.id, name: u.name, email: u.email, role: u.role };
      }
    }

    throw new ApiError(404, 'User profile not found');
  }

  // Admin Only: Fetch all registered platform users
  static async getAllUsers() {
    let dbUsers = [];
    if (mongoose.connection.readyState === 1) {
      try {
        dbUsers = await User.find({}).select('-password');
      } catch (e) {}
    }

    const allUsersMap = new Map();

    for (const u of STATIC_USERS) {
      allUsersMap.set(u._id, {
        _id: u._id,
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt || '2026-01-01T00:00:00Z',
      });
    }

    for (const [_, u] of memoryUsers.entries()) {
      allUsersMap.set(u._id, {
        _id: u._id,
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt || new Date(),
      });
    }

    for (const u of dbUsers) {
      allUsersMap.set(u._id.toString(), {
        _id: u._id.toString(),
        id: u._id.toString(),
        name: u.name,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt,
      });
    }

    return Array.from(allUsersMap.values());
  }

  // Admin Only: Assign or change a user's role
  static async updateUserRole(userId, newRole) {
    if (!['Business Owner', 'Admin'].includes(newRole)) {
      throw new ApiError(400, 'Invalid role. Must be "Business Owner" or "Admin".');
    }

    // Check static accounts
    const staticItem = STATIC_USERS.find((u) => u._id === userId || u.id === userId);
    if (staticItem) {
      staticItem.role = newRole;
      return {
        _id: staticItem._id,
        id: staticItem.id,
        name: staticItem.name,
        email: staticItem.email,
        role: staticItem.role,
      };
    }

    // Check memory accounts
    for (const [email, u] of memoryUsers.entries()) {
      if (u._id === userId || u.id === userId) {
        u.role = newRole;
        memoryUsers.set(email, u);
        return {
          _id: u._id,
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
        };
      }
    }

    // Check MongoDB
    if (mongoose.connection.readyState === 1) {
      try {
        const updated = await User.findByIdAndUpdate(
          userId,
          { $set: { role: newRole } },
          { new: true }
        ).select('-password');
        if (updated) return updated;
      } catch (e) {}
    }

    throw new ApiError(404, 'User not found');
  }
}
