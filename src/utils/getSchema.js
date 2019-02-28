import { subGqlType, typeDef, gqlType } from "./utils";

// Get field key definition
export const getFieldSchema = (schema, k, name, custom = {}) => {
	const S = schema._schema;
	const key = k.substr(k.lastIndexOf(".") + 1);
	let value = null;


	// case of nested simpleSchema
	if (!S[k]) {
		return "";
	}

	// use custom type
	if (custom[k]) {
		value = custom[k];
	} else if (typeDef(S, k) === Object) {
		// Only add it if it has fieldName
		if (schema._objectKeys[`${k}.`] && schema._objectKeys[`${k}.`].length) {
			value = `${subGqlType(k, name)}`;
		}
	} else if (typeDef(S, k) === Array && S[`${k}.$`]) {
		if (gqlType[typeDef(S, `${k}.$`)]) {
			value = `[${gqlType[typeDef(S, `${k}.$`)]}]`;
		}
		// Maybe it is an Object
		else if (!value && schema._objectKeys[`${k}.$.`]) {
			value = `[${subGqlType(k, name)}]`;
		}
	} else if (typeDef(S, k) instanceof RegExp) {
		value = `${gqlType[String]}`;
	} else if (typeDef(S, k).constructor.name === "SimpleSchema") {
		value = `${subGqlType(k, name)}`;
	} else {
		value = `${gqlType[typeDef(S, k)]}`;
	}

	if (!value) {
		return "";
	}

	return `
    ${key}: ${value}`;
};


// Set a new GraphQL type definition
export const getObjectSchema = (schema, key, name, custom) => {
	const objectKeys = schema._objectKeys;
	const splitter = objectKeys[`${key}.`] ? "." : objectKeys[`${key}.$.`] ? ".$." : null;
	const getObjectSchemaKey = key + splitter.substr(0, splitter.lastIndexOf("."));

	let content;

	if (!splitter) { return ""; }

	if (typeDef(schema._schema, getObjectSchemaKey).constructor.name === "SimpleSchema") {
		const objectSchema = schema.getObjectSchema(getObjectSchemaKey);
		content = objectKeys[key + splitter].map(k => `${getFieldSchema(objectSchema, k, name, custom)}`);
	} else {
		content = objectKeys[key + splitter].map(k => `${getFieldSchema(schema, `${key + splitter + k}`, name, custom)}`);
	}

	if (!content.length) {
		return "";
	}

	content = content.reduce((a, b) => `${a}${b}`);

	return `
  type ${subGqlType(key, name)} {
    ${content}
  }
  `;
};
