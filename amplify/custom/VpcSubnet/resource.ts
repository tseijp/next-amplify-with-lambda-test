// amplify/custom/VpcSubnet/resource.ts
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

export default class VpcSubnet extends Construct {
  public readonly vpc: ec2.Vpc;
  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.vpc = new ec2.Vpc(scope, "Vpc", {
      cidr: "192.168.0.0/24",
      subnetConfiguration: [
        {
          cidrMask: 26,
          name: "VpcSubnet",
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
      maxAzs: 2,
    });
  }
}
