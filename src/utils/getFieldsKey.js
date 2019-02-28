export const getFieldsKey = ({ schema, fields, except = [] }, noObjects) => {
  const SchemaValue = schema._schema;

  if (fields && !fields.length) { fields = null; }
  if (except && !except.length) { except = null; }

  // Get firstLevelKeys
  const keys = schema._firstLevelSchemaKeys.filter((k) => {
    if (noObjects && SchemaValue[k].type === Object) { return false; }
    if (fields) { return fields.indexOf(k) > -1; }
    if (except) { return except.indexOf(k) === -1; }
    return true;
  });

    // Get the Objects' keys
  const objectKeys = Object.keys(schema._objectKeys)
    .map((k) => {
      const ind = k.lastIndexOf('.$');
      return k.substring(0, ind > -1 ? ind : k.lastIndexOf('.'));
    })
    .filter((k) => {
      if (fields) { return fields.indexOf(k) > -1; }
      if (except) { return except.indexOf(k) === -1; }
      return true;
    });

  return { keys, objectKeys };
};
