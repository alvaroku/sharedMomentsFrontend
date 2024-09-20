import { ResourceResponse } from "../../moment/models/resource-response.model";

export interface ProfileResponse {
  name: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: Date;
  profile?: ResourceResponse;
}
