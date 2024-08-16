const checkUser = (data, identities) => {
    const token = document.cookie.split('=')[1];
    const payload = atob(token.split('.')[1]);
    const { id } = JSON.parse(payload);

    return identities.some(identity => data[identity]?._id === id);
}

export default { checkUser };