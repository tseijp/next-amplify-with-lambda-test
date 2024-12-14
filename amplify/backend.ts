import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import FileSystem from "./custom/FileSystem/resource";
import VpcLambda from "./custom/VpcLambda/resource";
import VpcSubnet from "./custom/VpcSubnet/resource";

const backend = defineBackend({ auth });

const stack = backend.createStack("CustomResources");

const { vpc } = new VpcSubnet(stack, "VpcSubnet");

const { accessPoint } = new FileSystem(stack, "FileSystem", { vpc });

new VpcLambda(stack, "VpcLambda", { vpc, accessPoint });
