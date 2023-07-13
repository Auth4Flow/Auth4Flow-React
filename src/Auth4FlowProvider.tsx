import React, { ReactNode, useCallback, useEffect, useState } from "react";
import {
  Auth4FlowClient,
  CheckMany,
  Check,
  PermissionCheck,
  FeatureCheck,
} from "@auth4flow/auth4flow-js";

import Auth4FlowContext from "./Auth4FlowContext";
import cookieCutter from "@boiseitguru/cookie-cutter";

export interface AuthorizationProvider {
  clientKey: string;
  endpoint?: string;
  children: ReactNode;
}

const LOCAL_STORAGE_KEY_SESSION_TOKEN = "__auth4FlowSessionToken";

function Auth4FlowProvider(options: AuthorizationProvider): JSX.Element {
  const { clientKey, endpoint, children } = options;
  const [sessionToken, setSessionToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const storedSessionToken = cookieCutter.get(
      LOCAL_STORAGE_KEY_SESSION_TOKEN
    );
    if (storedSessionToken) {
      setSessionToken(storedSessionToken);
    }
  }, []);

  const updateSessionToken = (newSessionToken: string) => {
    setSessionToken(newSessionToken);

    cookieCutter.set(LOCAL_STORAGE_KEY_SESSION_TOKEN, newSessionToken);
  };

  const login = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    const newSessionToken = await new Auth4FlowClient({
      clientKey,
      endpoint,
    }).login();

    if (newSessionToken) {
      updateSessionToken(newSessionToken);
    }
    setIsLoading(false);

    return sessionToken !== null;
  }, []);

  const validSession = useCallback(async (): Promise<boolean> => {
    if (!sessionToken) {
      return false;
    }

    setIsLoading(true);
    const isValidSession = await new Auth4FlowClient({
      clientKey,
      sessionToken,
      endpoint,
    }).verifySession();

    if (!isValidSession) {
      updateSessionToken("");
    }

    setIsLoading(false);

    return isValidSession;
  }, [sessionToken]);

  const check = useCallback(
    async (check: Check): Promise<boolean> => {
      if (!sessionToken) {
        throw new Error(
          "No session provided to Auth4Flow. You may have forgotten to call login() to finish initializing Auth4Flow."
        );
      }

      setIsLoading(true);
      const isAuthorized = await new Auth4FlowClient({
        clientKey,
        sessionToken,
        endpoint,
      }).check(check);
      setIsLoading(false);

      return isAuthorized;
    },
    [sessionToken]
  );

  const checkMany = useCallback(
    async (check: CheckMany): Promise<boolean> => {
      if (!sessionToken) {
        throw new Error(
          "No session provided to Auth4Flow. You may have forgotten to call login() to finish initializing Auth4Flow."
        );
      }

      setIsLoading(true);
      const isAuthorized = await new Auth4FlowClient({
        clientKey,
        sessionToken,
        endpoint,
      }).checkMany(check);
      setIsLoading(false);

      return isAuthorized;
    },
    [sessionToken]
  );

  const hasPermission = useCallback(
    async (check: PermissionCheck): Promise<boolean> => {
      if (!sessionToken) {
        throw new Error(
          "No session provided to Auth4Flow. You may have forgotten to call login() to finish initializing Auth4Flow."
        );
      }

      setIsLoading(true);
      const hasPermission = await new Auth4FlowClient({
        clientKey,
        sessionToken,
        endpoint,
      }).hasPermission(check);
      setIsLoading(false);

      return hasPermission;
    },
    [sessionToken]
  );

  const hasFeature = useCallback(
    async (check: FeatureCheck): Promise<boolean> => {
      if (!sessionToken) {
        throw new Error(
          "No session provided to Auth4Flow. You may have forgotten to call login() to finish initializing Auth4Flow."
        );
      }

      setIsLoading(true);
      const hasFeature = await new Auth4FlowClient({
        clientKey,
        sessionToken,
        endpoint,
      }).hasFeature(check);
      setIsLoading(false);

      return hasFeature;
    },
    [sessionToken]
  );

  return (
    <Auth4FlowContext.Provider
      value={{
        clientKey,
        login,
        sessionToken,
        validSession,
        check,
        checkMany,
        hasPermission,
        hasFeature,
        isLoading,
      }}
    >
      {children}
    </Auth4FlowContext.Provider>
  );
}

export default Auth4FlowProvider;
