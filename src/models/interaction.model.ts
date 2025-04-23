import mongoose, { Schema, Document } from "mongoose";

export interface IInteraction extends Document {
  userId: mongoose.Types.ObjectId;
  prompt: string;
  response: string;
  fileName?: string;
  fileType?: string;
  createdAt: Date;
}

const InteractionSchema: Schema = new Schema<IInteraction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    prompt: { type: String, required: true },
    response: { type: String, required: true },
    fileName: { type: String },
    fileType: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IInteraction>("Interaction", InteractionSchema);
