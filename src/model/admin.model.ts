export interface Admin {
      adminId: string;
      login: string;
      name: string;
      phone: string;
      canIntegrate: boolean;
      canCreateUsers: boolean;
      isMaster: boolean;
      accessCode?: string;
      accessToken?: string;
      firstAccess?: boolean;
}
