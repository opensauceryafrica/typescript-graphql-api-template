export interface FlutterwaveConfig {
    public_key?: string;
    tx_ref?: string;
    amount?: number;
    currency?: string;
    payment_options?: string;
    redirect_url?: string;
    customer?: {
        email: string;
        phone_number?: string;
        name: string;
    };
    customizations?: {
        title: string;
        description: string;
        logo: string;
    };
    account_bank?: string;
    account_number?: string;
    narration?: string;
    beneficiary_name?: string;
    reference?: string;
}

export interface FlutterwaveEvent {
    event: string;
    data: {
        status: string;
        currency: string;
        amount: number;
        id: number;
        tx_ref: string;
        flw_ref: string;
        charged_amount: string;
        customer: {
            email: string;
            full_name: string;
        };
        reference: string;
        complete_message: string;
    };
    plan: {
        name: string;
        id: number;
        amount: number;
        status: string;
    };
}

export interface FlutterwaveTx {
    status: string;
    data: {
        amount: number;
        status: string;
        id: number;
        tx_ref: string;
        currency: string;
        amount_settled: number;
        charged_amount: number;
        card: {
            first_6digits: string;
            last_4digits: string;
            issuer: string;
            country: string;
            type: string;
            expiry: string;
            token: string;
        };
        customer: {
            id: number;
            name: string;
            phone_number: string;
            email: string;
            created_at: string;
        };
    };
}

export enum FlutterwaveStatus {
    ChargeCompleted = 'charge.completed',
    TransferCompleted = 'transfer.completed',
    Successful = 'successful',
    Success = 'success',
    Failed = 'failed',
    Error = 'error',
}
