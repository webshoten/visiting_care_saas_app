import { Resource } from "sst";
import { Example } from "@visiting_app/core/example";

console.log(`${Example.hello()} Linked to ${Resource.MyBucket.name}.`);
