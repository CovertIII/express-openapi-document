/* This little service takes an express router object and registers the routes.
 * What is different about this though is it generates a swagger doc as it's registering the routes.
 * That way your routes are auto documented.  You can also pass a json schema object to describe what your
 * body should look like and this will validate real request bodies against the schema and return an
 * error if they fail validation.
 *
 * I'm thinking about doing this differently - instead of actaully registering the routes with express,
 * return an object that can be used by some middleware (defined here)  to register the routes.  That way
 * you have more control over the order in what stuff get registered.  I was thinking in terms of defining
 * roles and permissions when you register the routes as well so they could be documented and actually
 * using that definition validate things as well.  Right now I have a file called aclRules that defines
 * everything, but it might be useful to define them when you register the route as well.
 *
 * Also I want a place to define all the JSON schema definititions and link between them correctly.
 * I need to think how to do that.
 */
const R = require('ramda');
const Ajv = require('ajv');

const checkSchemaMiddleware = schema => (req, res, next) => {
  //First check the body if there is a schema supplied
  const bodySchema = R.pipe(
    R.propOr([], 'parameters'),
    R.find(R.propEq('in', 'body')),
    R.defaultTo({}),
    R.prop('schema')
  )(schema);
  //If there is then actually validate it
  if(bodySchema){
    const ajv = new Ajv();
    const valid = ajv.validate(bodySchema, req.body);
    if(!valid){
      const errors = ajv.errors.map(R.prop('message')).join(', ');
      const error = new Error(errors);
      error.data = ajv.errors;
      error.status = 400;
      return next(error);
    }
  }
  next();
};

//TODO pass in the default open api object to make it generic accross projects
//TODO use the js atom like library to control the mutation
//(like a clojure atom)
const createRouteRegistry = ({router, openAPI}) => {
  const specContainer = openAPI || {
    swagger: '2.0',
    info: {
      description: '',
      version: '1.0.0',
      title: '',
      contact: { email: ''}
    },
    host: 'localhost:3000',
    basePath: '/api',
    tags:[],
    schemes: [ 'http', 'https'],
    paths: {}
  };

  //Private method to add the path, method and schema to the spec
  const register = ({method, path, schema = {} }) => {
    //TODO have this passed in in the begining as well
    const defaultDoc = {
      tags: [path],
      description: 'Auto generated.  Document me please',
      operationId: method + path,
      consumes: ['application/json'],
      produces: ['application/json'],
      responses: {
        '200': {
          description: 'json response',
          content: {
            'application/json': {
              schema: {
                type: 'object'
              }
            }
          }
        }
      }
    };
    schema = R.merge(defaultDoc, schema);
    const existingSpec = R.path(['paths', path, method], specContainer);
    if(!existingSpec){
      console.log('register spec');
      specContainer.paths = R.assocPath([path, method], schema, specContainer.paths);
    }
  };

  const specRouter = {
    //TODO - use ...args - fist one the path, if the last on is an object then pass it as a schema object to the register method,
    // This is mainly to support custom middleware
    // Also if a spec is passed it would be interesting to
    // create a place in the API for the spec to live so it can
    // be accessed via the api so clients can use it for validation on their side
    //if everything after first is a function pass them in order as middlware to epxress - or in an arrary if in the future I'm going to
    //build up the object
    post(path, cb, schema){
      router.post(path, checkSchemaMiddleware(schema), cb);
      register({method: 'post', path, schema});
    },
    put(path, cb, schema){
      router.put(path, cb);
      register({method: 'put', path, schema});
    },
    get(path, cb, schema){
      router.get(path, cb);
      register({method: 'get', path, schema});
    },
    patch(path, cb, schema){
      router.patch(path, cb);
      register({method: 'patch', path, schema});
    },
    delete(path, cb, schema){
      router.delete(path, cb);
      register({method: 'delete', path, schema});
    }
  };

  const getSpec = () => {
    return specContainer;
  };
  return { specRouter, getSpec};
};

module.exports = {
  createRouteRegistry
};
