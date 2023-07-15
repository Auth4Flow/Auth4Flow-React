import React, { useEffect, useState } from "react";
import { FeatureCheck } from "@forge4flow/forge4flow-js";
import useForge4Flow from "./useForge4Flow";

export interface FeatureProtectedComponentProps extends FeatureCheck {
  children: React.ReactNode;
}

const FeatureProtectedComponent: React.FunctionComponent<
  FeatureProtectedComponentProps
> = ({ children, featureId, consistentRead, debug }) => {
  const [showChildren, setShowChildren] = useState<boolean>(false);
  const { sessionToken, hasFeature } = useForge4Flow();

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
