import { Notification } from './notification';
import { User } from './user';

export class DialogData {
    user: User;
    notif: Notification;
    dialogFn: number;
    
    constructor() {
    }
}