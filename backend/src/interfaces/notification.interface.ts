// File: src/interfaces/notification.interface.ts
import { Document, Types } from 'mongoose';

export enum NotificationType {
  APPOINTMENT = 'appointment',
  VACCINATION = 'vaccination',
  REMINDER = 'reminder',
  SYSTEM = 'system'
}

export interface INotification extends Document {
  user: Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  relatedEntity?: Types.ObjectId;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}