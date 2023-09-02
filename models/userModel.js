import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
// userSchema.pre("save", async function(next) {
//   if(!this.isModified("password")){
//     next()
//   }
//   this.password = await bcrypt.hash(this.password, 10)
// })

const User = mongoose.model("User", userSchema);

export default User;
