import { getDB } from "../config/db.js";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

// Helper function for safe ObjectId conversion
const toObjectId = (id) => {
  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
};

// REGISTER USER
export const registerUser = async (req, res) => {
  try {
    const db = getDB();

    const requiredFields = {
      name: {
        firstName: "",
        middleName: "",
        lastName: "",
      },
      email: "",
      password: "",
      designation: "",
      role: [],
      office: "",
      mobileNumber: "",
      officeLandlineNumber: "",
      officeAddress: "",
    };

    // Check for missing keys
    for (const key in requiredFields) {
      if (!Object.keys(req.body).includes(key)) {
        return res.status(400).json({ message: `Missing key: ${key}` });
      }

      if (!req.body[key]) {
        return res
          .status(400)
          .json({ message: `Value for key '${key}' is missing` });
      }
    }

    const { email, password } = req.body;

    // Check for existing user
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User is already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      ...req.body,
      createdAt: new Date(),
      password: hashedPassword,
    };

    const result = await db.collection("users").insertOne(newUser);

    return res
      .status(201)
      .json({ message: "User registered successfully", userId: result.insertedId });
  } catch (error) {
    console.error("Register User Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET ALL USERS
export const getAllUser = async (req, res) => {
  try {
    const db = getDB();
    const users = await db.collection("users").find({}).project({ password: 0 }).toArray();
    return res
      .status(200)
      .json({ message: "Users fetched successfully", users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

//GET USER BY ID
export const getUserById = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    const _id = toObjectId(id);

    if (!_id) return res.status(400).json({ message: "Invalid user ID" });

    const user = await db.collection("users").findOne(
      { _id },
      { projection: { password: 0 } }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Get User by ID Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// UPDATE USER
export const updateUser = async (req, res) => {
  try {
    const db = getDB();
    const { id, ...others } = req.body;

    // 1. ID check
    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // 2. ID validate karo
    let _id;
    try {
      _id = new ObjectId(id);
    } catch {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    //3. Check user exist karta hai ya nahi
    const user = await db.collection("users").findOne({ _id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 4. Password hashing (agar bheja gaya ho)
    if (others.password && others.password.length) {
      others.password = await bcrypt.hash(others.password, 10);
    }

    // 5. Prepare dynamic update objects
    const setFields = {};
    const addToSetFields = {};
    const pullFields = {};

    for (const [key, value] of Object.entries(others)) {
      // Add to array (unique)
      if (key.startsWith("addToArray.")) {
        const field = key.replace("addToArray.", "");
        addToSetFields[field] = value;
      }

      // Remove from array
      else if (key.startsWith("removeFromArray.")) {
        const field = key.replace("removeFromArray.", "");
        pullFields[field] = value;
      }

      //Normal field update
      else {
        setFields[key] = value;
      }
    }

    // 6. Final update object
    const updateOps = {};
    if (Object.keys(setFields).length) updateOps.$set = setFields;
    if (Object.keys(addToSetFields).length) updateOps.$addToSet = addToSetFields;
    if (Object.keys(pullFields).length) updateOps.$pull = pullFields;

    // 7. Validation: agar kuch update bheja hi nahi
    if (Object.keys(updateOps).length === 0) {
      return res.status(400).json({ message: "No valid update fields provided" });
    }

    // 8. Actual update
    const result = await db.collection("users").updateOne({ _id }, updateOps);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // 9. Check if something actually changed
    if (result.modifiedCount === 0) {
      return res.status(400).json({ message: "No changes were made" });
    }

    // 10. Success response
    return res.status(200).json({
      message: "User updated successfully",
      updatedFields: Object.keys(others),
    });

  } catch (error) {
    console.error("Update User Error:", error);
    return res.status(500).json({ message: "Server error saneep" });
  }
};

// DELETE USER
export const deleteUser = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;

    if (!id||!ObjectId.isValid(id))
      return res.status(400).json({ message: "User ID is required to delete" });

    const user = await db.collection("users").findOne({ _id:new ObjectId(id) });
    if (!user) return res.status(404).json({ message: "User not found" });

    await db.collection("users").deleteOne({ _id:new ObjectId(id) });

    return res
      .status(200)
      .json({ message: `User ${user.email} deleted successfully` });
  } catch (error) {
    console.error("Delete User Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}; 
