import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function findUserByEmail(email) {
  const client = await clientPromise;
  const collection = client.db().collection('users');
  return collection.findOne({ email });
}

export async function findUserById(id) {
  const client = await clientPromise;
  const collection = client.db().collection('users');
  return collection.findOne({ _id: new ObjectId(id) });
}

export async function createUser(userData) {
  const client = await clientPromise;
  const collection = client.db().collection('users');
  
  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password, salt);
  
  const newUser = {
    ...userData,
    password: hashedPassword,
    createdAt: new Date(),
    preferences: { interests: [] }
  };
  
  const result = await collection.insertOne(newUser);
  return { ...newUser, _id: result.insertedId };
}

export async function validatePassword(user, password) {
  return bcrypt.compare(password, user.password);
}

export async function updateUserPreferences(userId, interests) {
  const client = await clientPromise;
  const collection = client.db().collection('users');
  
  const result = await collection.updateOne(
    { _id: new ObjectId(userId) },
    { $set: { 'preferences.interests': interests } }
  );
  
  return result.modifiedCount > 0;
} 