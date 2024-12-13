import { defineBackend } from "@aws-amplify/backend";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { auth } from "./auth/resource";
import FileSystem from "./custom/FileSystem/resource";
import VpcLambda from "./custom/VpcLambda/resource";

const backend = defineBackend({ auth });

const stack = backend.createStack("CustomResources");

const vpc = new ec2.Vpc(stack, "CustomStackVpc", {
  cidr: "192.168.0.0/24",
  subnetConfiguration: [
    {
      cidrMask: 26,
      name: "CustomStackVpcSubnet",
      subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
    },
  ],
  maxAzs: 2,
});

const { accessPoint } = new FileSystem(stack, "FileSystem", { vpc });

new VpcLambda(stack, "VpcLambda", { vpc, accessPoint });
