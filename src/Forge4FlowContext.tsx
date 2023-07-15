import { createContext } from "react";
import {
  Check,
  CheckMany,
  FeatureCheck,
  PermissionCheck,
} from "@forge4flow/forge4flow-js";

export interface AuthorizationContext {
  clientKey: string;
  authenticate: () => Promise<boolean>;
  unauthenticate: () => void;
  sessionToken: string;
  validSession: () => Promise<boolean>;
  check: (check: Check) => Promise<boolean>;
  checkMany: (check: CheckMany) => Promise<boolean>;
  hasPermission: (check: PermissionCheck) => Promise<boolean>;
  hasFeature: (check: FeatureCheck) => Promise<boolean>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const noop = (): never => {
  throw new Error("You didn't wrap your component in <Forge4FlowProvider>!");
};

const Forge4FlowContext = createContext<AuthorizationContext>({
  clientKey: "",
  authenticate: noop,
  unauthenticate: noop,
  sessionToken: "",
  validSession: noop,
  check: noop,
  checkMany: noop,
  hasPermission: noop,
  hasFeature: noop,
  isLoading: false,
  isAuthenticated: false,
});

export default Forge4FlowContext;
