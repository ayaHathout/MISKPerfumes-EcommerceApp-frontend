export interface Address {
  addressId?: number | string;
  state: string;
  city: string;
  street: string;
  departmentNumber?: string | number;
}
