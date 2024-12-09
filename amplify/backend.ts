import { defineBackend } from "@aws-amplify/backend";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { VpcLambdaStack } from "./custom";
// import { auth } from "./auth/resource";
// import { data } from './data/resource';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  // auth,
  // data,
});

const stack = backend.createStack("CustomResources");

const vpc = new ec2.Vpc(stack, "CustomStackVPC");

new VpcLambdaStack(stack, "CustomStackLambda", { vpc });
