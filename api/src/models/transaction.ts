import mongoose, { Document, Schema } from "mongoose";

export interface ITransaction extends Document {
    userId: string;
    amount: number;
    transactionType: string;
    note?: string;
    bankName: string;
    accountNumber: string;
    accountName: string;
    phoneNumber: string;
    network: string;
    dataPlan: string;
    electricityMeter: string;
    transactionPin: string;
    createdAt: Date;
    updatedAt: Date;
}

const TransactionSchema: Schema = new Schema(
    {
        userId: { type: String, required: true, index: true },
        amount: { type: Number, required: true },
        transactionType: { type: String, required: true },
        note: { type: String, required: false },
        bankName: { type: String, required: false },
        accountNumber: { type: String, required: false, index: true },
        accountName: { type: String, required: false },
        phoneNumber: { type: String, required: false },
        network: { type: String, required: false },
        dataPlan: { type: String, required: false },
        electricityMeter: { type: String, required: false, index: true },
    },
    { timestamps: true }
);

const Transaction = mongoose.model<ITransaction>("Transaction", TransactionSchema);

export default Transaction;