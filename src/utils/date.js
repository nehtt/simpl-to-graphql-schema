import { GraphQLScalarType } from "graphql";
import { Kind } from "graphql/language";
import moment from "moment";

export default {
	Date: new GraphQLScalarType({
		name: "Date",
		description: "Date custom scalar type",
		parseValue(value) {
			return moment(value).format(); // value from the client
		},
		serialize(value) {
			return moment(value).format("DD MMMM YYYY"); // value sent to the client
		},
		parseLiteral(ast) {
			if (ast.kind === Kind.INT) {
				return parseInt(ast.value, 10); // ast value is always in string format
			}
			return null;
		},
	}),
};
