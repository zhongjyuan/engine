package common

// UserCount 用于记录用户数量，不是关键值，无需使用原子操作。
var UserCount = 0

// MessageCount 用于记录消息数量，不是关键值，无需使用原子操作。
var MessageCount = 0

// MessageRenderEnabled 表示消息渲染是否启用。
var MessageRenderEnabled = true

// MessagePersistenceEnabled 表示消息持久化是否启用。
var MessagePersistenceEnabled = true
