import { component$, Resource } from '@builder.io/qwik';
import { action$, DocumentHead, Form, loader$ } from '@builder.io/qwik-city';

export const getStarWarsCharacters = loader$(async () => {
  const response = await fetch('https://swapi.dev/api/people/');
  const data = await response.json();
  return data.results;
});

export const searchPlanets = action$(async ({ search }) => {
  const response = await fetch(
    `https://swapi.dev/api/planets/?search=${search}`
  );
  const data = await response.json();

  return data.results;
});

export default component$(() => {
  const characters = getStarWarsCharacters.use();
  const planetSearchAction = searchPlanets.use();

  return (
    <div class="bg-slate-400 p-6">
      <h1 class="text-3xl">Welcome to Qwik</h1>
      <section class="mt-6">
        <Resource
          value={characters}
          onPending={() => <div>loading...</div>}
          onRejected={() => <div>error!</div>}
          onResolved={(characters) => {
            return (
              <ul class="ml-4 list-disc">
                {characters?.map((character: any) => (
                  <li class="text-xl">{character?.name}</li>
                ))}
              </ul>
            );
          }}
        ></Resource>
      </section>
      <section class="bg-purple-400">
        <Form action={planetSearchAction}>
          <h2>Search for plants from star wars</h2>
          <input name="search"></input>

          <button class="p-3 hover:bg-blue-200 bg-blue-500 rounded-md">
            Search planet
          </button>
          {planetSearchAction.isRunning && <p>Searching...</p>}
          {planetSearchAction.value && (
            <p>
              Search results:{' '}
              {JSON.stringify(planetSearchAction.value, null, 2)}
            </p>
          )}
        </Form>
      </section>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Welcome to Qwik',
  meta: [
    {
      name: 'description',
      content: 'Qwik site description',
    },
  ],
};
