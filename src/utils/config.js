export default function() {
  let env = process.env.NODE_ENV;
  let url = 'http://api.relatosdereconciliacion';
  url += env === 'production' ? '.com' : '.test';

  return {
    url: url
  };
}
