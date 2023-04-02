import axios from "axios";

type Item = {
  by: string;
  id: number;
  score: number;
  title: string;
  url: string;
};
export default async function HNews() {
  let { data } = await axios.get<string[]>(
    "https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty"
  );

  data = data.slice(0, 20);

  const stories = await Promise.all(
    data.map((id) => {
      return axios
        .get<Item>(
          `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`
        )
        .then((res) => res.data)
        .catch((err) => {
          console.error("Stories list fetching error");
          console.error(err);
          return {} as Item;
        });
    })
  );

  return (
    <div>
      <h1>News YCombinator - React Server Component</h1>
      {stories.length === 0 ? (
        <p>API returned empty response</p>
      ) : (
        stories.map((story) => {
          return (
            <a key={story.id} href={story.url}>
              <div
                style={{
                  display: "flex",
                  textDecoration: "none",
                  justifyContent: "space-between",
                }}
              >
                <h4>
                  [{story.id}] - {story.title}
                </h4>
                <p>{story.score}</p>
              </div>
            </a>
          );
        })
      )}
    </div>
  );
}
