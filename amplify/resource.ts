import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

interface Props {
  vpc: ec2.Vpc;
}

export class VpcLambdaStack extends Construct {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);

    const { vpc } = props;

    const fn = new NodejsFunction(this, "VpcLambdaFunction", {
      entry: "amplify/handler.mjs",
      handler: "handler",
      runtime: lambda.Runtime.NODEJS_18_X,
      vpc,
    });

    new cdk.CfnOutput(this, "VpcLambdaFunctionArn", {
      value: fn.functionArn,
      exportName: "VpcLambdaFunctionArn",
    });
  }
}
