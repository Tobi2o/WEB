class ServerError {
    constructor(error, reason, details) {
        this.error = error;
        this.reason = reason;
        this.details = details;
    }
}

export function userNotInConversationError(user, conversation) {
    return new ServerError(
        "Operation not permitted",
        "User is not part of the conversation",
        {
            user: {
                displayName: user.displayName,
                id: user.id,
            },
            conversation: {
                uid: conversation.uid,
            },
        })
}

export function conversationNotFoundError() {
    return "Conversation not found"
}

export function emptyMessageError(user, receiver) {
    let details = {}
    if (user && receiver) {
        details = {
            message: "",
            sender: {
                displayName: user.displayName,
                id: user.id,
            },
            receiver: {
                displayName: receiver.displayName,
                id: receiver.id,
            },
        }
    }
    return new ServerError(
        "Operation not permitted",
        "Message is empty",
        details
    )
}