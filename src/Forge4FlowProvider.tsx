import React, { ReactNode, useCallback, useEffect, useState } from "react";
import {
  Forge4FlowClient,
  CheckMany,
  Check,
  PermissionCheck,
  FeatureCheck,
} from "@forge4flow/forge4flow-js";

import Forge4FlowContext from "./Forge4FlowContext";
import cookieCutter from "@boiseitguru/cookie-cutter";

export interface AuthorizationProvider {
  clientKey: string;
  endpoint?: string;
  children: ReactNode;
}

const LOCAL_STORAGE_KEY_SESSION_TOKEN = "__forge4FlowSessionToken";

function Forge4FlowProvider(options: AuthorizationProvider): JSX.Element {
  const { clientKey, endpoint, children } = options;
  const [sessionToken, setSessionToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const storedSessionToken = cookieCutter.get(
      LOCAL_STORAGE_KEY_SESSION_TOKEN
    );
    if (storedSessionToken) {
      setSessionToken(storedSessionToken);
      setIsAuthenticated(true);
    }
  }, []);

  const updateSessionToken = (newSessionToken?: string) => {
    setSessionToken(newSessionToken);

    cookieCutter.set(LOCAL_STORAGE_KEY_SESSION_TOKEN, newSessionToken || "");
  };

  const authenticate = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    const newSessionToken = await new Forge4FlowClient({
      clientKey,
      endpoint,
    }).login();

    if (newSessionToken) {
      updateSessionToken(newSessionToken);
    }
    setIsAuthenticated(true);
    setIsLoading(false);

    return sessionToken !== null;
  }, []);

  const unauthenticate = useCallback((): void => {
    setIsLoading(true);
    updateSessionToken();
    setIsAuthenticated(false);
    setIsLoading(false);
  }, []);

  const validSession = useCallback(async (): Promise<boolean> => {
    if (!sessionToken || sessionToken === "undefined") {
      return false;
    }

    setIsLoading(true);
    const isValidSession = await new Forge4FlowClient({
      clientKey,
      sessionToken,
      endpoint,
    }).verifySession();

    if (!isValidSession) {
      updateSessionToken("");
      setIsAuthenticated(false);
    }

    setIsLoading(false);

    return isValidSession;
  }, [sessionToken]);

  const check = useCallback(
    async (check: Check): Promise<boolean> => {
      if (!sessionToken) {
        throw new Error(
          "No session provided to Forge4Flow. You may have forgotten to call login() to finish initializing Forge4Flow."
        );
      }

      setIsLoading(true);
      const isAuthorized = await new Forge4FlowClient({
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
          "No session provided to Forge4Flow. You may have forgotten to call login() to finish initializing Forge4Flow."
        );
      }

      setIsLoading(true);
      const isAuthorized = await new Forge4FlowClient({
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
          "No session provided to Forge4Flow. You may have forgotten to call login() to finish initializing Forge4Flow."
        );
      }

      setIsLoading(true);
      const hasPermission = await new Forge4FlowClient({
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
          "No session provided to Forge4Flow. You may have forgotten to call login() to finish initializing Forge4Flow."
        );
      }

      setIsLoading(true);
      const hasFeature = await new Forge4FlowClient({
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
    <Forge4FlowContext.Provider
      value={{
        clientKey,
        authenticate,
        unauthenticate,
        sessionToken,
        validSession,
        check,
        checkMany,
        hasPermission,
        hasFeature,
        isLoading,
        isAuthenticated,
      }}
    >
      {children}
    </Forge4FlowContext.Provider>
  );
}

export default Forge4FlowProvider;
