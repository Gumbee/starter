import { FC, PropsWithChildren, useEffect, useLayoutEffect, useState } from "react";
import { useSetUser, useSetUserIfEmpty } from "..";
import { User } from "@logbook/database";
import { api } from "@logbook/api/client";
import { ROUTES } from "@logbook/api/routes";

type AuthProviderProps = PropsWithChildren;

export const AuthProvider: FC<AuthProviderProps> = ({children}) => {
  const [e, setE] = useState(false);

  const setUser = useSetUser()
  const setUserIfEmpty = useSetUserIfEmpty()

  useLayoutEffect(() => {
    const store = window.localStorage.getItem('user')

    if(store){
      console.log('Yes we updated user');

      const user = JSON.parse(store) as User

      setE(true)
      setUserIfEmpty(user);
    }
  }, [])

  useEffect(() => {
    // api.get<User>(ROUTES.getMe()).then(x => x.data).then(setUser).catch();
  }, [])

  if(e) return null;
  
  return children
};