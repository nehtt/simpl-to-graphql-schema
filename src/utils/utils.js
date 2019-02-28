const camel = k => k[0].toUpperCase() + k.substr(1);
// If we have a SimpleSchema key for an Object such as "sublist.subobject.attributes" and the entity name : "List"
// we name the new GraphQL type like: ListSublistSubobjectAttributes
export const subGqlType = (key, name) => name + key.split('.').reduce((a, b) => a + camel(b), '');

// get field type
export const typeDef = (Schema, key) => {
  if (Schema[key].type.constructor.name === 'SimpleSchemaGroup') {
    return Schema[key].type.definitions[0].type;
  }
  return Schema[key].type;
};

export const gqlType = {};
gqlType[String] = 'String';
gqlType[Number] = 'Float';
gqlType[Boolean] = 'Boolean';
gqlType[Date] = 'Date';
gqlType[RegExp] = 'String';
gqlType['SimpleSchema.Integer'] = 'Int';
