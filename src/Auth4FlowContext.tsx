import { createContext } from "react";
import {
  Check,
  CheckMany,
  FeatureCheck,
  PermissionCheck,
} from "@auth4flow/auth4flow-js";

export interface AuthorizationContext {
  clientKey: string;
  sessionToken: string;
  setSessionToken: (sessionToken: string) => void;
  check: (check: Check) => Promise<boolean>;
  checkMany: (check: CheckMany) => Promise<boolean>;
  hasPermission: (check: PermissionCheck) => Promise<boolean>;
  hasFeature: (check: FeatureCheck) => Promise<boolean>;
  isLoading: boolean;
}

const noop = (): never => {
  throw new Error("You didn't wrap your component in <Auth4FlowProvider>!");
};

const Auth4FlowContext = createContext<AuthorizationContext>({
  clientKey: "",
  sessionToken: "",
  setSessionToken: noop,
  check: noop,
  checkMany: noop,
  hasPermission: noop,
  hasFeature: noop,
  isLoading: false,
});

export default Auth4FlowContext;
