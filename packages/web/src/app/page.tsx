import { Resource } from "sst";

export default async function Home() {
	const data = await fetch(Resource.MyApi.url);
	console.log(Resource);
	return <div>{await data.text()}</div>;
}
