import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    // משתמשי GitHub לא מקבלים סיסמה, ולכן השדה לא חובה
    passwordHash: { type: String, select: false },
    githubId: { type: String, unique: true, sparse: true },
  },
  { timestamps: true },
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
