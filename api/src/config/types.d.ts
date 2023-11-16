import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export interface NetworkItem {
  desc: string;
  id: string;
  name: string;
  sector: string;
}

export interface Network {
  name: string;
  id: string;
}

interface DataMeta {
  data_expiry: string;
  currency: string;
  data_value: string;
  fee: string;
}

export interface PlanReturn {
  id: string;
  meta: DataMeta;
}

export interface DataPlan {
  category: string;
  desc?: string | null;
  fee_type: string;
  id: string;
  meta: DataMeta;
  name: string;
  operator: string;
}
