import capitalizeFirstLetter from './capitalizeFirstLetter.js';

const url = `${process.env.NEXT_PUBLIC_API_URL}/api/crap/mine`;

export default () => fetch(url, { credentials: 'include' })
    .then(response => response.json())
    .then(({ data }) => {
        const string = localStorage.getItem('crap');
        if (!string) return;
        const crap = JSON.parse(string);

        const { updates, addedItems } = data.reduce((acc, newItem) => {
            const oldItem = crap.find(item => item._id === newItem._id);
            if (oldItem) {
                if (oldItem.status !== newItem.status) {
                    acc.updates.push({
                        oldStatus: oldItem.status,
                        newStatus: newItem.status,
                        title: oldItem.title,
                    });
                }
            } else {
                acc.addedItems.push({
                    status: newItem.status,
                    title: newItem.title,
                });
            }
            
            return acc;
        }, { updates: [], addedItems: [] });

        const updatesMessage = updates.length > 0 
            ? `🟡Updates Craps:\n${updates.map(({ title, oldStatus, newStatus }) => `${title}: ${capitalizeFirstLetter(oldStatus)} ➡️ ${capitalizeFirstLetter(newStatus)}`).join('\n')}`
            : '';
        const addedItemsMessage = addedItems.length > 0 
            ? `🟢New Craps:\n${addedItems.map(({ title, status }) => `${title}: ${capitalizeFirstLetter(status)}`).join('\n')}`
            : '';
        const message = [updatesMessage, addedItemsMessage].filter(Boolean).join('\n\n');
        message && alert(message);

        localStorage.removeItem('crap');
    })
    .catch(console.error);