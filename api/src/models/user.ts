import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password?: string;
  fullname: string;
  ssoId?: string;
  ssoProvider?: string;
  verifiedEmail: boolean;
}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: false },
    fullname: { type: String, required: true },
    ssoId: { type: String, required: false },
    ssoProvider: {type: String},
    verifiedEmail: {type: Boolean, default: false}
  },
  { timestamps: true },
);

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
