export const formatData = (data) => {
    return data.map(item => ({
        ...item,
        createdAt: new Date(item.createdAt).toLocaleString(),
    }));
};

export const handleResponse = (response) => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};