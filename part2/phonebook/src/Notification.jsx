const Notification = ({message, isError}) => {
    if (message === null || message === undefined) {
        return null
    }
    
    const notificationClassName = isError ? "error" : "info"
    return <div className={notificationClassName}>
        {message}
    </div>
}

export default Notification