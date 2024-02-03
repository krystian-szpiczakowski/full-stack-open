const validate = (user) => {
    const errors = [];

    if (!user.username || user.username.length < 3) {
        errors.push({
            message: "Username must be minimum 3 characters long"
        })
    }

    if (!user.password || user.password.length < 3) {
        errors.push({
            message: "Password must be minimum 3 characters long"
        })
    }

    return errors;
}

module.exports = validate;