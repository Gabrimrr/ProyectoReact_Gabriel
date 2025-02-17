import { algoliasearch } from 'algoliasearch';

const client = algoliasearch('30U30XPPTN', 'e350b20bdde56cb600a6c1ea22c37ab1');

// Fetch and index objects in Algolia
const processRecords = async () => {
  const datasetRequest = await fetch('https://https://fakestoreapi.com/products');
  const movies = await datasetRequest.json();
  return await client.saveObjects({ indexName: 'movies_index', objects: movies });
};

processRecords()
  .then(() => console.log('Successfully indexed objects!'))
  .catch((err) => console.error(err));
