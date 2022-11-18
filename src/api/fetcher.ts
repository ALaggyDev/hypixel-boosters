export default async function hypixelApiFetcher(subUrl: string) {
  const res = await fetch(`https://api.hypixel.net${subUrl}`, {
    headers: {
      'Api-Key': process.env.HYPIXEL_API_KEY as string
    }
  });
  const json = await res.json();

  if (!json.success)
    throw new Error(
      `Error in fetching data from ${`https://api.hypixel.net${subUrl}`}. Reported Cause:\n${json.cause}`
    );

  return json;
}
