import React from "react";
import { User } from "./index";
import { observer } from "mobx-react";
import { UserContext } from "./UserContext";
import { loadUserProfileService } from "@/services/user/loadUserProfile";


type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export const UserProvider = observer(
  ({ children }: { children: React.ReactNode }) => {
    const [user] = React.useState(new User());

    React.useEffect(() => {
      const loadUser = async () => {
        try {
            
          const tokensJson = localStorage.getItem('authTokens');
          if (!tokensJson) return;
          
          const tokens: Tokens = JSON.parse(tokensJson);
          if (!tokens.accessToken || !tokens.refreshToken) return;

          user.setTokens(tokens);
          
          const service = new loadUserProfileService(user);
          const result = await service.execute();
          
          if (!result.ok) {
            user.unauthorize();
            localStorage.removeItem('authTokens');
          }
        } catch (error) {
          console.error('Auth error:', error);
          localStorage.removeItem('authTokens');
        }
      };

      loadUser();
    }, [user]);

    return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
  }
);