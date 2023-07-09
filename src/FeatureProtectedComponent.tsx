import React, { useEffect, useState } from "react";
import { FeatureCheck } from "@auth4flow/auth4flow-js";
import useAuth4Flow from "./useAuth4Flow";

export interface FeatureProtectedComponentProps extends FeatureCheck {
  children: React.ReactNode;
}

const FeatureProtectedComponent: React.FunctionComponent<
  FeatureProtectedComponentProps
> = ({ children, featureId, consistentRead, debug }) => {
  const [showChildren, setShowChildren] = useState<boolean>(false);
  const { sessionToken, hasFeature } = useAuth4Flow();

  useEffect(() => {
    if (!featureId) {
      throw new Error(
        "Invalid or no featureId provided to FeatureProtectedComponent"
      );
    }

    const checkWarrant = async () => {
      setShowChildren(await hasFeature({ featureId, consistentRead, debug }));
    };

    if (sessionToken) {
      checkWarrant();
    }
  }, [sessionToken, JSON.stringify(featureId)]);

  if (showChildren) {
    return <>{children}</>;
  }

  return null;
};

export default FeatureProtectedComponent;
