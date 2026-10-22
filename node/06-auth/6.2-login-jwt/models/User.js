import mongoose from "mongoose";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "מייל לא תקין"],
    },
    // select: false -> never loaded by find() unless asked for with .select("+password")
    password: { type: String, required: true, minlength: 8, select: false },
  },
  {
    timestamps: true,
    // a document that was just created still holds the hash in memory, so strip it from JSON too
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// validation (minlength: 8) runs on the plain password first, then we replace it with the hash
userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
  }
});

export const User = mongoose.model("User", userSchema);
