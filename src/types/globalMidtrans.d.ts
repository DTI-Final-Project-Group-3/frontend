declare global {
  interface Window {
    snap: {
      pay: (
        token: string,
        callbacks?: {
          onSuccess?: (result: SnapSuccessResult) => void;
          onPending?: (result: SnapPendingResult) => void;
          onError?: (error: SnapErrorResult) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}

export interface SnapSuccessResult {
  transaction_id: string;
  order_id: string;
  status: string;
  gross_amount: number;
  payment_type: string;
}

export interface SnapPendingResult {
  transaction_id: string;
  order_id: string;
  status: string;
}

export interface SnapErrorResult {
  message: string;
  status_code: number;
}