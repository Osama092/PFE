export class User {
    userId!: number;
    userUsername!: string;
    userFirstName!: string;
    userLastName!: string;
    userEmail!: string;
    userPass!: string;
    userPhoneNumber!: number;
    userBirthDate: Date | null = null;
    userBio!: string;
    userProfilePic!: string;
    token?: string;
    
}
