import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  fullname: string;
  bvn?: string;
  phoneNumber?: string;
  ssoId?: string;
  ssoProvider?: string;
  completeRegistration?: boolean;
  verifiedEmail: boolean;
  transactionPinSet?: boolean;
  transactionPin: string;
  balance: number;
  picture?: string;
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
    bvn: { type: String, required: false },
    phoneNumber: { type: String, required: false },
    ssoId: { type: String, required: false },
    ssoProvider: { type: String },
    verifiedEmail: { type: Boolean, default: false },
    completeRegistration: { type: Boolean, default: false },
    transactionPinSet: { type: Boolean, default: false },
    transactionPin: {
      type: String,
      required: false,
      length: 4,
      default: '0000',
    },
    balance: { type: Number, default: 0 },
    picture: {
      type: String,
      default:
        'https://res.cloudinary.com/dzdvous3v/image/upload/v1701630791/moniepaddy/6544f1ced8e5feb4b004943a-pic3-1701630771000.jpg',
    },
  },
  { timestamps: true },
);

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
