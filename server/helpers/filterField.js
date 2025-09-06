const filterFieldUser = (user) => {
    if (!user) return {}
    return {
        name: user.name,
        phone: user.phone,
        avatar: user.avatar,
        email: user.email,
        purchasePoint: user.purchasePoint,
        isAdmin: user.isAdmin
    }
}

export {filterFieldUser}