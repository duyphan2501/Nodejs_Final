const filterFieldUser = (user) => {
    if (!user) return {}
    return {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        avatar: user.avatar,
        email: user.email,
        purchasePoint: user.purchasePoint,
        isAdmin: user.isAdmin,
        isVerified: user.isVerified,
    }
}

export {filterFieldUser}