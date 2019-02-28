import { getFieldsKey } from './utils/getFieldsKey'
import { getObjectSchema, getFieldSchema } from './utils/getSchema'

const SchemaBridge = {
  schema: ({ schema, name, options = {} }) => {
    const {
      fields,
      scalar = [],
      except,
      custom,
      additional = [],
      print = false,
      extend = false
    } = options
    let GqlSchemaContent
    let GraphqlObjsSchema

    // Get fields name
    const fieldName = getFieldsKey({ schema, fields, except })

    // Get new type definitions
    GraphqlObjsSchema = fieldName.objectKeys.map(k =>
      getObjectSchema(schema, k, name, custom)
    )
    GraphqlObjsSchema = GraphqlObjsSchema.length
      ? GraphqlObjsSchema.reduce((a, b) => `${a}${b}`)
      : ''

    // Get GraphQl principal Object content
    GqlSchemaContent = fieldName.keys.map(key =>
      getFieldSchema(schema, key, name, custom)
    )
    GqlSchemaContent = GqlSchemaContent.reduce((a, b) => `${a}${b}`)

    let scalars = ''
    if (options && scalar && scalar.length > 0) {
      scalars = scalar.map(value => `scalar ${value}`)
      scalars = scalars.reduce(
        (a, b) => `${a}
	${b}`
      )
    }
    let toAdd = ''
    if (options && additional && additional.length > 0) {
      toAdd = additional.map(value => `${value}`)
      toAdd = toAdd.reduce(
        (a, b) => `${a}
	${b}`
      )
    }

    const toReturn = `
${scalars}
${GraphqlObjsSchema}
${extend ? 'extend ' : null}type ${name} {
    ${GqlSchemaContent}
    ${toAdd}
}
`
    if (print) {
      console.log('--------START--------')
      console.log(toReturn)
      console.log('---------END---------')
    }
    return toReturn
  }
}

export default SchemaBridge
