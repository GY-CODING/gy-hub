import { ObjectId } from "mongodb";

// GYAccounts.Metadata
export interface AccountMetadata {
  _id: ObjectId;
  userId: string;
  profile: {
    id: string;
    username: string;
    email: string;
    phoneNumber?: string;
    roles: string[];
    apiKey: string;
    picture: string;
  };
  _class: string;
}

// GYBooks.Metadata
export interface BookMetadata {
  _id: ObjectId;
  profileId: string;
  friends?: string[];
  biography?: string;
  hallOfFame?: {
    books?: string[];
    quote?: string;
  };
  activity?: Array<{
    _id: string;
    message: string;
    date: Date;
  }>;
  _class: string;
}
