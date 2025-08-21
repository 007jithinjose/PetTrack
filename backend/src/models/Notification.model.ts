//File src/models/Notfication.model.ts
import { Schema, model } from 'mongoose';
import { INotification } from '../interfaces';

export enum NotificationType {
  APPOINTMENT = 'appointment',
  VACCINATION = 'vaccination',
  REMINDER = 'reminder',
  SYSTEM = 'system'
}

const notificationSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { 
      type: String, 
      enum: Object.values(NotificationType),
      required: true 
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    relatedEntity: { type: Schema.Types.ObjectId },
    read: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default model<INotification>('Notification', notificationSchema);