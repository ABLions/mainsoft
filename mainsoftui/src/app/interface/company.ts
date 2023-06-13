import { Product } from "./product";

export interface Company {
  companyName: string;
  nit: string;
  address?: string;
  phone?: string;
  products?: Product[];
}
