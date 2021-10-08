const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');
const DocumentType = require("./document.js");

const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'This represents a user',
    fields: () => ({
        _id: { type: GraphQLNonNull(GraphQLString) },
        username: { type: GraphQLNonNull(GraphQLString) },
        documents: {
            type: GraphQLList(DocumentType),
            resolve: (user) => {
                return user.documents
            }
        },
        type: { type: GraphQLNonNull(GraphQLString) }
    })
});

module.exports = UserType;