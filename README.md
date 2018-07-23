# Simpl To GraphQL Schema

  
This is new updated and improved fork of [# Simple Schema - GraphQL Schema Bridge](https://github.com/kuip/meteor-schema-graphql-bridge) except it doesn't build your resolvers.

> Change only your Meteor Simple Schema: GraphQL schema are updated automatically.
> 
> Define your Simple Schemas for your collection and let `simpl-to-graphql-schema`  do the tedious work of defining the schema's basic fields and resolvers, for you.

This tool works with Meteor Framework.

- Installation

`npm install --save simpl-to-graphql-schema`

- Your simple schema

```js
import SimpleSchema from 'simpl-schema';
import { Mongo } from 'meteor/mongo';

// Define your collection
const Items = new Mongo.Collection('items');

//build your schema with SimpleSchema as usual
const Schemas = new SimpleSchema({
  _id: {
    type: String,
  },
  name: {
    type: String,
    label: "Item name",
  },
  ownerId: {
    type: String,
    label: "Owner identification",
  },
  createdAt: {
    type: String,
    label: "Item creation date",
  },
  updatedAt: {
    type: String,
    label: "Item last update",
  },
});

export default Schemas;
Items.attachSchema(Schemas);
```
- Your GraphQL schema

```js
import SimpleToGraphql from 'simpl-to-graphql';
import Schemas from './items';

const schemaGql = SimpleToGraphql.schema({ 
	// Your simple schema
	schema: Schemas, 
	// your grapqhl schema name
	name: 'Items', 
	// SimpleToGraphql options
	options: {
		// create schema only for those fields in an Array
		fields: ['name', 'ownerId', 'createdAt'],
		// insert scalars in an Array	
		scalar: ['Date'],
		// create schema except for those fields in an Array
        except: ['updatedAt'],
        // change fields type
        custom: {
            createdAt: "Date",
            updatedAt: "Date"
        },
		// add fields to your generated schema
		additional: [
			'checked: Boolean'
			'usersList: [Users]'
    ],
		// console.log() your generated schema
		print: true, //default false
	}
});
export default schemaGql;
```
- Your resolvers

```js
//in case your want to use the built in Date scalar
import { DateScalar } from 'simpl-to-graphql';
// collections
import Items from '/imports/api/pages/pages'

export default {
    Query: {
      item: (root, args, { userId }) => Items.findOne({ ownerId: userId }),
      items: (root, args, { userId }) => Items.find({ ownerId: userId }).fetch(),
    },
    // you can put it here or in your merge of resolvers with DateScalar
    Date: DateScalar.Date
  };
```