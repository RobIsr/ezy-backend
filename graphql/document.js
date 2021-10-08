const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');

const DocumentType = new GraphQLObjectType({
    name: 'Document',
    description: 'This represents a document',
    fields: () => ({
        _id: { type: GraphQLString },
        owner: { type: GraphQLString },
        name: { type: GraphQLString },
        html: { type: GraphQLString },
        allowedUsers: {
            type: GraphQLList(GraphQLString),
            // resolve: (doc) => {
            //     return doc.allowedUsers
            // }
        },
        type: { type: GraphQLNonNull(GraphQLString) }
    })
});

module.exports = DocumentType;