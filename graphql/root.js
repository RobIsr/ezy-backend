const {
    GraphQLObjectType,
    GraphQLList,
    GraphQLString,
    GraphQLNonNull
} = require('graphql');

const { ObjectId } = require('bson');

const UserType = require("./user.js");
const DocumentType = require("./document.js");
const queries = require('../db/queries.js');

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        users: {
            type: GraphQLList(UserType),
            description: 'List of all users',
            resolve: async function(_id) {
                return await queries.getAllUsers();
            }
        },
        allDocuments: {
            type: GraphQLList(DocumentType),
            description: 'List of all documents available for user',
            args: {
                username: {type: GraphQLString}
            },
            resolve: async function(parent, args) {
                //let documents = [];
                console.log("Username: ", args.username);
                let documents = [];
                // Get all documents from the collection.
                const users = await queries.getAllUsers();

                users.forEach((user) =>  {
                    user.documents.forEach((doc) => {
                        if (doc.allowedUsers.includes(args.username) ||
                        doc.owner === args.username) {
                            documents.push(doc);
                        }
                    });
                });

                return documents;
            }
        },
        oneDocument: {
            type: DocumentType,
            description: 'List of allowed users for document.',
            args: {
                username: {type: GraphQLString},
                docId: {type: GraphQLString}
            },
            resolve: async function(parent, args) {
                console.log("GQL: ", args.username, " ", args.docId);
                const document = await queries.getOneDocument(args.username, ObjectId(args.docId));
                return document[0];
            }
        }
    })
});

module.exports = RootQueryType;