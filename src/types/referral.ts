export interface Referral {
  full_name: string;
  username: string;
  date: string;
}

export interface ReferralsResponse {
  message: null;
  data: Referral[];
}