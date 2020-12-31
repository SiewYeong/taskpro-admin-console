export class Debit {
    amount: number;
    category: string;
    createdAt: any;
    payout: boolean;
    status: string;
    taskRef: any; // reference
    
    constructor(
        amount?: number,
        category?: string,
        createdAt?: any,
        payout?: boolean,
        status?: string,
        taskRef?: any,
    ) {}
}