export default `

    scalar Any

    scalar DateTime

    type Error {
        message: String!
        code: String!
        status: Int!
    }

    type History {
        description: String!
        author: String!
        date: DateTime!
    }
    
`;
