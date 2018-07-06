package org.gpp.milklab.model.security

import graphql.ErrorType
import graphql.GraphQLError
import graphql.language.SourceLocation

class GraphQLErrorImp(
        val messageText: String
): GraphQLError {
    override fun getMessage(): String {
        return messageText
    }

    override fun getErrorType(): ErrorType {
        return ErrorType.ExecutionAborted
    }

    override fun getLocations(): MutableList<SourceLocation> {
        return mutableListOf()
    }
}