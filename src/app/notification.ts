import { User } from './user';

export class Notification {
    notificationId?: number;
    notificationSender!: number;
    notificationProduct?: number;
    notificationType!: number;
    notificationReceiver?: number;
    notificationDate!: Date;
    senderDetails!: User;



}
