export default `

    type User {
        id: ID!
        firstName: String!
        lastName: String!
        email: String!
        role: String!
        type: String!
        companyName: String
        website: String

        monthlyRecurringRevenue: Float
        operationCountry: String
        reportingCurrency: String
        phone: String

        onboarded: Boolean!
        emailVerified: Boolean!
        phoneVerified: Boolean!

        createdAt: DateTime!
        updatedAt: DateTime!
    }

    enum UserType {
        INDIVIDUAL
        COMPANY
    }

    enum Country {
        NG
        GH
        KE
    }

    enum Currency {
        NGN
        GHS
        KES
    }

    input NewUser {
        firstName: String!
        lastName: String!
        email: String!
        password: String!
        companyName: String
        website: String
        type: UserType!
    }

    input Login {
        email: String!
        password: String!
    }

    input Phone {
        phone: String!
    }

    input Email {
        email: String!
    }

    input Token {
        token: String!
    }

    input PhoneWithEmail {
        phone: String!
        email: String!
    }

    input OldAndNewPassword {
        newPassword: String!
        oldPassword: String!
    }

    input PasswordWithToken {
        password: String!
        token: String!
    }


    input Onboard {
        monthlyRecurringRevenue: Float!
        operationCountry: Country!
        reportingCurrency: Currency!
        phone: String!
        otp: String!
        companySize: Int
    }

    type Response {
        message: String!
    }

    type ResponseWithUser {
        message: String!
        data: User!
    }

    type UserWithToken {
        user: User!
        token: String
    }

    type ResponseWithUserAndToken {
        message: String!
        data: UserWithToken!
    }

    union RespondWithUser = Error | ResponseWithUser
    union RespondWithUserAndToken = Error | ResponseWithUserAndToken
    union Respond = Error | Response

    type Mutation {
        deleteUser(input: Email!): Respond!
        register(input: NewUser!): RespondWithUser!
        login(input: Login!): RespondWithUserAndToken!
        onboard(input: Onboard!): RespondWithUser!
        requestPhoneVerification(input: Phone!): Respond!
        requestEmailVerification(input: Email!): Respond!
        verifyEmail(input: Token!): Respond!
        updatePassword(input: OldAndNewPassword!): Respond!
        recoverPassword(input: Email!): Respond!
        resetPassword(input: PasswordWithToken!): Respond!

    }

    # type Query {}
`;
