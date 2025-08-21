// src/lib/models/RequestModel.ts

// Make sure to import everything needed from mongoose
import mongoose, { Document, Schema, model, models } from 'mongoose';

// Define the structure of a request document
export interface IRequest extends Document {
  requestorName: string;
  itemRequested: string;
  status: 'pending' | 'completed' | 'approved' | 'rejected';

  createdDate: Date;
  lastEditedDate: Date;
}

// mongoose scheme for the request
const RequestSchema = new Schema<IRequest>(
  {
    
    requestorName: {
      type: String,
      required: [true, 'Quantity is required.'],
      trim: true,
      minlength: [3, 'Must be between 3-30 characters'],
      maxlength: [30, 'Must be between 3-30 characters']

    },
    itemRequested: {
      type: String,
      required: [true, "Item Requested is required"],
      trim: true,
      minlength: [2, 'Must be between 2-100 characters'],
      maxlength: [100, 'Must be between 2-100 characters']
      
    },
    
    status: {
      type: String,
      enum: ['pending', 'completed', 'approved', 'rejected'],
      default: 'pending'
    }
  },
  {
    timestamps: true,
  }
);


const RequestModel = models.Request || model<IRequest>('Request', RequestSchema);

export default RequestModel;